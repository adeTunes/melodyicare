'use client'

import { useState } from 'react'
import {
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Globe,
  Search,
  ExternalLink,
  Clock,
} from 'lucide-react'

import { useTrainingResources } from '@/lib/hooks/caregiver/useTraining'
import type { TrainingResourceType } from '@/lib/types'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const TYPE_ICONS: Record<TrainingResourceType, typeof Video> = {
  video: Video,
  document: FileText,
  quiz: HelpCircle,
  article: Globe,
  webinar: Video,
}

const TYPE_LABELS: Record<TrainingResourceType, string> = {
  video: 'Video',
  document: 'Document',
  quiz: 'Quiz',
  article: 'Article',
  webinar: 'Webinar',
}

const CATEGORY_TABS = ['all', 'clinical', 'safety', 'communication', 'compliance'] as const

export default function TrainingPage() {
  const { data: resources, isLoading } = useTrainingResources()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filtered = resources?.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      categoryFilter === 'all' || r.category.toLowerCase() === categoryFilter
    return matchSearch && matchCategory
  })

  const categories = resources
    ? [...new Set(resources.map((r) => r.category.toLowerCase()))]
    : []

  return (
    <div className='space-y-6'>
      <PageHeader title='Training' description='Access training materials and resources' />

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='Search training resources...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Category Filter */}
      <div className='flex gap-2 flex-wrap'>
        <button
          onClick={() => setCategoryFilter('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
            categoryFilter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              categoryFilter === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : !filtered?.length ? (
        <EmptyState
          icon={BookOpen}
          title='No resources found'
          description='Training resources will be added by your administrator.'
        />
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filtered.map((resource) => {
            const Icon = TYPE_ICONS[resource.type] ?? FileText
            const url = resource.externalURL || resource.fileURL

            return (
              <Card key={resource.id} className='hover:shadow-md transition-shadow'>
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10'>
                        <Icon className='size-4 text-primary' />
                      </div>
                      <Badge variant='outline' className='text-xs'>
                        {TYPE_LABELS[resource.type]}
                      </Badge>
                    </div>
                    {resource.isRequired && (
                      <Badge className='bg-red-100 text-red-800 text-xs'>Required</Badge>
                    )}
                  </div>
                  <CardTitle className='text-base mt-2'>{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>
                    {resource.description}
                  </p>
                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <div className='flex items-center gap-3'>
                      {resource.durationMins && (
                        <span className='flex items-center gap-1'>
                          <Clock className='size-3' />
                          {resource.durationMins} min
                        </span>
                      )}
                      <span className='capitalize'>{resource.category}</span>
                    </div>
                    {url && (
                      <a
                        href={url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1 text-primary hover:underline'
                      >
                        Open <ExternalLink className='size-3' />
                      </a>
                    )}
                  </div>
                  {resource.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-3'>
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className='rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
