import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminUser } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { LEAD_STATUSES } from '@/lib/types'

const schema=z.object({status:z.enum(LEAD_STATUSES),note:z.string().trim().max(3000).optional(),quotedAmount:z.number().nonnegative().nullable(),finalAmount:z.number().nonnegative().nullable()})
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getAdminUser(); if(!user)return NextResponse.json({error:'No autorizado'},{status:401})
  const parsed=schema.safeParse(await request.json()); if(!parsed.success)return NextResponse.json({error:'Datos inválidos'},{status:400})
  const {id}=await params, db=await createClient(); if(!db)return NextResponse.json({error:'Base de datos no configurada'},{status:503})
  const {data:previous}=await db.from('leads').select('status,quoted_amount,final_amount').eq('id',id).single()
  const {status,note,quotedAmount,finalAmount}=parsed.data
  const {error}=await db.from('leads').update({status,quoted_amount:quotedAmount,final_amount:finalAmount,...(note?{notes:note}:{})}).eq('id',id)
  if(error)return NextResponse.json({error:'No fue posible actualizar'},{status:500})
  const activities=[] as {lead_id:string;actor_id:string;activity_type:string;details:Record<string,unknown>}[]
  if(previous?.status!==status)activities.push({lead_id:id,actor_id:user.id,activity_type:'status_changed',details:{from:previous?.status,to:status}})
  if(note)activities.push({lead_id:id,actor_id:user.id,activity_type:'note_added',details:{note}})
  if(previous?.quoted_amount!==quotedAmount||previous?.final_amount!==finalAmount)activities.push({lead_id:id,actor_id:user.id,activity_type:'amount_updated',details:{quoted_amount:quotedAmount,final_amount:finalAmount}})
  if(activities.length)await db.from('lead_activity').insert(activities)
  return NextResponse.json({success:true})
}
