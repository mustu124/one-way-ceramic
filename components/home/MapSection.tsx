import { MessageCircle, Phone } from 'lucide-react'
import { BUSINESS } from '@/lib/constants'
import { waGeneralLink } from '@/lib/waLink'

export function MapSection() {
  return (
    <section id="visit" className="section-pad bg-beige">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-lg bg-white shadow-soft">
          <iframe src={BUSINESS.mapSrc} width="100%" height="360" style={{ border: 0 }} loading="lazy" title="One Way Ceramic Studio map" />
        </div>
        <aside className="rounded-lg bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Visit Us</p>
          <h2 className="mt-2 font-heading text-4xl font-semibold">Prahlad Nagar, Ahmedabad</h2>
          <p className="mt-4 leading-7 text-text-light">{BUSINESS.address}</p>
          <p className="mt-4 text-sm text-text-light">Open daily · WhatsApp before visiting for stock and bulk order availability.</p>
          <div className="mt-6 grid gap-3">
            <a href={waGeneralLink()} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-brown px-5 font-semibold text-white">
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
            <a href={`tel:${BUSINESS.phoneTel}`} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-brown/15 bg-ivory px-5 font-semibold text-brown">
              <Phone size={18} />
              Call Now
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}
