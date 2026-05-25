import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/layout/BottomNav'
import CartDrawer from '@/components/cart/CartDrawer'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { WAFloatButton } from '@/components/layout/WAFloatButton'
import { CartProvider } from '@/context/CartContext'
import { getCategories } from '@/lib/data'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap'
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'One Way Ceramic Studio | Handmade Ceramics in Ahmedabad',
  description: 'Shop handcrafted mugs, dinnerware, serveware, home decor and bathware from One Way Ceramic Studio in Ahmedabad.',
  openGraph: {
    title: 'One Way Ceramic Studio',
    description: 'Handcrafted ceramic collections for your home, kitchen and table.',
    type: 'website'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories()

  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4097770305482538"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${cormorant.variable} ${jost.variable} font-body antialiased`}>
        <CartProvider>
          <Navbar categories={categories} />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <Footer categories={categories} />
          <CartDrawer />
          <WAFloatButton />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  )
}
