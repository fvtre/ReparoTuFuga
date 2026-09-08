import type { DateRange } from './types'

export function getDateRange(preset = '30d', from?: string | null, to?: string | null): DateRange {
  const end = to ? new Date(`${to}T23:59:59.999Z`) : new Date()
  let start: Date
  if (preset === 'custom' && from) start = new Date(`${from}T00:00:00.000Z`)
  else {
    const days = preset === 'today' ? 1 : preset === '7d' ? 7 : preset === '90d' ? 90 : 30
    start = new Date(end)
    start.setUTCDate(start.getUTCDate() - days + 1)
    start.setUTCHours(0, 0, 0, 0)
  }
  if (start > end) throw new Error('El inicio del período debe ser anterior al fin.')
  const duration = end.getTime() - start.getTime() + 1
  return {
    from: start.toISOString(), to: end.toISOString(),
    previousFrom: new Date(start.getTime() - duration).toISOString(),
    previousTo: new Date(start.getTime() - 1).toISOString(),
  }
}

