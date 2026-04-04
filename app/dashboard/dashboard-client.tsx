"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Processo, Acordo } from "@/lib/types"
import { cn } from "@/lib/utils"

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
        "flex-1 transition-all duration-500 max-w-7xl mx-auto",
        isCollapsed ? "md:ml-20" : "md:ml-64",
        "ml-0"
      )}>
        
        <div className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </button>
            <h1 className="text-xl font-black tracking-widest uppercase">
              {getPageTitle(activeNavItem)} // DEXCO
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs uppercase cursor-pointer hover:bg-foreground transition-colors">
              DX
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
          
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

      </main>
    </div>
  )
}
