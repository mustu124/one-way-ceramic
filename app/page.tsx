import { AboutSection } from '@/components/home/AboutSection'
import { AnnouncementBar } from '@/components/home/AnnouncementBar'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FAQSection } from '@/components/home/FAQSection'
import { GalleryGrid } from '@/components/home/GalleryGrid'
import { HeroSection } from '@/components/home/HeroSection'
import { MapSection } from '@/components/home/MapSection'
import { OfferStrip } from '@/components/home/OfferStrip'
import { ProcessSection } from '@/components/home/ProcessSection'
import { ProductsSection } from '@/components/home/ProductsSection'
import { QuoteBanner } from '@/components/home/QuoteBanner'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { getCategories, getProducts, getReviews, getSiteSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [categories, products, reviews, settings] = await Promise.all([
    getCategories(),
    getProducts({ limit: 80 }),
    getReviews(),
    getSiteSettings()
  ])

  return (
    <>
      <AnnouncementBar text={settings.announcement_text} />
      <HeroSection />
      <OfferStrip text={settings.offer_text} />
      <CategoryGrid categories={categories} />
      <ProductsSection categories={categories} products={products} />
      <QuoteBanner />
      <ProcessSection />
      <ReviewsSection reviews={reviews} />
      <AboutSection />
      <MapSection />
      <GalleryGrid products={products} />
      <FAQSection />
    </>
  )
}
