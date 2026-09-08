import { createClient } from '@/lib/supabase/server'
import { KanbanBoard } from '@/components/admin/kanban-board'
import type { Lead } from '@/lib/types'
export default async function KanbanPage(){const db=await createClient();const {data}=db?await db.from('leads').select('*').order('created_at',{ascending:false}):{data:[]};return <div><p className="text-sm font-semibold text-blue-600">EMBUDO COMERCIAL</p><h1 className="mt-1 text-3xl font-bold">Kanban de oportunidades</h1><p className="mt-2 text-sm text-slate-500">Arrastra cada tarjeta para actualizar su estado.</p><div className="mt-6 overflow-x-auto pb-4"><KanbanBoard initialLeads={(data??[]) as Lead[]}/></div></div>}

