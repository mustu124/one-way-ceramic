import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { CategoryTree } from '@/types'

const categoryImages: Record<string, string> = {
  drinkware: '/web-images/drinkware.jpeg',
  serveware: '/web-images/serveware.jpeg',
  dinnerware: '/web-images/dinnerware.jpeg',
  kitchenware: '/web-images/kitchenware.jpeg',
  homedecor: '/web-images/homedecor.jpeg',
  flower: '/web-images/flower.jpeg',
  pot: '/web-images/pots.jpeg',
  bathware: '/web-images/bathware.jpeg'
}

export function CategoryGrid({ categories }: { categories: CategoryTree[] }) {
  return (
    <section id="categories" className="section-pad bg-beige">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Collections</p>
          <h2 className="font-heading text-4xl font-semibold md:text-5xl">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          <Link href="/shop" className="relative col-span-2 min-h-[180px] overflow-hidden rounded-lg bg-brown p-5 text-white md:col-span-1 md:min-h-[250px]">
            <Image src="/web-images/shopall.jpeg" alt="Shop all ceramic collections" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <p className="relative font-heading text-3xl font-semibold">Shop All</p>
            <p className="relative mt-2 max-w-[14rem] text-sm text-white/75">Explore every handmade product currently available.</p>
            <ArrowUpRight className="absolute bottom-5 right-5" />
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/shop/${category.slug}`} className="group relative min-h-[180px] overflow-hidden rounded-lg bg-brown md:min-h-[250px]">
              <Image src={categoryImages[category.slug] || category.image_url || '/web-images/shopall.jpeg'} alt={category.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 768px) 33vw, 50vw" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-2xl font-semibold">{category.name}</h3>
                    <p className="text-xs text-white/75">{category.subcategories.length} subcategories</p>
                  </div>
                  <ArrowUpRight size={21} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
