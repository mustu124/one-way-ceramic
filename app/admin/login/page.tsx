import { LoginForm } from '@/components/admin/LoginForm'

export const metadata = { title: 'Admin Login | One Way Ceramic Studio' }

export default function AdminLoginPage() {
  return (
    <section className="grid min-h-[calc(100vh-64px)] place-items-center bg-beige px-4 py-12">
      <LoginForm />
    </section>
  )
}
