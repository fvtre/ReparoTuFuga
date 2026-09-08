import 'server-only'
import { unstable_cache } from 'next/cache'

export type AdsRow = Record<string, unknown>
export type AdsReport = { configured: boolean; campaigns: AdsRow[]; daily: AdsRow[]; searchTerms: AdsRow[]; keywords: AdsRow[]; error?: string }

function config() {
  const required = ['GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_CLIENT_ID', 'GOOGLE_ADS_CLIENT_SECRET', 'GOOGLE_ADS_REFRESH_TOKEN', 'GOOGLE_ADS_CUSTOMER_ID'] as const
  if (required.some((key) => !process.env[key])) return null
  return {
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!, clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!, refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID!.replace(/-/g, ''), loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, ''),
    version: process.env.GOOGLE_ADS_API_VERSION || 'v22',
  }
}

async function accessToken(c: NonNullable<ReturnType<typeof config>>) {
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: c.clientId, client_secret: c.clientSecret, refresh_token: c.refreshToken, grant_type: 'refresh_token' }), cache: 'no-store' })
  if (!response.ok) throw new Error(`OAuth de Google Ads respondió ${response.status}`)
  return (await response.json() as { access_token: string }).access_token
}

async function query(c: NonNullable<ReturnType<typeof config>>, token: string, gaql: string) {
  const response = await fetch(`https://googleads.googleapis.com/${c.version}/customers/${c.customerId}/googleAds:search`, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'developer-token': c.developerToken, ...(c.loginCustomerId ? { 'login-customer-id': c.loginCustomerId } : {}), 'content-type': 'application/json' }, body: JSON.stringify({ query: gaql }) })
  if (!response.ok) throw new Error(`Google Ads API respondió ${response.status}`)
  return (await response.json() as { results?: AdsRow[] }).results ?? []
}

const cachedReport = unstable_cache(async (from: string, to: string): Promise<AdsReport> => {
  const c = config()
  if (!c) return { configured: false, campaigns: [], daily: [], searchTerms: [], keywords: [] }
  try {
    const token = await accessToken(c)
    const dates = `segments.date BETWEEN '${from.slice(0, 10)}' AND '${to.slice(0, 10)}'`
    const campaigns = await query(c, token, `SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, campaign_budget.amount_micros, metrics.impressions, metrics.clicks, metrics.ctr, metrics.average_cpc, metrics.cost_micros, metrics.conversions, metrics.conversions_value, metrics.cost_per_conversion FROM campaign WHERE ${dates}`)
    const daily = await query(c, token, `SELECT segments.date, segments.device, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value FROM customer WHERE ${dates} ORDER BY segments.date`)
    const searchTerms = await query(c, token, `SELECT search_term_view.search_term, metrics.impressions, metrics.clicks, metrics.ctr, metrics.cost_micros, metrics.conversions, metrics.cost_per_conversion FROM search_term_view WHERE ${dates}`)
    const keywords = await query(c, token, `SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM keyword_view WHERE ${dates}`)
    return { configured: true, campaigns, daily, searchTerms, keywords }
  } catch (error) {
    console.error('[Google Ads] No fue posible obtener el reporte:', error instanceof Error ? error.message : 'error desconocido')
    return { configured: true, campaigns: [], daily: [], searchTerms: [], keywords: [], error: 'Google Ads no respondió. Revisa las credenciales y permisos.' }
  }
}, ['google-ads-report'], { revalidate: 600 })

export const getGoogleAdsReport = cachedReport

