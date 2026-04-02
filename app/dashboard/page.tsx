import DashboardClient from './dashboard-client'
import { mockProcessos, mockAcordos } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // ATUALMENTE DADOS MOCKADOS CONFORME INSTRUÇÃO
  
  return (
    <DashboardClient 
      processos={mockProcessos}
      acordos={mockAcordos}
    />
  )
}
