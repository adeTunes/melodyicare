'use client'

import { useState } from 'react'
import { Download, FileText, Users, Calendar, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

import { useAllUsers } from '@/lib/hooks/admin/useUsers'
import { useAllVisits, useAllInvoices } from '@/lib/hooks/admin/useAdminData'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

interface ExportOption {
  key: string
  title: string
  description: string
  icon: typeof FileText
}

const EXPORTS: ExportOption[] = [
  { key: 'users', title: 'Users', description: 'All registered users', icon: Users },
  { key: 'visits', title: 'Visits', description: 'All visit records', icon: Calendar },
  { key: 'invoices', title: 'Invoices', description: 'All invoices', icon: CreditCard },
]

export default function ExportPage() {
  const { data: users } = useAllUsers()
  const { data: visits } = useAllVisits()
  const { data: invoices } = useAllInvoices()
  const [exporting, setExporting] = useState<string | null>(null)

  function handleExport(key: string) {
    setExporting(key)
    try {
      switch (key) {
        case 'users':
          if (!users?.length) { toast.error('No data to export.'); break }
          downloadCSV('users.csv', ['UID', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status'], users.map((u) => [u.uid, u.firstName, u.lastName, u.email, u.phone ?? '', u.role, u.status]))
          toast.success('Users exported!')
          break
        case 'visits':
          if (!visits?.length) { toast.error('No data to export.'); break }
          downloadCSV('visits.csv', ['ID', 'Client', 'Caregiver', 'Date', 'Start', 'End', 'Status', 'Tasks'], visits.map((v) => [v.id, v.clientName, v.caregiverName, v.scheduledDate, v.scheduledStartTime, v.scheduledEndTime, v.status, String(v.tasks.length)]))
          toast.success('Visits exported!')
          break
        case 'invoices':
          if (!invoices?.length) { toast.error('No data to export.'); break }
          downloadCSV('invoices.csv', ['ID', 'Client', 'Total', 'Status', 'Due Date', 'Currency'], invoices.map((i) => [i.id, i.clientName, String(i.total), i.status, i.dueDate, i.currency]))
          toast.success('Invoices exported!')
          break
      }
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Export Data' description='Download data as CSV files' />

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {EXPORTS.map((exp) => (
          <Card key={exp.key}>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                  <exp.icon className='size-5 text-primary' />
                </div>
                <div>
                  <CardTitle className='text-base'>{exp.title}</CardTitle>
                  <p className='text-xs text-muted-foreground'>{exp.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => handleExport(exp.key)}
                disabled={exporting === exp.key}
              >
                <Download className='mr-2 size-4' />
                {exporting === exp.key ? 'Exporting...' : 'Export CSV'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
