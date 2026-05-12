import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getProducts } from '@/lib/data'
import { getRouteUser, validatePrice, validateStockQuantity } from '@/lib/auth-route'
import { supabaseServer } from '@/lib/supabase-server'
import { normalizeProductPayload } from '@/lib/product-admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const products = await getProducts({
    category: searchParams.get('category') || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    limit: Number(searchParams.get('limit') || 20),
    offset: Number(searchParams.get('offset') || 0),
    admin: searchParams.get('admin') === '1'
  })
  return NextResponse.json(
    { products, total: products.length },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  )
}

export async function POST(req: NextRequest) {
  const user = await getRouteUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabaseServer) return NextResponse.json({ error: 'Supabase service role key is missing' }, { status: 503 })
  let body
  try {
    body = await normalizeProductPayload(await req.json(), supabaseServer)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid product data' }, { status: 400 })
  }
  const priceError = validatePrice(body.price_inr, body.original_price_inr)
  if (priceError) return NextResponse.json({ error: priceError }, { status: 400 })
  const stockError = validateStockQuantity(body.stock_quantity)
  if (stockError) return NextResponse.json({ error: stockError }, { status: 400 })
  const { data, error } = await supabaseServer.from('products').insert(body).select('*, subcategories(*, categories(*))').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/dashboard/products')
  if (data?.subcategories?.categories?.slug) revalidatePath(`/shop/${data.subcategories.categories.slug}`)
  return NextResponse.json({ product: data })
}
