'use client'

import { useState } from 'react'
import { HelpCircle, Search } from 'lucide-react'

import { useFAQEntries } from '@/lib/hooks/client/useFAQEntries'
import { PageHeader } from '@/components/layout/PageHeader'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function HelpPage() {
  const { data: entries, isLoading } = useFAQEntries()
  const [search, setSearch] = useState('')

  const filtered = entries?.filter(
    (e) =>
      e.question.toLowerCase().includes(search.toLowerCase()) ||
      e.answer.toLowerCase().includes(search.toLowerCase())
  )

  const categories = [...new Set(filtered?.map((e) => e.category) ?? [])]

  return (
    <div className='space-y-6'>
      <PageHeader title='Help Center' description='Find answers to common questions' />

      {/* Search */}
      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='Search FAQs...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-10'
        />
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : !filtered?.length ? (
        <EmptyState
          icon={HelpCircle}
          title={search ? 'No matching FAQs' : 'No FAQs available'}
          description={
            search
              ? 'Try a different search term or contact us on WhatsApp.'
              : 'FAQs are being prepared. Contact us on WhatsApp for help.'
          }
          action={<WhatsAppButton message='Hi, I need help with MelodyiCare' />}
        />
      ) : (
        <div className='space-y-6'>
          {categories.map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className='text-lg'>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion>
                  {filtered
                    .filter((e) => e.category === category)
                    .map((entry) => (
                      <AccordionItem key={entry.id} value={entry.id}>
                        <AccordionTrigger className='text-sm text-left'>
                          {entry.question}
                        </AccordionTrigger>
                        <AccordionContent className='text-sm text-muted-foreground'>
                          {entry.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* WhatsApp CTA */}
      <Card>
        <CardContent className='flex flex-col items-center gap-4 py-8'>
          <HelpCircle className='size-10 text-muted-foreground' />
          <div className='text-center'>
            <p className='font-medium'>Still need help?</p>
            <p className='text-sm text-muted-foreground'>
              Our team is available on WhatsApp to assist you.
            </p>
          </div>
          <WhatsAppButton message='Hi, I need help with MelodyiCare' />
        </CardContent>
      </Card>
    </div>
  )
}
