import { Skeleton } from '@/components/ui/skeleton'

export function StatCardsSkeleton({ count = 4 }: { count?: number }): React.JSX.Element {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='rounded-lg border bg-card p-6'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='size-5 rounded' />
          </div>
          <Skeleton className='mt-3 h-8 w-16' />
          <Skeleton className='mt-2 h-3 w-32' />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }): React.JSX.Element {
  return (
    <div className='rounded-lg border bg-card'>
      <div className='border-b p-4'>
        <Skeleton className='h-5 w-32' />
      </div>
      <div className='divide-y'>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className='flex items-center gap-4 p-4'>
            <Skeleton className='size-10 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-40' />
              <Skeleton className='h-3 w-24' />
            </div>
            <Skeleton className='h-6 w-16 rounded-full' />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PageHeaderSkeleton(): React.JSX.Element {
  return (
    <div className='space-y-1'>
      <Skeleton className='h-8 w-48' />
      <Skeleton className='h-4 w-72' />
    </div>
  )
}

export function DashboardSkeleton(): React.JSX.Element {
  return (
    <div className='space-y-6'>
      <PageHeaderSkeleton />
      <StatCardsSkeleton />
      <div className='grid gap-6 lg:grid-cols-2'>
        <TableSkeleton rows={4} />
        <TableSkeleton rows={4} />
      </div>
    </div>
  )
}

export function ListPageSkeleton(): React.JSX.Element {
  return (
    <div className='space-y-6'>
      <PageHeaderSkeleton />
      <div className='flex gap-3'>
        <Skeleton className='h-10 flex-1 max-w-sm' />
        <Skeleton className='h-10 w-32' />
      </div>
      <TableSkeleton rows={6} />
    </div>
  )
}

export function DetailPageSkeleton(): React.JSX.Element {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-8 w-8' />
        <Skeleton className='h-8 w-48' />
      </div>
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-4'>
          <div className='rounded-lg border bg-card p-6 space-y-4'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
          <div className='rounded-lg border bg-card p-6 space-y-4'>
            <Skeleton className='h-5 w-40' />
            <div className='space-y-3'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <Skeleton className='size-5 rounded' />
                  <Skeleton className='h-4 flex-1' />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='space-y-4'>
          <div className='rounded-lg border bg-card p-6 space-y-3'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormPageSkeleton(): React.JSX.Element {
  return (
    <div className='space-y-6 max-w-2xl'>
      <PageHeaderSkeleton />
      <div className='rounded-lg border bg-card p-6 space-y-6'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-10 w-full' />
          </div>
        ))}
        <Skeleton className='h-10 w-32' />
      </div>
    </div>
  )
}
