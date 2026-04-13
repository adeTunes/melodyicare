/**
 * Seed script to create service types for the care request form.
 *
 * Usage:
 *   bun run scripts/seed-service-types.ts
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
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  })
}

const db = getFirestore()

const SERVICE_TYPES = [
  {
    id: 'elderly-care',
    name: 'Elderly Care',
    description: 'Companionship, personal care, and daily support for older adults.',
    category: 'home-care',
    priceRange: { min: 15000, max: 25000, unit: 'per-day' },
    features: ['Personal care assistance', 'Meal preparation', 'Companionship'],
    isActive: true,
  },
  {
    id: 'post-surgery',
    name: 'Post-Surgery Recovery',
    description: 'Short-term in-home care during recovery after a procedure.',
    category: 'medical',
    priceRange: { min: 20000, max: 35000, unit: 'per-day' },
    features: ['Wound care', 'Medication management', 'Mobility support'],
    isActive: true,
  },
  {
    id: 'dementia-care',
    name: 'Dementia & Alzheimer\'s Support',
    description: 'Specialized memory care from trained caregivers.',
    category: 'specialized',
    priceRange: { min: 22000, max: 40000, unit: 'per-day' },
    features: ['Memory care activities', 'Safety monitoring', 'Routine management'],
    isActive: true,
  },
  {
    id: 'live-in-care',
    name: 'Live-in Care',
    description: 'Round-the-clock care with a live-in caregiver.',
    category: 'home-care',
    priceRange: { min: 150000, max: 250000, unit: 'per-month' },
    features: ['24/7 availability', 'Household support', 'Personal care'],
    isActive: true,
  },
]

async function seed() {
  console.log(`\nSeeding ${SERVICE_TYPES.length} service types...\n`)
  const batch = db.batch()
  for (const svc of SERVICE_TYPES) {
    const ref = db.collection('serviceTypes').doc(svc.id)
    batch.set(ref, {
      ...svc,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
  }
  await batch.commit()
  console.log('Service types seeded.')
  for (const svc of SERVICE_TYPES) console.log(`  - ${svc.id}: ${svc.name}`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
