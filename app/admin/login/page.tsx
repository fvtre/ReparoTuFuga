import { Droplets, LockKeyhole } from 'lucide-react'
import Link from 'next/link'
import { login } from '../actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
      <div className="mb-8 flex items-center gap-3"><span className="rounded-2xl bg-blue-600 p-3 text-white"><Droplets /></span><div><p className="text-xl font-bold">Reparo<span className="text-blue-600">TuFuga</span></p><p className="text-sm text-slate-500">Panel Administrativo</p></div></div>
      <h1 className="text-2xl font-bold text-slate-900">Acceso privado</h1>
      <p className="mt-2 text-sm text-slate-500">Ingresa con tu cuenta de propietario o administrador.</p>
      {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error === 'config' ? 'Supabase aún no está configurado.' : 'Correo, contraseña o rol no válidos.'}</div>}
      <form action={login} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">Correo<input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" /></label>
        <label className="block text-sm font-medium">Contraseña<input name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" /></label>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"><LockKeyhole className="h-4 w-4" />Ingresar</button>
      </form>
      <Link href="/" className="mt-6 block text-center text-sm text-slate-500 hover:text-blue-600">Volver al sitio web</Link>
    </div>
  </main>
}
