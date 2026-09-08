import { Eye, MousePointerClick, ReceiptText, Users, MessageCircle, Phone, CircleDollarSign, FileText } from 'lucide-react'
import { PeriodFilter } from '@/components/admin/period-filter'
import { createClient } from '@/lib/supabase/server'
import { getDateRange } from '@/lib/date-range'
import { getGoogleAdsReport } from '@/lib/google-ads'
import { getVercelAnalyticsReport } from '@/lib/vercel-analytics'
import type { Lead } from '@/lib/types'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { STATUS_LABELS } from '@/components/admin/status-badge'

const money = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
const metric = (row: Record<string, unknown>, key: string) => Number((row.metrics as Record<string, unknown> | undefined)?.[key] || 0)

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ period?: string; from?: string; to?: string }> }) {
  const query = await searchParams; const range = getDateRange(query.period, query.from, query.to)
  const db = await createClient()
  const { data } = db ? await db.from('leads').select('*').gte('created_at', range.from).lte('created_at', range.to) : { data: [] }
  const leads = (data ?? []) as Lead[]
  const [ads, analytics] = await Promise.all([getGoogleAdsReport(range.from, range.to), getVercelAnalyticsReport(range.from, range.to)])
  const clicks = ads.campaigns.reduce((s, r) => s + metric(r, 'clicks'), 0), spend = ads.campaigns.reduce((s, r) => s + metric(r, 'costMicros') / 1_000_000, 0)
  const attributed = leads.filter(l => l.gclid || l.source?.toLowerCase() === 'google'), won = attributed.filter(l => l.status === 'won'), revenue = won.reduce((s,l) => s + Number(l.final_amount || 0), 0)
  const eventCount = (name: string) => analytics.events.filter((event: any) => event.eventName === name || event.name === name).reduce((s: number, event: any) => s + Number(event.count || 0), 0)
  const days = new Map<string, {date:string;visitors:number;clicks:number;spend:number;quotes:number;revenue:number;roas:number|null;cpa:number|null}>()
  const day = (date:string) => { const key=date.slice(0,10); if(!days.has(key))days.set(key,{date:key.slice(5),visitors:0,clicks:0,spend:0,quotes:0,revenue:0,roas:null,cpa:null}); return days.get(key)! }
  for(const lead of leads){const d=day(lead.created_at);d.quotes++;if(lead.status==='won')d.revenue+=Number(lead.final_amount||0)}
  for(const row of ads.daily){const date=String((row.segments as Record<string,unknown>|undefined)?.date||'');if(date){const d=day(date);d.clicks+=metric(row,'clicks');d.spend+=metric(row,'costMicros')/1e6}}
  for(const row of analytics.daily as Record<string,unknown>[]){const date=String(row.day||row.date||row.timestamp||'');if(date)day(date).visitors+=Number(row.visitors||row.count||0)}
  for(const d of days.values()){d.roas=d.spend>0&&d.revenue>0?d.revenue/d.spend:null;d.cpa=d.spend>0&&d.quotes>0?d.spend/d.quotes:null}
  const sources=[...new Set(leads.map(l=>l.source||'Directo'))].map(name=>({name,value:leads.filter(l=>(l.source||'Directo')===name).length}))
  const statuses=Object.entries(STATUS_LABELS).map(([key,name])=>({name,value:leads.filter(l=>l.status===key).length}))
  const cards = [
    ['VISITANTES', analytics.visitors, Users], ['PAGE VIEWS', analytics.pageViews, Eye], ['CLICS GOOGLE ADS', ads.configured ? clicks : null, MousePointerClick],
    ['GASTO GOOGLE ADS', ads.configured ? money.format(spend) : null, CircleDollarSign], ['COTIZACIONES', leads.length, FileText],
    ['COSTO POR COTIZACIÓN', spend > 0 && attributed.length ? money.format(spend / attributed.length) : null, ReceiptText], ['WHATSAPP', analytics.configured ? eventCount('whatsapp_click') : null, MessageCircle], ['LLAMADAS', analytics.configured ? eventCount('phone_click') : null, Phone],
  ] as const
  return <div className="space-y-8"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-semibold text-blue-600">VISIÓN DEL NEGOCIO</p><h1 className="mt-1 text-3xl font-bold">Resumen comercial</h1><p className="mt-2 text-slate-500">Publicidad, contactos y ventas en un solo lugar.</p></div><PeriodFilter /></div>
    {(ads.error || analytics.error) && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{[ads.error, analytics.error].filter(Boolean).join(' · ')}</div>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value,Icon]) => <div key={label} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold tracking-wide text-slate-500">{label}</span><Icon className="h-5 w-5 text-blue-600" /></div><div className="mt-4 text-2xl font-bold">{value ?? 'No disponible'}</div></div>)}</section>
    <section className="grid gap-6 xl:grid-cols-2"><div className="rounded-2xl border bg-white p-6"><h2 className="text-lg font-bold">Embudo</h2><div className="mt-5 space-y-3">{[['Clics Google Ads', clicks],['Visitantes', analytics.visitors],['Leads', leads.length],['Cotizados', leads.filter(l=>l.status==='quoted'||l.status==='won').length],['Ganados', leads.filter(l=>l.status==='won').length]].map(([label,value]) => <div key={String(label)} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span>{label}</span><strong>{value ?? '—'}</strong></div>)}</div></div>
      <div className="rounded-2xl border bg-white p-6"><h2 className="text-lg font-bold">Rendimiento comercial de Ads</h2><dl className="mt-5 grid grid-cols-2 gap-4"><Stat label="Leads atribuidos" value={attributed.length} /><Stat label="Clientes ganados" value={won.length} /><Stat label="Facturación atribuida" value={money.format(revenue)} /><Stat label="Costo por lead" value={spend > 0 && attributed.length ? money.format(spend/attributed.length) : 'No disponible'} /><Stat label="ROAS" value={spend > 0 && revenue > 0 ? `${(revenue/spend).toFixed(2)}x` : 'No disponible'} /><Stat label="ROI" value={spend > 0 && revenue > 0 ? `${(((revenue-spend)/spend)*100).toFixed(1)}%` : 'No disponible'} /></dl><p className="mt-5 text-xs text-slate-500">Una conversión de Google Ads no se considera venta hasta marcar el lead como ganado y registrar su monto final.</p></div></section>
    <DashboardCharts daily={[...days.values()].sort((a,b)=>a.date.localeCompare(b.date))} sources={sources} statuses={statuses}/>
  </div>
}
function Stat({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-xl border p-4"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 font-bold">{value}</dd></div> }
