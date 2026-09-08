'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Lead, LeadStatus } from '@/lib/types'
import { LEAD_STATUSES } from '@/lib/types'
import { STATUS_LABELS } from './status-badge'

export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads,setLeads]=useState(initialLeads); const [error,setError]=useState('')
  async function move(id:string,status:LeadStatus){const previous=leads;setLeads(items=>items.map(l=>l.id===id?{...l,status}:l));const lead=leads.find(l=>l.id===id);if(!lead)return;const response=await fetch(`/api/admin/leads/${id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({status,note:undefined,quotedAmount:lead.quoted_amount,finalAmount:lead.final_amount})});if(!response.ok){setLeads(previous);setError('No se pudo mover el lead. Intenta nuevamente.')}else setError('')}
  return <>{error&&<p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="grid min-w-[1200px] grid-cols-6 gap-4">{LEAD_STATUSES.map(status=><section key={status} onDragOver={e=>e.preventDefault()} onDrop={e=>move(e.dataTransfer.getData('leadId'),status)} className="min-h-[65vh] rounded-2xl bg-slate-100 p-3"><h2 className="mb-3 flex justify-between font-semibold"><span>{STATUS_LABELS[status]}</span><span className="rounded-full bg-white px-2 text-sm">{leads.filter(l=>l.status===status).length}</span></h2><div className="space-y-3">{leads.filter(l=>l.status===status).map(lead=><Link draggable onDragStart={e=>e.dataTransfer.setData('leadId',lead.id)} href={`/admin/leads/${lead.id}`} key={lead.id} className="block cursor-grab rounded-xl border bg-white p-4 shadow-sm active:cursor-grabbing"><p className="text-xs text-slate-500">{lead.order_number}</p><p className="mt-1 font-semibold">{lead.name}</p><p className="mt-2 text-xs text-slate-500">{lead.service_type}</p>{(lead.final_amount||lead.quoted_amount)&&<p className="mt-2 text-sm font-bold text-blue-600">${Number(lead.final_amount||lead.quoted_amount).toLocaleString('es-CL')}</p>}</Link>)}</div></section>)}</div></>
}

