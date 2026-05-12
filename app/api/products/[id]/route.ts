import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getRouteUser, validatePrice, validateStockQuantity } from '@/lib/auth-route'
import { supabaseServer } from '@/lib/supabase-server'
import { isUuid, normalizeProductPayload } from '@/lib/product-admin'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getRouteUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabaseServer) return NextResponse.json({ error: 'Supabase service role key is missing' }, { status: 503 })
  let body
  try {
    body = await normalizeProductPayload(await req.json(), supabaseServer)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid product data' }, { status: 400 })
  }
  const priceError = validatePrice(body.price_inr ?? 0, body.original_price_inr)
  if (priceError) return NextResponse.json({ error: priceError }, { status: 400 })
  const stockError = validateStockQuantity(body.stock_quantity)
  if (stockError) return NextResponse.json({ error: stockError }, { status: 400 })
  const { data, error } = await supabaseServer.from('products').update(body).eq('id', params.id).select('*, subcategories(*, categories(*))').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/dashboard/products')
  if (data?.subcategories?.categories?.slug) revalidatePath(`/shop/${data.subcategories.categories.slug}`)
  return NextResponse.json({ product: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getRouteUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabaseServer) return NextResponse.json({ error: 'Supabase service role key is missing' }, { status: 503 })
  if (!isUuid(params.id)) {
    return NextResponse.json({ error: 'This is a preview product. Run supabase/seed.sql so admin products use real database IDs.' }, { status: 400 })
  }
  const { data: product, error: fetchError } = await supabaseServer.from('products').select('image_url').eq('id', params.id).single()
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 })
  if (product?.image_url?.includes('/storage/v1/object/public/product-images/')) {
    const path = product.image_url.split('/storage/v1/object/public/product-images/')[1]
    if (path) await supabaseServer.storage.from('product-images').remove([path])
  }
  const { error } = await supabaseServer.from('products').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/dashboard/products')
  return NextResponse.json({ ok: true })
}
