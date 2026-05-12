import type { SupabaseClient } from '@supabase/supabase-js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuid(value: string) {
  return UUID_PATTERN.test(value)
}

export async function normalizeProductPayload(body: Record<string, unknown>, supabase: SupabaseClient): Promise<Record<string, unknown>> {
  const rawSubcategoryId = String(body.subcategory_id || '').trim()
  if (!rawSubcategoryId) return body
  if (isUuid(rawSubcategoryId)) return body

  const slug = rawSubcategoryId.replace(/^sub-/, '')
  const { data, error } = await supabase
    .from('subcategories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data?.id) {
    throw new Error(`Subcategory "${slug}" is not configured in Supabase. Run the seed SQL, then try again.`)
  }

  return { ...body, subcategory_id: data.id }
}
