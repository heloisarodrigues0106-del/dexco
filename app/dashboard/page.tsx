import DashboardClient from './dashboard-client'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  
  // Promessas paralelas para buscar processos e acordos
  const [processosRes, acordosRes] = await Promise.all([
    supabase.from('tb_processo').select('*'),
    supabase.from('tb_acordos').select('*')
  ])
  
  const processos = processosRes.data || []
  const acordos = acordosRes.data || []

  return (
    <DashboardClient 
      processos={processos}
      acordos={acordos}
    />
  )
}
