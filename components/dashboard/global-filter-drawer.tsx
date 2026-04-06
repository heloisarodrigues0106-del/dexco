"use client"

import { useState, useEffect, useMemo } from "react"
import { Filter, X } from "lucide-react"
import { Processo } from "@/lib/types"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export interface FilterState {
  unidadeOrganizacional: string
  advogadoAdverso: string
  tipoAcao: string
  varaComarca: string
}

interface GlobalFilterDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  processos: Processo[]
  currentFilters: FilterState
  onApplyFilters: (filters: FilterState) => void
}

export function GlobalFilterDrawer({
  isOpen,
  onOpenChange,
  processos,
  currentFilters,
  onApplyFilters,
}: GlobalFilterDrawerProps) {
  // Local state for the drawer before applying
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters)

  // Sync state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(currentFilters)
    }
  }, [isOpen, currentFilters])

  // Extract unique values from data
  const { unidades, advogados, tiposAcao, varasComarcas } = useMemo(() => {
    const un = new Set<string>()
    const adv = new Set<string>()
    const tipos = new Set<string>()
    const vc = new Set<string>()

    processos.forEach(p => {
      if (p.unidade_organizacional) un.add(p.unidade_organizacional)
      if (p.advogado_reclamante) adv.add(p.advogado_reclamante)
      if (p.tipo_acao) tipos.add(p.tipo_acao)
      
      const comarcaVal = p.comarca || ""
      const varaVal = p.vara || ""
      if (comarcaVal || varaVal) {
        vc.add(`${comarcaVal} - ${varaVal}`.replace(/^- |- $/g, '').trim())
      }
    })

    return {
      unidades: Array.from(un).sort(),
      advogados: Array.from(adv).sort(),
      tiposAcao: Array.from(tipos).sort(),
      varasComarcas: Array.from(vc).sort(),
    }
  }, [processos])

  const handleApply = () => {
    onApplyFilters(localFilters)
    onOpenChange(false)
  }

  const handleClear = () => {
    const cleared = {
      unidadeOrganizacional: "all",
      advogadoAdverso: "all",
      tipoAcao: "all",
      varaComarca: "all",
    }
    setLocalFilters(cleared)
    onApplyFilters(cleared)
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto" side="right">
        <SheetHeader className="pb-6 border-b border-border/40 mb-6">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            Filtros
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-muted-foreground pb-2 border-b border-border/20">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider">CATEGORIAS</span>
          </div>

          <div className="space-y-4">
            {/* Unidade Organizacional */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Unidade/Centro de Custo
              </Label>
              <Select 
                value={localFilters.unidadeOrganizacional} 
                onValueChange={(val) => setLocalFilters({ ...localFilters, unidadeOrganizacional: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {unidades.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advogado Adverso */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Advogado Adverso
              </Label>
              <Select 
                value={localFilters.advogadoAdverso} 
                onValueChange={(val) => setLocalFilters({ ...localFilters, advogadoAdverso: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {advogados.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Ação */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tipo de Ação
              </Label>
              <Select 
                value={localFilters.tipoAcao} 
                onValueChange={(val) => setLocalFilters({ ...localFilters, tipoAcao: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {tiposAcao.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vara e Comarca */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Vara e Comarca
              </Label>
              <Select 
                value={localFilters.varaComarca} 
                onValueChange={(val) => setLocalFilters({ ...localFilters, varaComarca: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {varasComarcas.map(vc => (
                    <SelectItem key={vc} value={vc}>{vc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleClear}>
            Limpar
          </Button>
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleApply}>
            Aplicar e Fechar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
