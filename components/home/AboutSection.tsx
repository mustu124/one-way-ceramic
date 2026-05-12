import { Boxes, Hand, PackageCheck, Truck } from 'lucide-react'

const highlights = [
  { title: 'Handmade', icon: Hand },
  { title: 'Unique Designs', icon: Boxes },
  { title: 'Bulk Orders', icon: PackageCheck },
  { title: 'Pan India Delivery', icon: Truck }
]

export function AboutSection() {
  return (
    <section className="section-pad bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-9 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">About Us</p>
          <h2 className="mt-2 font-heading text-4xl font-semibold leading-tight md:text-5xl">Crafted with Intention. Built to Last.</h2>
          <p className="mt-5 leading-8 text-text-light">One Way Ceramic Studio creates tactile ceramic pieces for daily rituals, warm homes, thoughtful gifting and hospitality spaces. Each batch carries the maker’s hand, so no two pieces feel exactly the same.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {highlights.map(({ title, icon: Icon }) => (
            <div key={title} className="rounded-lg bg-beige p-5">
              <Icon className="text-gold-dark" size={28} />
              <p className="mt-4 font-heading text-2xl font-semibold">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
