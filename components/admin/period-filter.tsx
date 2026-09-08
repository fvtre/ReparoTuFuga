'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export function PeriodFilter() {
  const router = useRouter(), params = useSearchParams(), current = params.get('period') || '30d'
  const set = (period: string) => { const next = new URLSearchParams(params); next.set('period', period); router.push(`?${next}`) }
  return <div className="flex flex-wrap items-center gap-2">{[['today','Hoy'],['7d','7 días'],['30d','30 días'],['90d','90 días']].map(([value,label]) => <button key={value} onClick={() => set(value)} className={`rounded-lg px-3 py-2 text-sm font-medium ${current === value ? 'bg-blue-600 text-white' : 'border bg-white text-slate-600'}`}>{label}</button>)}<form onSubmit={e=>{e.preventDefault();const form=new FormData(e.currentTarget);const next=new URLSearchParams({period:'custom',from:String(form.get('from')),to:String(form.get('to'))});router.push(`?${next}`)}} className="flex items-center gap-1"><input aria-label="Fecha inicial" name="from" type="date" required className="w-32 rounded-lg border bg-white px-2 py-2 text-xs"/><input aria-label="Fecha final" name="to" type="date" required className="w-32 rounded-lg border bg-white px-2 py-2 text-xs"/><button className="rounded-lg border bg-white px-3 py-2 text-sm">Aplicar</button></form></div>
}

