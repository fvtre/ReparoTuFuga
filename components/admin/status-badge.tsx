import type { LeadStatus } from '@/lib/types'
export const STATUS_LABELS: Record<LeadStatus, string> = { new: 'Nuevo', contacted: 'Contactado', scheduled: 'Agendado', quoted: 'Cotizado', won: 'Ganado', lost: 'Perdido' }
export function StatusBadge({ status }: { status: LeadStatus }) { const colors: Record<LeadStatus,string> = { new:'bg-blue-50 text-blue-700', contacted:'bg-cyan-50 text-cyan-700', scheduled:'bg-violet-50 text-violet-700', quoted:'bg-amber-50 text-amber-700', won:'bg-emerald-50 text-emerald-700', lost:'bg-red-50 text-red-700' }; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status]}`}>{STATUS_LABELS[status]}</span> }

