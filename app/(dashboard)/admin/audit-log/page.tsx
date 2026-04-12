'use client'

import { useState } from 'react'
import { Activity, Search } from 'lucide-react'

import { useAuditLog } from '@/lib/hooks/admin/useAdminData'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function AuditLogPage() {
  const { data: entries, isLoading } = useAuditLog()
  const [search, setSearch] = useState('')

  const filtered = entries?.filter((e) =>
    `${e.action} ${e.targetCollection} ${e.actorId}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='space-y-6'>
      <PageHeader title='Audit Log' description='System activity and change history' />

      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='Search actions, collections...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-10'
        />
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : !filtered?.length ? (
        <EmptyState icon={Activity} title='No audit entries' description='System activity will be logged here.' />
      ) : (
        <div className='space-y-2'>
          {filtered.map((entry) => (
            <Card key={entry.id}>
              <CardContent className='flex items-start justify-between py-3'>
                <div className='space-y-0.5'>
                  <p className='text-sm font-medium'>{entry.action}</p>
                  <p className='text-xs text-muted-foreground'>
                    {entry.targetCollection}/{entry.targetId}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    By: {entry.actorId} ({entry.actorRole})
                  </p>
                  {entry.details && (
                    <pre className='text-xs text-muted-foreground bg-muted rounded p-1 mt-1 max-w-lg overflow-auto'>
                      {JSON.stringify(entry.details, null, 2)}
                    </pre>
                  )}
                </div>
                <span className='text-xs text-muted-foreground whitespace-nowrap'>
                  {entry.timestamp.toDate().toLocaleString('en-NG')}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
