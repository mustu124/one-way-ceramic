'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  ['Do you take bulk / wholesale orders?', 'Yes. Bulk and wholesale orders are welcome. Share your quantity, category and timeline on WhatsApp for pricing.'],
  ['Can I get custom designs or colours?', 'Custom glaze colours, forms and sets can be discussed for suitable quantities and timelines.'],
  ['Do you ship across India?', 'Yes, products can be packed and shipped across India depending on size, fragility and order value.'],
  ['Are all products handmade?', 'Most pieces are handmade or hand-finished, so small variations in shape, glaze and texture are part of the charm.'],
  ['How do I place an order?', 'Tap any WhatsApp enquiry button, mention the product name and quantity, and the studio will confirm details directly.'],
  ['What is your return policy?', 'Ceramic items are checked before dispatch. For transit damage, contact the studio quickly with photos and order details.']
]

export function FAQSection() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="section-pad bg-beige">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">FAQ</p>
          <h2 className="font-heading text-4xl font-semibold md:text-5xl">Before You Order</h2>
        </div>
        <div className="grid gap-3">
          {faqs.map(([question, answer], index) => (
            <article key={question} className="rounded-lg bg-white">
              <button onClick={() => setOpen(open === index ? -1 : index)} className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left font-semibold" aria-expanded={open === index}>
                {question}
                <ChevronDown className={`shrink-0 transition ${open === index ? 'rotate-180' : ''}`} size={18} />
              </button>
              {open === index && <p className="px-5 pb-5 leading-7 text-text-light">{answer}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
