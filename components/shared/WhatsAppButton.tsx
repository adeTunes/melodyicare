import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WHATSAPP_URL } from '@/lib/constants'
import type { ComponentProps } from 'react'

type ButtonVariant = ComponentProps<typeof Button>['variant']
type ButtonSize = ComponentProps<typeof Button>['size']

interface WhatsAppButtonProps {
  message?: string
  label?: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function WhatsAppButton({
  message,
  label = 'Contact Us on WhatsApp',
  variant,
  size,
  className,
}: WhatsAppButtonProps): React.ReactElement {
  const href = message
    ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
    : WHATSAPP_URL

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      render={<a href={href} target='_blank' rel='noopener noreferrer' />}
    >
      <MessageCircle className='mr-2 size-4' />
      {label}
    </Button>
  )
}
