'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LEAD_STATUSES, type Lead, type LeadStatus } from '@/lib/types'
import { STATUS_LABELS } from './status-badge'

export function LeadEditor({ lead }: { lead: Lead }) {
  const router = useRouter(); const [saving,setSaving]=useState(false); const [error,setError]=useState('')
  const [status,setStatus]=useState<LeadStatus>(lead.status); const [note,setNote]=useState(''); const [quoted,setQuoted]=useState(lead.quoted_amount?.toString()||''); const [finalAmount,setFinal]=useState(lead.final_amount?.toString()||'')
  async function save() { setSaving(true); setError(''); const response=await fetch(`/api/admin/leads/${lead.id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({status,note:note||undefined,quotedAmount:quoted===''?null:Number(quoted),finalAmount:finalAmount===''?null:Number(finalAmount)})}); setSaving(false); if(!response.ok){setError((await response.json()).error||'No fue posible guardar')}else{setNote('');router.refresh()} }
  return <div className="rounded-2xl border bg-white p-6"><h2 className="font-bold">Actualizar oportunidad</h2><div className="mt-4 space-y-4"><label className="block text-sm">Estado<select value={status} onChange={e=>setStatus(e.target.value as LeadStatus)} className="mt-1 w-full rounded-xl border p-3">{LEAD_STATUSES.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="text-sm">Monto cotizado<input value={quoted} onChange={e=>setQuoted(e.target.value)} type="number" min="0" className="mt-1 w-full rounded-xl border p-3" /></label><label className="text-sm">Monto final<input value={finalAmount} onChange={e=>setFinal(e.target.value)} type="number" min="0" className="mt-1 w-full rounded-xl border p-3" /></label></div><label className="block text-sm">Nueva nota<textarea value={note} onChange={e=>setNote(e.target.value)} rows={4} className="mt-1 w-full rounded-xl border p-3" placeholder="Seguimiento, acuerdos o próximo paso…" /></label>{error&&<p className="text-sm text-red-600">{error}</p>}<button onClick={save} disabled={saving} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{saving?'Guardando…':'Guardar cambios'}</button></div></div>
}

