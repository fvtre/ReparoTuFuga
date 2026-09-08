import { AdminNav } from '@/components/admin/admin-nav'
import { requireAdmin } from '@/lib/supabase/auth'
import { logout } from '../actions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin()
  return <div className="min-h-screen bg-slate-50 text-slate-950"><AdminNav /><div className="lg:pl-72"><header className="flex h-16 items-center justify-end border-b bg-white px-6"><span className="mr-4 hidden text-sm text-slate-500 sm:block">{user.email}</span><form action={logout}><button className="text-sm font-medium text-slate-600 hover:text-blue-600">Cerrar sesión</button></form></header><main className="p-4 md:p-8">{children}</main></div></div>
}

