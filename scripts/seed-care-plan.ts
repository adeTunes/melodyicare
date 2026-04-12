/**
 * Seeds a care plan for the E2E client, assigned to the E2E caregiver.
 * Usage: bun run scripts/seed-care-plan.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin SDK credentials in .env.local')
  process.exit(1)
}

if (getApps().length === 0) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}

const db = getFirestore()

async function run() {
  // Look up the E2E client + caregiver
  const clientSnap = await db.collection('users')
    .where('email', '==', 'e2e.client.1775740944@melodyicare.test')
    .limit(1)
    .get()
  const caregiverSnap = await db.collection('users')
    .where('email', '==', 'e2e.caregiver.1775740944@melodyicare.test')
    .limit(1)
    .get()

  if (clientSnap.empty || caregiverSnap.empty) {
    console.error('E2E client or caregiver not found')
    process.exit(1)
  }

  const client = clientSnap.docs[0]
  const caregiver = caregiverSnap.docs[0]

  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() + 1)
  const end = new Date(today)
  end.setDate(end.getDate() + 30)

  const carePlanRef = db.collection('carePlans').doc()
  await carePlanRef.set({
    id: carePlanRef.id,
    clientId: client.id,
    clientName: `${client.get('firstName')} ${client.get('lastName')}`,
    caregiverId: caregiver.id,
    caregiverName: `${caregiver.get('firstName')} ${caregiver.get('lastName')}`,
    title: 'E2E Elderly Care — Daily Visits',
    status: 'active',
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    frequency: 'daily',
    tasks: [
      { id: 't1', title: 'Morning medication', description: 'Administer morning meds', frequency: 'daily', required: true },
      { id: 't2', title: 'Vital signs check', description: 'Blood pressure, pulse, temperature', frequency: 'daily', required: true },
      { id: 't3', title: 'Light meal prep', description: 'Assist with breakfast and lunch', frequency: 'daily', required: false },
    ],
    notes: 'E2E seed care plan. Focus on companionship and medication adherence.',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  console.log(`\nCreated care plan ${carePlanRef.id}`)
  console.log(`  clientId: ${client.id}`)
  console.log(`  caregiverId: ${caregiver.id}`)

  // Also create one scheduled visit for today so the caregiver dashboard shows it
  const visitRef = db.collection('visits').doc()
  const todayStr = today.toISOString().split('T')[0]
  await visitRef.set({
    id: visitRef.id,
    carePlanId: carePlanRef.id,
    clientId: client.id,
    clientName: `${client.get('firstName')} ${client.get('lastName')}`,
    caregiverId: caregiver.id,
    caregiverName: `${caregiver.get('firstName')} ${caregiver.get('lastName')}`,
    scheduledDate: todayStr,
    scheduledStartTime: '09:00',
    scheduledEndTime: '17:00',
    status: 'scheduled',
    tasks: [],
    notes: '',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
  console.log(`Created visit ${visitRef.id} for ${todayStr}`)
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
