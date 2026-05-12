import { NextRequest, NextResponse } from 'next/server'
import { getRouteUser } from '@/lib/auth-route'
import { supabaseServer } from '@/lib/supabase-server'

export async function PUT(req: NextRequest) {
  const user = await getRouteUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabaseServer) return NextResponse.json({ error: 'Supabase service role key is missing' }, { status: 503 })
  const body = await req.json()
  const rows = Object.entries(body).map(([key, value]) => ({ key, value: String(value ?? '') }))
  const { error } = await supabaseServer.from('site_settings').upsert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
