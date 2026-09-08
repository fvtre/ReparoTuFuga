'use client'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
export function BusinessAnalytics(){return <><Analytics beforeSend={event=>new URL(event.url).pathname.startsWith('/admin')?null:event}/><SpeedInsights /></>}

