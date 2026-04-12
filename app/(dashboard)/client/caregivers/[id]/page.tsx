'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, Globe, Award, Briefcase } from 'lucide-react'

import { useCaregiverProfile, useCaregiverUser } from '@/lib/hooks/client/useCaregiverProfile'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingPage } from '@/components/shared/LoadingState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function CaregiverProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { data: profile, isLoading: loadingProfile } = useCaregiverProfile(id)
  const { data: user, isLoading: loadingUser } = useCaregiverUser(id)

  if (loadingProfile || loadingUser) return <LoadingPage />
  if (!profile || !user) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Caregiver Not Found' />
        <Button variant='outline' onClick={() => history.back()}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Caregiver Profile'>
        <Button variant='outline' onClick={() => history.back()}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </PageHeader>

      {/* Profile Header */}
      <Card>
        <CardContent className='flex items-center gap-6 py-6'>
          <Avatar className='size-20'>
            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.firstName} />}
            <AvatarFallback className='text-2xl'>
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className='text-xl font-semibold'>
              {user.firstName} {user.lastName.charAt(0)}.
            </h2>
            <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
              <span className='flex items-center gap-1'>
                <Star className='size-4 text-yellow-500 fill-yellow-500' />
                {profile.rating.toFixed(1)} ({profile.totalReviews} reviews)
              </span>
              <span className='flex items-center gap-1'>
                <Briefcase className='size-4' />
                {profile.yearsOfExperience} years exp.
              </span>
              <span className='flex items-center gap-1'>
                <Award className='size-4' />
                {profile.metrics.totalVisits} visits
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Specializations */}
        <Card>
          <CardHeader><CardTitle className='text-lg'>Specializations</CardTitle></CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {profile.specializations.map((spec) => (
                <Badge key={spec} variant='secondary'>{spec}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader><CardTitle className='text-lg'>Languages</CardTitle></CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {profile.languages.map((lang) => (
                <Badge key={lang} variant='outline'>
                  <Globe className='mr-1 size-3' /> {lang}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio */}
      {profile.bio && (
        <Card>
          <CardHeader><CardTitle className='text-lg'>About</CardTitle></CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {profile.certifications.length > 0 && (
        <Card>
          <CardHeader><CardTitle className='text-lg'>Certifications</CardTitle></CardHeader>
          <CardContent className='space-y-3'>
            {profile.certifications.map((cert, i) => (
              <div key={i} className='flex items-center gap-3 rounded-lg border p-3'>
                <Award className='size-5 text-primary shrink-0' />
                <div>
                  <p className='text-sm font-medium'>{cert.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {cert.issuingOrganization} &middot; {cert.issueDate}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
