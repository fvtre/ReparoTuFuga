import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from './server'

export async function getAdminUser() {
  const supabase = await createClient()
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const role = user.app_metadata?.role
  return role === 'admin' || role === 'owner' ? user : null
}

export async function requireAdmin() {
  const user = await getAdminUser()
  if (!user) redirect('/admin/login')
  return user
}

