'use client'

import Link from 'next/link'
import { Stethoscope, ArrowRight } from 'lucide-react'

import { useServiceTypes } from '@/lib/hooks/client/useServiceTypes'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingCards } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function ServicesPage() {
  const { data: services, isLoading } = useServiceTypes()

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Services'
        description='Browse our available care services'
      />

      {isLoading ? (
        <LoadingCards count={6} />
      ) : !services?.length ? (
        <EmptyState
          icon={Stethoscope}
          title='No services available'
          description='Our service catalog is being updated. Please check back soon.'
        />
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {services.map((service) => (
            <Card key={service.id} className='flex flex-col'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <CardTitle className='text-lg'>{service.name}</CardTitle>
                  <Badge variant='secondary'>{service.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className='flex flex-1 flex-col justify-between gap-4'>
                <div className='space-y-3'>
                  <p className='text-sm text-muted-foreground'>{service.description}</p>
                  {service.features.length > 0 && (
                    <ul className='space-y-1'>
                      {service.features.slice(0, 4).map((feature) => (
                        <li key={feature} className='text-xs text-muted-foreground flex items-center gap-2'>
                          <span className='size-1.5 rounded-full bg-primary shrink-0' />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className='text-sm font-semibold'>
                    &#8358;{service.priceRange.min.toLocaleString()} – &#8358;{service.priceRange.max.toLocaleString()}
                    <span className='text-xs font-normal text-muted-foreground ml-1'>
                      {service.priceRange.unit}
                    </span>
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='w-full'
                  render={<Link href={`/client/care-requests/new?service=${service.id}`} />}
                >
                  Request This Service <ArrowRight className='ml-1 size-3' />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
