"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Processo, Acordo } from "@/lib/types"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Menu, Bell, Search, Filter } from "lucide-react"

import { AcordosTab } from "@/components/dashboard/tabs/acordos-tab"
import { ProcessosTab } from "@/components/dashboard/tabs/processos-tab"
import { VisaoGeralTab } from "@/components/dashboard/tabs/visao-geral-tab"
import { ConfiguracoesTab } from "@/components/dashboard/tabs/configuracoes-tab"
import { GlobalFilterDrawer, FilterState } from "@/components/dashboard/global-filter-drawer"
import { createClient } from "@/lib/supabase-client"

interface DashboardClientProps {
  processos: Processo[];
  acordos: Acordo[];
}

export default function DashboardClient({ processos, acordos }: DashboardClientProps) {
  const router = useRouter()
  const [activeNavItem, setActiveNavItem] = useState("dashboard")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const [filters, setFilters] = useState<FilterState>({
    unidadeOrganizacional: "all",
    advogadoAdverso: "all",
    tipoAcao: "all",
    varaComarca: "all",
  })

  const filteredProcessos = useMemo(() => {
    return processos.filter(p => {
      if (filters.unidadeOrganizacional !== "all" && p.unidade_organizacional !== filters.unidadeOrganizacional) return false;
      if (filters.advogadoAdverso !== "all" && p.advogado_reclamante !== filters.advogadoAdverso) return false;
      if (filters.tipoAcao !== "all" && p.tipo_acao !== filters.tipoAcao) return false;
      
      if (filters.varaComarca !== "all") {
        const vc = `${p.comarca || ""} - ${p.vara || ""}`.replace(/^- |- $/g, '').trim()
        if (vc !== filters.varaComarca) return false;
      }
      return true;
    });
  }, [processos, filters]);

  const filteredAcordos = useMemo(() => {
    // If no filters are active, return all
    if (filters.unidadeOrganizacional === "all" && filters.advogadoAdverso === "all" && 
        filters.tipoAcao === "all" && filters.varaComarca === "all") {
      return acordos;
    }
    // Only map acordos that relate to the filtered processos
    const validProcessNumbers = new Set(filteredProcessos.map(p => p.numero_processo));
    return acordos.filter(a => validProcessNumbers.has(a.numero_processo));
  }, [acordos, filteredProcessos, filters]);

  const handleLogout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }, [router])

  const getPageTitle = (id: string) => {
    if (id === "dashboard") return "Visão Geral";
    if (id === "acordos") return "Acordos";
    if (id === "processos") return "Processos";
    return id;
  }

  const getPageSubtitle = (id: string) => {
    if (id === "dashboard") return "Panorama executivo do contencioso trabalhista";
    if (id === "acordos") return "Gestão e acompanhamento dos acordos realizados";
    if (id === "processos") return "Detalhamento completo dos processos ativos";
    return "";
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <GlobalFilterDrawer 
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        processos={processos}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
      
      <SidebarNav 
        activeItem={activeNavItem} 
        onItemClick={setActiveNavItem} 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      <main className={cn(
        "flex-1 transition-all duration-500 ease-out",
        isCollapsed ? "md:ml-[72px]" : "md:ml-64",
        "ml-0"
      )}>
        
        {/* Executive Header */}
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-6 max-w-[1400px] mx-auto">
            
            {/* Left: Mobile Menu */}
            <div className="flex items-center gap-4 w-1/3">
              {/* Mobile hamburger */}
              <button 
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
            
            {/* Center: Logo */}
            <div className="flex items-center justify-center w-1/3">
              <Image
                src="/dexco-logo.svg"
                alt="Dexco"
                width={200}
                height={200}
                className="w-32 h-auto opacity-90 scale-[1.8]"
                priority
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-2 w-1/3">
              {/* Filter drawer trigger */}
              <button 
                className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="h-4 w-4" />
                {Object.values(filters).some(v => v !== "all") && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full pulse-dot" />
                )}
              </button>

            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-slide-up">
          
          {activeNavItem === "dashboard" && (
            <VisaoGeralTab processos={filteredProcessos} />
          )}

          {activeNavItem === "acordos" && (
            <AcordosTab acordos={filteredAcordos} />
          )}

          {activeNavItem === "processos" && (
            <ProcessosTab processos={filteredProcessos} />
          )}

          {activeNavItem === "configuracoes" && (
            <ConfiguracoesTab />
          )}

        </div>

        {/* Footer */}
        <footer className="border-t border-border/40 py-4 px-6">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between text-[10px] text-muted-foreground/50">
            <span>© {new Date().getFullYear()} Dexco S.A. — Powered by Martinelli Advogados</span>
            <span className="hidden sm:inline">Gestão de Contencioso Trabalhista</span>
          </div>
        </footer>

      </main>
    </div>
  )
}
