'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) redirect('/admin/login?error=config')
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user || !['admin', 'owner'].includes(String(data.user.app_metadata?.role))) {
    if (data.user) await supabase.auth.signOut()
    redirect('/admin/login?error=credentials')
  }
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase?.auth.signOut()
  redirect('/admin/login')
}

