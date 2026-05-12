'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { Star } from 'lucide-react'
import type { Review } from '@/types'

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', loop: true })

  return (
    <section className="section-pad bg-beige">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Customers</p>
            <h2 className="font-heading text-4xl font-semibold md:text-5xl">Loved Across India</h2>
          </div>
          <a href="https://www.google.com/search?q=One+Way+Ceramic+studio+Prahlad+Nagar+Ahmedabad" className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-brown">
            4.7 ★ Google Rating · Leave a Review
          </a>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {reviews.map((review) => (
              <article key={review.id} className="min-w-[82%] rounded-lg bg-white p-5 shadow-[0_10px_30px_rgba(58,46,34,0.06)] md:min-w-[32%]">
                <div className="flex gap-1 text-gold-dark">
                  {Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
                </div>
                <p className="mt-4 min-h-[6rem] leading-7 text-text-light">“{review.review_text}”</p>
                <p className="mt-4 font-semibold">{review.name}</p>
                {review.location && <p className="text-sm text-text-light">{review.location}</p>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
