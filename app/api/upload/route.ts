import { NextRequest, NextResponse } from 'next/server'
import { getRouteUser } from '@/lib/auth-route'
import { supabaseServer } from '@/lib/supabase-server'

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(req: NextRequest) {
  const user = await getRouteUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabaseServer) return NextResponse.json({ error: 'Supabase service role key is missing' }, { status: 503 })

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  if (!ACCEPTED.includes(file.type)) return NextResponse.json({ error: 'Only JPG, PNG and WebP images are allowed' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Image must be 5MB or smaller' }, { status: 400 })

  const extension = file.name.split('.').pop() || 'jpg'
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const { error } = await supabaseServer.storage.from('product-images').upload(path, file, { contentType: file.type, upsert: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const { data } = supabaseServer.storage.from('product-images').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
