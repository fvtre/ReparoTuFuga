import { NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/supabase/auth'
import { getDateRange } from '@/lib/date-range'
import { getGoogleAdsReport } from '@/lib/google-ads'
export async function GET(request:Request){if(!await getAdminUser())return NextResponse.json({error:'No autorizado'},{status:401});const url=new URL(request.url);try{const range=getDateRange(url.searchParams.get('period')||'30d',url.searchParams.get('from'),url.searchParams.get('to'));return NextResponse.json(await getGoogleAdsReport(range.from,range.to))}catch{return NextResponse.json({error:'Período inválido'},{status:400})}}

