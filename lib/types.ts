export const LEAD_STATUSES = ['new', 'contacted', 'scheduled', 'quoted', 'won', 'lost'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export type Lead = {
  id: string
  order_number: string
  name: string
  email: string
  phone: string
  address: string
  service_type: string
  urgency: string
  description: string
  status: LeadStatus
  source: string | null
  medium: string | null
  campaign: string | null
  term: string | null
  content: string | null
  gclid: string | null
  landing_page: string | null
  referrer: string | null
  quoted_amount: number | null
  final_amount: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type DateRange = { from: string; to: string; previousFrom: string; previousTo: string }

