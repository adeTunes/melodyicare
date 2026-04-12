import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = { title: 'Reset Password' }

export default function ForgotPasswordLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <>{children}</>
}
