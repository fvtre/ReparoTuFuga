import 'server-only'
import { unstable_cache } from 'next/cache'

export type AnalyticsReport = { configured: boolean; visitors: number | null; pageViews: number | null; daily: unknown[]; pages: unknown[]; referrers: unknown[]; countries: unknown[]; devices: unknown[]; events: unknown[]; error?: string }

const cachedReport = unstable_cache(async (from: string, to: string): Promise<AnalyticsReport> => {
  const token = process.env.VERCEL_TOKEN, projectId = process.env.VERCEL_PROJECT_ID, teamId = process.env.VERCEL_TEAM_ID
  const empty = { configured: false, visitors: null, pageViews: null, daily: [], pages: [], referrers: [], countries: [], devices: [], events: [] }
  if (!token || !projectId) return empty
  const base = 'https://api.vercel.com/v1/query/web-analytics'
  const params = new URLSearchParams({ projectId, since: from.slice(0, 10), until: to.slice(0, 10) })
  if (teamId) params.set('teamId', teamId)
  const call = async (resource: string, extra?: Record<string, string>) => {
    const q = new URLSearchParams(params); Object.entries(extra ?? {}).forEach(([k, v]) => q.set(k, v))
    const response = await fetch(`${base}/${resource}?${q}`, { headers: { authorization: `Bearer ${token}` } })
    if (!response.ok) throw new Error(`${resource}: ${response.status}`)
    return response.json() as Promise<any>
  }
  try {
    const [counts, daily, pages, referrers, countries, devices, events] = await Promise.all([
      call('visits/count'), call('visits/aggregate', { by: 'day' }), call('visits/aggregate', { by: 'requestPath' }),
      call('visits/aggregate', { by: 'referrerHostname' }), call('visits/aggregate', { by: 'country' }),
      call('visits/aggregate', { by: 'deviceType' }), call('events/aggregate', { by: 'eventName' }),
    ])
    const rows = (v: any) => Array.isArray(v) ? v : Array.isArray(v?.data) ? v.data : []
    return { configured: true, pageViews: typeof counts?.data?.pageviews === 'number' ? counts.data.pageviews : null, visitors: typeof counts?.data?.visitors === 'number' ? counts.data.visitors : null, daily: rows(daily), pages: rows(pages), referrers: rows(referrers), countries: rows(countries), devices: rows(devices), events: rows(events) }
  } catch (error) {
    console.error('[Vercel Analytics] No fue posible obtener el reporte:', error instanceof Error ? error.message : 'error desconocido')
    return { ...empty, configured: true, error: 'Vercel Analytics no respondió. Revisa el token, IDs y plan.' }
  }
}, ['vercel-analytics-report'], { revalidate: 600 })

export const getVercelAnalyticsReport = cachedReport
