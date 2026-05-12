import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-beige px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <div>{children}</div>
      </div>
    </section>
  )
}
