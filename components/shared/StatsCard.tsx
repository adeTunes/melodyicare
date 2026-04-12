import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Trend {
  value: number
  isPositive: boolean
}

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: Trend
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps): React.ReactElement {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-medium text-muted-foreground'>{title}</p>
          <div className='flex size-9 items-center justify-center rounded-lg bg-muted'>
            <Icon className='size-4 text-muted-foreground' />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-3xl font-bold'>{value}</p>
        {(description || trend) && (
          <div className='mt-1 flex items-center gap-2'>
            {trend && (
              <span
                className={cn(
                  'flex items-center gap-0.5 text-xs font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className='size-3' />
                ) : (
                  <TrendingDown className='size-3' />
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <p className='text-xs text-muted-foreground'>{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
