import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { createStaffSchema } from '@/lib/validations/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createStaffSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password, firstName, lastName, phone, specializations } = parsed.data

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    })

    const now = new Date()
    await adminDb.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      phone,
      role: 'caregiver',
      status: 'approved',
      firstName,
      lastName,
      createdAt: now,
      updatedAt: now,
      approvedAt: now,
      approvedBy: 'admin',
    })

    await adminDb.collection('caregiverProfiles').doc(userRecord.uid).set({
      uid: userRecord.uid,
      specializations,
      certifications: [],
      yearsOfExperience: 0,
      languages: ['English'],
      bio: '',
      availabilityZones: [],
      rating: 0,
      totalRatings: 0,
      totalVisitsCompleted: 0,
      visitCompletionRate: 0,
    })

    return NextResponse.json({ uid: userRecord.uid, email }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
