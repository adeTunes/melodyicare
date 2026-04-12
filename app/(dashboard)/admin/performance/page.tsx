'use client'

import { BarChart3, Star, CheckCircle, AlertTriangle } from 'lucide-react'

import { useUsersByRole } from '@/lib/hooks/admin/useUsers'
import { useAllCaregiverProfiles, useAllVisits, useAllIncidents } from '@/lib/hooks/admin/useAdminData'

import { PageHeader } from '@/components/layout/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
import { LoadingCards } from '@/components/shared/LoadingState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function AdminPerformancePage() {
  const { data: caregivers, isLoading: loadingCaregivers } = useUsersByRole('caregiver')
  const { data: profiles, isLoading: loadingProfiles } = useAllCaregiverProfiles()
  const { data: visits, isLoading: loadingVisits } = useAllVisits()
  const { data: incidents } = useAllIncidents()

  const isLoading = loadingCaregivers || loadingProfiles || loadingVisits

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Performance' description='Caregiver performance analytics' />
        <LoadingCards />
      </div>
    )
  }

  const totalVisits = visits?.length ?? 0
  const completedVisits = visits?.filter((v) => v.status === 'completed').length ?? 0
  const missedVisits = visits?.filter((v) => v.status === 'missed').length ?? 0
  const completionRate = totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 100) : 0

  const avgRating = profiles && profiles.length > 0
    ? profiles.reduce((s, p) => s + p.rating, 0) / profiles.length
    : 0

  // Top performers by rating
  const rankedCaregivers = (profiles ?? [])
    .filter((p) => p.totalReviews > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)
    .map((p) => {
      const user = caregivers?.find((c) => c.uid === p.uid)
      return { ...p, name: user ? `${user.firstName} ${user.lastName}` : p.uid }
    })

  return (
    <div className='space-y-6'>
      <PageHeader title='Performance' description='Caregiver performance analytics' />

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard title='Avg Rating' value={avgRating > 0 ? avgRating.toFixed(1) : 'N/A'} icon={Star} />
        <StatsCard title='Completion Rate' value={`${completionRate}%`} description={`${completedVisits} of ${totalVisits}`} icon={CheckCircle} />
        <StatsCard title='Missed Visits' value={missedVisits} icon={AlertTriangle} />
        <StatsCard title='Active Caregivers' value={caregivers?.filter((c) => c.status === 'approved').length ?? 0} icon={BarChart3} />
      </div>

      {/* Overall Completion */}
      <Card>
        <CardHeader><CardTitle>Overall Visit Completion</CardTitle></CardHeader>
        <CardContent className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>Completion Rate</span>
            <span className='font-medium'>{completionRate}%</span>
          </div>
          <Progress value={completionRate} />
          <div className='grid grid-cols-3 gap-4 text-center mt-4'>
            <div className='rounded-lg bg-green-50 p-3'>
              <p className='text-2xl font-bold text-green-700'>{completedVisits}</p>
              <p className='text-xs text-green-600'>Completed</p>
            </div>
            <div className='rounded-lg bg-blue-50 p-3'>
              <p className='text-2xl font-bold text-blue-700'>{visits?.filter((v) => v.status === 'scheduled').length ?? 0}</p>
              <p className='text-xs text-blue-600'>Scheduled</p>
            </div>
            <div className='rounded-lg bg-red-50 p-3'>
              <p className='text-2xl font-bold text-red-700'>{missedVisits}</p>
              <p className='text-xs text-red-600'>Missed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      {rankedCaregivers.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Top Performers</CardTitle></CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {rankedCaregivers.map((cg, i) => (
                <div key={cg.uid} className='flex items-center justify-between rounded-lg border p-3'>
                  <div className='flex items-center gap-3'>
                    <span className='flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary'>
                      {i + 1}
                    </span>
                    <div>
                      <p className='font-medium text-sm'>{cg.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {cg.metrics.completedVisits} visits · {cg.yearsOfExperience}yr exp
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Star className='size-4 fill-yellow-400 text-yellow-400' />
                    <span className='font-medium'>{cg.rating.toFixed(1)}</span>
                    <span className='text-xs text-muted-foreground'>({cg.totalReviews})</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
