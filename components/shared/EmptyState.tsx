import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps): React.ReactElement {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <div className='mb-4 flex size-16 items-center justify-center rounded-full bg-muted'>
        <Icon className='size-8 text-muted-foreground' />
      </div>
      <h3 className='mb-1 text-base font-semibold'>{title}</h3>
      <p className='mb-6 max-w-sm text-sm text-muted-foreground'>{description}</p>
      {action}
    </div>
  )
}
