import type { SupabaseClient } from '@supabase/supabase-js'
import { CATEGORY_META, slugify } from './constants'

let catalogSync: Promise<void> | null = null

export async function ensureCatalogBasicsOnce(supabase: SupabaseClient) {
  if (!catalogSync) {
    catalogSync = ensureCatalogBasics(supabase).catch((error) => {
      catalogSync = null
      throw error
    })
  }
  return catalogSync
}

export async function ensureCatalogBasics(supabase: SupabaseClient) {
  for (let categoryIndex = 0; categoryIndex < CATEGORY_META.length; categoryIndex += 1) {
    const category = CATEGORY_META[categoryIndex]

    const { data: existingCategory, error: findCategoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category.slug)
      .limit(1)
      .maybeSingle()

    if (findCategoryError) throw new Error(findCategoryError.message)

    let categoryId = existingCategory?.id
    if (!categoryId) {
      const { data: categoryRow, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          slug: category.slug,
          sort_order: categoryIndex + 1
        })
        .select('id')
        .single()

      if (categoryError) throw new Error(categoryError.message)
      categoryId = categoryRow.id
    }

    for (let subIndex = 0; subIndex < category.subs.length; subIndex += 1) {
      const subcategoryName = category.subs[subIndex]
      const subcategorySlug = slugify(subcategoryName)
      const { data: existing, error: findError } = await supabase
        .from('subcategories')
        .select('id, category_id')
        .eq('slug', subcategorySlug)
        .limit(1)
        .maybeSingle()

      if (findError) throw new Error(findError.message)

      const payload = {
        category_id: categoryId,
        name: subcategoryName,
        slug: subcategorySlug,
        sort_order: subIndex + 1
      }

      if (existing?.id) {
        if (subcategorySlug === 'pots' && existing.category_id !== categoryId) {
          const { error } = await supabase.from('subcategories').update({ category_id: categoryId }).eq('id', existing.id)
          if (error) throw new Error(error.message)
        }
      } else {
        const { error } = await supabase.from('subcategories').insert(payload)
        if (error) throw new Error(error.message)
      }
    }
  }
}
