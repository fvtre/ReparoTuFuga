'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Contact, KanbanSquare, Megaphone, Search, Droplets, Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '/admin', label: 'Resumen', icon: BarChart3 },
  { href: '/admin/leads', label: 'Leads', icon: Contact },
  { href: '/admin/leads/kanban', label: 'Embudo Kanban', icon: KanbanSquare },
  { href: '/admin/marketing/campaigns', label: 'Campañas', icon: Megaphone },
  { href: '/admin/marketing/search-terms', label: 'Términos de búsqueda', icon: Search },
]

export function AdminNav() {
  const path = usePathname(); const [open, setOpen] = useState(false)
  return <><button onClick={() => setOpen(!open)} className="fixed right-4 top-4 z-50 rounded-xl bg-slate-900 p-2 text-white lg:hidden">{open ? <X /> : <Menu />}</button>
    <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 p-5 text-white transition-transform lg:translate-x-0`}>
      <Link href="/admin" className="mb-10 flex items-center gap-3"><span className="rounded-xl bg-blue-600 p-2"><Droplets /></span><div className="font-bold">Reparo Tu Fuga<div className="text-xs font-normal text-slate-400">Panel Administrativo</div></div></Link>
      <nav className="space-y-2">{links.map(({ href, label, icon: Icon }) => <Link onClick={() => setOpen(false)} key={href} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${path === href ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}><Icon className="h-5 w-5" />{label}</Link>)}</nav>
    </aside></>
}

