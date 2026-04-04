"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Processo, Acordo } from "@/lib/types"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Menu, Bell, Search } from "lucide-react"

import { AcordosTab } from "@/components/dashboard/tabs/acordos-tab"
import { ProcessosTab } from "@/components/dashboard/tabs/processos-tab"
import { VisaoGeralTab } from "@/components/dashboard/tabs/visao-geral-tab"

interface DashboardClientProps {
  processos: Processo[];
  acordos: Acordo[];
}

export default function DashboardClient({ processos, acordos }: DashboardClientProps) {
  const router = useRouter()
  const [activeNavItem, setActiveNavItem] = useState("dashboard")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = useCallback(async () => {
    router.push("/")
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
            <div className="flex items-center gap-4">
              {/* Mobile hamburger */}
              <button 
                className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Breadcrumb style navigation */}
              <div className="flex items-center gap-2">
                <Image
                  src="/dexco-logo.svg"
                  alt="Dexco"
                  width={80}
                  height={24}
                  className="h-5 w-auto opacity-70"
                />
                <span className="text-muted-foreground/40 text-sm">/</span>
                <span className="text-sm font-semibold text-foreground">
                  {getPageTitle(activeNavItem)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Search trigger */}
              <button className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Search className="h-4 w-4" />
              </button>
              {/* Notifications */}
              <button className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full pulse-dot" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Title Banner */}
        <div className="border-b border-border/40 bg-gradient-to-r from-background via-background to-muted/30">
          <div className="max-w-[1400px] mx-auto px-6 py-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {getPageTitle(activeNavItem)}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {getPageSubtitle(activeNavItem)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-slide-up">
          
          {activeNavItem === "dashboard" && (
            <VisaoGeralTab processos={processos} />
          )}

          {activeNavItem === "acordos" && (
            <AcordosTab acordos={acordos} />
          )}

          {activeNavItem === "processos" && (
            <ProcessosTab processos={processos} />
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
