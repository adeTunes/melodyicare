import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = { title: 'Scheduling' }

export default function Layout({ children }: { children: ReactNode }): React.JSX.Element {
  return <>{children}</>
}
