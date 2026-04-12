'use client'

import { useState, useEffect } from 'react'
import { CalendarOff, Save } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/lib/hooks/useAuth'
import { useCaregiverAvailability } from '@/lib/hooks/caregiver/useAvailability'
import { setDocument } from '@/lib/firebase/firestore'
import type { WeeklyScheduleEntry } from '@/lib/types'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingCards } from '@/components/shared/LoadingState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const DEFAULT_SCHEDULE: WeeklyScheduleEntry[] = DAY_NAMES.map((_, i) => ({
  dayOfWeek: i,
  startTime: '08:00',
  endTime: '17:00',
  isAvailable: i >= 1 && i <= 5,
}))

export default function AvailabilityPage() {
  const { user } = useAuth()
  const { data: availability, isLoading, refetch } = useCaregiverAvailability(user?.uid)
  const [schedule, setSchedule] = useState<WeeklyScheduleEntry[]>(DEFAULT_SCHEDULE)
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [newBlockedDate, setNewBlockedDate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (availability) {
      setSchedule(availability.weeklySchedule)
      setBlockedDates(availability.blockedDates)
    }
  }, [availability])

  function updateDay(dayOfWeek: number, updates: Partial<WeeklyScheduleEntry>) {
    setSchedule((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, ...updates } : s))
    )
  }

  function addBlockedDate() {
    if (newBlockedDate && !blockedDates.includes(newBlockedDate)) {
      setBlockedDates((prev) => [...prev, newBlockedDate].sort())
      setNewBlockedDate('')
    }
  }

  function removeBlockedDate(date: string) {
    setBlockedDates((prev) => prev.filter((d) => d !== date))
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    try {
      await setDocument('availability', user.uid, {
        caregiverId: user.uid,
        weeklySchedule: schedule,
        blockedDates,
      })
      toast.success('Availability updated!')
      refetch()
    } catch {
      toast.error('Failed to update availability.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <LoadingCards />

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Availability' description='Manage your weekly schedule and blocked dates' />
        <Button onClick={handleSave} disabled={saving}>
          <Save className='mr-2 size-4' />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {schedule.map((entry) => (
            <div
              key={entry.dayOfWeek}
              className='flex items-center gap-4 rounded-lg border p-3'
            >
              <div className='w-28 shrink-0'>
                <p className='font-medium text-sm'>{DAY_NAMES[entry.dayOfWeek]}</p>
              </div>
              <Switch
                checked={entry.isAvailable}
                onCheckedChange={(checked: boolean) =>
                  updateDay(entry.dayOfWeek, { isAvailable: checked })
                }
              />
              {entry.isAvailable ? (
                <div className='flex items-center gap-2 flex-1'>
                  <Input
                    type='time'
                    value={entry.startTime}
                    onChange={(e) => updateDay(entry.dayOfWeek, { startTime: e.target.value })}
                    className='w-32'
                  />
                  <span className='text-muted-foreground'>to</span>
                  <Input
                    type='time'
                    value={entry.endTime}
                    onChange={(e) => updateDay(entry.dayOfWeek, { endTime: e.target.value })}
                    className='w-32'
                  />
                </div>
              ) : (
                <span className='text-sm text-muted-foreground'>Unavailable</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Blocked Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Blocked Dates</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-2'>
            <Input
              type='date'
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <Button variant='outline' onClick={addBlockedDate} disabled={!newBlockedDate}>
              Add Date
            </Button>
          </div>
          {blockedDates.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No blocked dates. Add dates when you are unavailable.</p>
          ) : (
            <div className='flex flex-wrap gap-2'>
              {blockedDates.map((date) => (
                <div
                  key={date}
                  className='flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm text-red-700'
                >
                  <CalendarOff className='size-3' />
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-NG', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  <button
                    onClick={() => removeBlockedDate(date)}
                    className='ml-1 text-red-500 hover:text-red-700'
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
