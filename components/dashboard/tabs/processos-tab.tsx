"use client"

import { useMemo, useState } from "react"
import { Processo } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, ChevronLeft, ChevronRight, Eye, Scale, MapPin, Briefcase, Landmark, User, DollarSign, Activity } from "lucide-react"

interface ProcessosTabProps {
  processos: Processo[];
}

export function ProcessosTab({ processos }: ProcessosTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProcessos = useMemo(() => {
    return processos.filter(p => {
      const searchLower = searchTerm.toLowerCase();
      return (
        p.numero_processo?.toLowerCase().includes(searchLower) ||
        p.nome_reclamante?.toLowerCase().includes(searchLower)
      );
    });
  }, [processos, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProcessos.length / itemsPerPage));

  const currentProcessos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProcessos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProcessos, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  // Cor Azul Royal da Martinelli
  const ROYAL_BLUE = "#0F2A60";

  // Gera array de páginas para a paginação
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm border-2 overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">
                Detalhamento dos Processos
              </CardTitle>
            </div>
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar processo ou reclamante..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Volta para a primeira página ao pesquisar
                }}
              />
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto p-0">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800 text-xs uppercase tracking-wider">Número do Processo</th>
                <th className="px-6 py-4 font-bold text-slate-800 text-xs uppercase tracking-wider">Reclamante</th>
                <th className="px-6 py-4 font-bold text-slate-800 text-xs uppercase tracking-wider">TRT/Comarca</th>
                <th className="px-6 py-4 font-bold text-slate-800 text-xs uppercase tracking-wider">Fase Atual</th>
                <th className="px-6 py-4 font-bold text-slate-800 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-slate-800 text-xs uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentProcessos.map((p) => {
                const statusName = (p.status || p.status_processo || p.fase_processo || "EM ANDAMENTO").toUpperCase();
                let badgeColor = "bg-slate-100 text-slate-700";
                
                if (statusName.includes("PROCEDENTE")) badgeColor = "bg-[#F6D000] text-black font-bold border-[#d97706]/30";
                else if (statusName.includes("ARQUIVADO")) badgeColor = "bg-[#fcd34d] text-amber-900 font-bold border-[#d97706]/30";
                else if (statusName.includes("IMPROCEDENTE")) badgeColor = "bg-red-100 text-red-700 font-bold";

                return (
                  <tr key={p.numero_processo} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 font-medium">{p.numero_processo}</td>
                    <td className="px-6 py-4 text-slate-800 text-xs font-semibold">{p.nome_reclamante}</td>
                    <td className="px-6 py-4 text-slate-500 uppercase text-xs">/ {p.comarca}</td>
                    <td className="px-6 py-4 text-slate-500 uppercase text-xs">
                      {p.fase_processual || p.fase_processo || "CONHECIMENTO"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`px-2 py-0.5 text-[10px] rounded-full ${badgeColor}`}>
                        {statusName}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedProcesso(p)}
                        className="font-bold flex items-center justify-end w-full group-hover:bg-[#f8fafc] transition-colors"
                        style={{ color: ROYAL_BLUE }}
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        Ver detalhes
                      </Button>
                    </td>
                  </tr>
                )
              })}
              {currentProcessos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground font-medium">Nenhum processo encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação Estilo Design System */}
        {totalPages > 0 && (
          <div className="border-t border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 font-medium">
              {filteredProcessos.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredProcessos.length)} de {filteredProcessos.length}
            </p>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="h-8 rounded-md text-slate-500 font-medium"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Anterior
              </Button>
              
              {getPageNumbers().map(num => (
                <Button
                  key={num}
                  variant={num === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(num)}
                  className={`h-8 w-8 p-0 rounded-md font-bold transition-colors ${
                    num === currentPage 
                      ? "text-white" 
                      : "text-slate-600 bg-white"
                  }`}
                  style={num === currentPage ? { backgroundColor: ROYAL_BLUE, borderColor: ROYAL_BLUE } : {}}
                >
                  {num}
                </Button>
              ))}

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="h-8 rounded-md text-slate-500 font-medium"
              >
                Próximo <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal de Detalhes do Processo */}
      <Dialog open={!!selectedProcesso} onOpenChange={(open) => !open && setSelectedProcesso(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-2">
          {selectedProcesso && (
            <>
              <DialogHeader className="p-6 pb-0 border-b border-border bg-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10" style={{ color: ROYAL_BLUE }}>
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold" style={{ color: ROYAL_BLUE }}>
                      Detalhamento do Processo
                    </DialogTitle>
                    <p className="text-sm font-mono text-muted-foreground mt-0.5">{selectedProcesso.numero_processo}</p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white overflow-y-auto max-h-[70vh]">
                
                {/* Info Block 1 */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <User className="h-3.5 w-3.5" /> Reclamante
                    </div>
                    <p className="text-sm font-bold text-slate-800">{selectedProcesso.nome_reclamante}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Briefcase className="h-3.5 w-3.5" /> Advogado do Reclamante
                    </div>
                    <p className="text-sm font-medium text-slate-700">{selectedProcesso.advogado_reclamante || "Não informado"}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Landmark className="h-3.5 w-3.5" /> Comarca / Vara
                    </div>
                    <p className="text-sm font-medium text-slate-700 uppercase">{selectedProcesso.comarca} - {selectedProcesso.vara} ({selectedProcesso.UF})</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Activity className="h-3.5 w-3.5" /> Fase Processual
                    </div>
                    <p className="text-sm font-medium text-slate-700 uppercase">{selectedProcesso.fase_processual || selectedProcesso.fase_processo || "Não informada"}</p>
                  </div>
                </div>

                {/* Info Block 2 */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <MapPin className="h-3.5 w-3.5" /> Unidade Organizacional
                    </div>
                    <p className="text-sm font-medium text-slate-700 uppercase">{selectedProcesso.unidade_organizacional || "Dexco Matriz"}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <DollarSign className="h-3.5 w-3.5" /> Valor da Causa
                    </div>
                    <p className="text-lg font-black text-slate-800">{formatCurrency(selectedProcesso.valor_causa)}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <DollarSign className="h-3.5 w-3.5" /> Provisionamento (Risco)
                    </div>
                    <p className="text-sm font-bold text-orange-600 bg-orange-50 inline-block px-2 py-0.5 rounded border border-orange-100">
                      {selectedProcesso.provisionamento ? selectedProcesso.provisionamento : "Risco Não Avaliado ou Risco Possível"}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2">
                     <Badge className="bg-[#1e293b] text-white hover:bg-[#334155] border-transparent font-medium py-1 px-3">
                       Status: {(selectedProcesso.status || selectedProcesso.status_processo || selectedProcesso.fase_processo || "Ativo").toUpperCase()}
                     </Badge>
                  </div>
                </div>

              </div>
              <div className="bg-slate-50 p-4 border-t flex justify-end">
                <Button 
                  variant="default" 
                  onClick={() => setSelectedProcesso(null)}
                  style={{ backgroundColor: ROYAL_BLUE }}
                  className="font-bold text-white hover:opacity-90 transition-opacity"
                >
                  Fechar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
