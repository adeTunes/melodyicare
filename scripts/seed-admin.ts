/**
 * Seed script to create an admin user in Firebase.
 *
 * Usage:
 *   bun run scripts/seed-admin.ts
 *
 * Requires .env.local with Firebase Admin SDK credentials.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

// Load env vars
const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin SDK credentials in .env.local')
  console.error('Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY')
  process.exit(1)
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  })
}

const auth = getAuth()
const db = getFirestore()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@melodyicare.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345'
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || 'Admin'
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || 'User'

async function seedAdmin() {
  console.log(`\nCreating admin account: ${ADMIN_EMAIL}\n`)

  try {
    // Check if user already exists
    try {
      const existing = await auth.getUserByEmail(ADMIN_EMAIL)
      console.log(`User already exists with UID: ${existing.uid}`)
      console.log('Updating Firestore document...')

      await db.collection('users').doc(existing.uid).set({
        uid: existing.uid,
        email: ADMIN_EMAIL,
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        phone: '',
        role: 'admin',
        status: 'approved',
        photoURL: '',
        notificationPrefs: { email: true, sms: false, push: false },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true })

      console.log('\n✅ Admin account ready!')
      console.log(`   Email: ${ADMIN_EMAIL}`)
      console.log(`   UID: ${existing.uid}`)
      return
    } catch {
      // User doesn't exist, create new
    }

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: `${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`,
    })

    // Create Firestore user document
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: ADMIN_EMAIL,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      phone: '',
      role: 'admin',
      status: 'approved',
      photoURL: '',
      notificationPrefs: { email: true, sms: false, push: false },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    console.log('\n✅ Admin account created!')
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log(`   UID: ${userRecord.uid}`)
    console.log('\n⚠️  Change the password after first login!')
  } catch (error) {
    console.error('\n❌ Failed to create admin:', error)
    process.exit(1)
  }
}

seedAdmin()
