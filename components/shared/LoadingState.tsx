import { Skeleton } from '@/components/ui/skeleton'

interface LoadingCardsProps {
  count?: number
}

export function LoadingCards({ count = 4 }: LoadingCardsProps): React.ReactElement {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='rounded-xl border bg-card p-4 space-y-3'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='size-9 rounded-lg' />
          </div>
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-3 w-32' />
        </div>
      ))}
    </div>
  )
}

interface LoadingTableProps {
  rows?: number
}

export function LoadingTable({ rows = 5 }: LoadingTableProps): React.ReactElement {
  return (
    <div className='rounded-xl border bg-card overflow-hidden'>
      <div className='border-b px-4 py-3'>
        <div className='flex gap-4'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-4 flex-1' />
          ))}
        </div>
      </div>
      <div className='divide-y'>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className='flex gap-4 px-4 py-3'>
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className='h-4 flex-1' />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function LoadingPage(): React.ReactElement {
  return (
    <div className='space-y-6'>
      <LoadingCards />
      <LoadingTable />
    </div>
  )
}
