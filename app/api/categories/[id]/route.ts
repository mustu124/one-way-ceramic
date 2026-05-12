import { NextRequest, NextResponse } from 'next/server'
import { getRouteUser } from '@/lib/auth-route'
import { supabaseServer } from '@/lib/supabase-server'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getRouteUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabaseServer) return NextResponse.json({ error: 'Supabase service role key is missing' }, { status: 503 })
  const body = await req.json()
  const { subcategories, created_at, id, ...category } = body
  const { data, error } = await supabaseServer.from('categories').update(category).eq('id', params.id).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ category: data })
}
