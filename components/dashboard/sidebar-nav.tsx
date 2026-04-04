"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase-client"
import {
  LayoutDashboard,
  FileText,
  Settings,
  Handshake,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SidebarNavProps {
  activeItem?: string
  onItemClick?: (item: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
  onLogout?: () => void
}

const navItems = [
  { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { id: "processos", label: "Processos", icon: FileText },
  { id: "acordos", label: "Acordos", icon: Handshake },
  { id: "configuracoes", label: "Configurações", icon: Settings }
]

export function SidebarNav({ 
  activeItem = "dashboard", 
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
  onLogout
}: SidebarNavProps) {
  const [userEmail, setUserEmail] = useState<string>("Carregando...")
  const [userInitials, setUserInitials] = useState<string>("--")

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email) {
        setUserEmail(user.email)
        setUserInitials(user.email.substring(0, 2).toUpperCase())
      } else {
        setUserEmail("Usuário")
        setUserInitials("US")
      }
    }
    fetchUser()
  }, [])

  const handleItemClick = (id: string) => {
    onItemClick?.(id)
    onMobileClose?.()
  }

  const showLabel = isMobileOpen || !isCollapsed

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-screen sidebar-glow",
          "hidden md:flex transition-all duration-300 ease-out",
          isCollapsed ? "md:w-[72px]" : "md:w-64",
          isMobileOpen && "flex w-72 shadow-2xl animate-in slide-in-from-left duration-300"
        )}
        style={{
          background: "linear-gradient(180deg, #0a1e47 0%, #0F2A60 40%, #142f5e 100%)"
        }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden">
          
          {/* Logo Header */}
          <div className="flex items-center px-4 py-5 border-b border-white/10 min-h-[72px]">
            <div className={cn("flex items-center gap-3 w-full", isCollapsed && !isMobileOpen && "justify-center")}>
              {/* Martinelli Logo Mark */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="text-white font-bold text-sm tracking-tight">M</span>
              </div>
              {showLabel && (
                <div className="flex-1 min-w-0">
                  <Image
                    src="/martinelli-logo.svg"
                    alt="Martinelli Advogados"
                    width={160}
                    height={28}
                    className="h-7 w-auto opacity-95"
                  />
                </div>
              )}
            </div>

            {/* Mobile close */}
            {isMobileOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileClose}
                className="md:hidden h-8 w-8 p-0 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Client Badge */}
          {showLabel && (
            <div className="px-4 py-3">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08]">
                <div className="h-6 w-6 rounded bg-white flex items-center justify-center shrink-0">
                  <span className="text-[8px] font-black text-[#0F2A60] tracking-tight">DX</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-white/90 tracking-wide uppercase">Dexco S.A.</p>
                  <p className="text-[9px] text-white/40 font-medium">Contencioso Trabalhista</p>
                </div>
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          <div className="hidden md:flex px-3 py-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleCollapse} 
              className={cn(
                "w-full h-7 text-white/40 hover:bg-white/10 hover:text-white/80 rounded-md",
                isCollapsed ? "justify-center" : "justify-end"
              )}
            >
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-0.5 px-3 py-3 overflow-y-auto">
            {showLabel && (
              <p className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.15em] px-3 pb-2">
                Navegação
              </p>
            )}
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={!showLabel ? item.label : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 relative",
                    isActive
                      ? "bg-white/[0.12] text-white shadow-sm"
                      : "text-white/55 hover:bg-white/[0.06] hover:text-white/85",
                    !showLabel ? "justify-center" : "justify-start"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />
                  )}
                  <Icon className={cn("shrink-0", !showLabel ? "h-5 w-5" : "h-[18px] w-[18px]")} />
                  {showLabel && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 p-3 space-y-2">
            <div className={cn("flex items-center gap-3 px-2 py-1.5", !isMobileOpen && isCollapsed && "justify-center")}>
              <div className="h-8 w-8 shrink-0 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-white/80">{userInitials}</span>
              </div>
              {showLabel && (
                <div className="flex-1 truncate min-w-0">
                  <p className="text-xs font-medium text-white/80 truncate" title={userEmail}>{userEmail}</p>
                  <p className="text-[10px] text-white/35 font-medium">Advogado(a)</p>
                </div>
              )}
            </div>
            
            <button
              onClick={onLogout}
              title={!showLabel ? "Sair" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                "text-white/35 hover:bg-red-500/10 hover:text-red-300",
                !showLabel ? "justify-center" : "justify-start"
              )}
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              {showLabel && <span>Sair da conta</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
