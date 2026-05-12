'use client'

import Link from 'next/link'
import { LayoutDashboard, LogOut, Package, Tags } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/products', label: 'Products', icon: Package },
  { href: '/admin/dashboard/categories', label: 'Categories', icon: Tags }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await supabase?.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="rounded-lg bg-brown p-3 text-white md:min-h-[calc(100vh-7rem)]">
      <p className="px-3 py-3 font-heading text-2xl font-semibold">Admin</p>
      <nav className="grid gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium ${pathname === href ? 'bg-white text-brown' : 'text-white/72 hover:bg-white/10 hover:text-white'}`}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="mt-6 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-white/72 hover:bg-white/10 hover:text-white">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )
}
