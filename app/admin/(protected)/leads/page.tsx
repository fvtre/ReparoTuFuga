import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Lead } from '@/lib/types'
import { StatusBadge } from '@/components/admin/status-badge'

export default async function LeadsPage() {
  const db = await createClient(); const { data, error } = db ? await db.from('leads').select('*').order('created_at', { ascending: false }) : { data: [], error: null }
  const leads = (data ?? []) as Lead[]
  return <div><div className="flex items-end justify-between"><div><p className="text-sm font-semibold text-blue-600">GESTIÓN COMERCIAL</p><h1 className="mt-1 text-3xl font-bold">Leads y cotizaciones</h1></div><Link href="/admin/leads/kanban" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Ver Kanban</Link></div>
    {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">No se pudieron cargar los leads.</p>}
    <div className="mt-6 overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Solicitud','Fecha','Cliente','Teléfono','Servicio','Urgencia','Fuente','Campaña','Estado','Monto',''].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{leads.map(lead=><tr key={lead.id} className="border-b last:border-0"><td className="px-4 py-4 font-semibold">{lead.order_number}</td><td className="px-4 py-4 whitespace-nowrap">{new Intl.DateTimeFormat('es-CL').format(new Date(lead.created_at))}</td><td className="px-4 py-4">{lead.name}</td><td className="px-4 py-4"><a href={`tel:${lead.phone}`} className="text-blue-600">{lead.phone}</a></td><td className="px-4 py-4">{lead.service_type}</td><td className="px-4 py-4">{lead.urgency}</td><td className="px-4 py-4">{lead.source || 'Directo'}</td><td className="px-4 py-4">{lead.campaign || '—'}</td><td className="px-4 py-4"><StatusBadge status={lead.status} /></td><td className="px-4 py-4">{lead.final_amount ?? lead.quoted_amount ? `$${Number(lead.final_amount ?? lead.quoted_amount).toLocaleString('es-CL')}` : '—'}</td><td className="px-4 py-4"><Link href={`/admin/leads/${lead.id}`} className="font-semibold text-blue-600">Abrir</Link></td></tr>)}</tbody></table>{!leads.length && <div className="p-12 text-center text-slate-500">Aún no hay solicitudes registradas.</div>}</div>
  </div>
}

