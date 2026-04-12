import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: {
    template: '%s | MelodyiCare',
    default: 'Account | MelodyiCare',
  },
}

export default function AuthLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center p-1.5 overflow-hidden">
            <img src="/logo.png" alt="MelodyiCare Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-heading font-bold tracking-tight text-primary">
            Melody<span className="text-secondary">ICare</span>
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
