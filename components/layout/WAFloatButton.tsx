import { MessageCircle } from 'lucide-react'
import { waGeneralLink } from '@/lib/waLink'

export function WAFloatButton() {
  return (
    <a
      href={waGeneralLink()}
      className="fixed bottom-24 right-4 z-[9999] grid h-14 w-14 place-items-center rounded-full bg-brown text-white shadow-lg animate-pulsewa md:bottom-6 md:right-6"
      aria-label="Enquire on WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  )
}
