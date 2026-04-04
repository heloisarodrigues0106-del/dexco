"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowDownRight, CheckCircle2 } from "lucide-react"
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts"
import { Acordo } from "@/lib/types"

interface AcordosTabProps {
  acordos: Acordo[];
}

export function AcordosTab({ acordos }: AcordosTabProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const stats = useMemo(() => {
    let totalCausa = 0;
    let totalAcordo = 0;
    let totalSaving = 0;

    acordos.forEach(a => {
      totalCausa += (a.valor_causa || 0);
      totalAcordo += (a.valor_acordo || 0);
      totalSaving += (a.saving || 0);
    });

    const taxaEconomia = totalCausa > 0 ? (totalSaving / totalCausa) * 100 : 0;
    const mediaDesconto = acordos.length > 0 ? (acordos.reduce((acc, a) => acc + (a.valor_causa > 0 ? (a.saving / a.valor_causa) : 0), 0) / acordos.length) * 100 : 0;

    return {
      totalCausa,
      totalAcordo,
      totalSaving,
      taxaEconomia,
      mediaDesconto,
      totalCount: acordos.length
    }
  }, [acordos]);

  const filteredAcordos = useMemo(() => {
    if (!searchTerm) return acordos;
    return acordos.filter(a => 
      a.numero_processo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.TRT?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [acordos, searchTerm]);

  // Dados para o Gráfico de Barras
  const barChartData = [
    { name: 'Valor Total Pedido', total: stats.totalCausa, media: stats.totalCausa / (stats.totalCount || 1) },
    { name: 'Valor Total Acordado', total: stats.totalAcordo, media: stats.totalAcordo / (stats.totalCount || 1) },
    { name: 'Economia Total Gerada', total: stats.totalSaving, media: stats.totalSaving / (stats.totalCount || 1) }
  ];

  // Dados para o Gráfico de Dispersão (Scatter)
  const scatterData = acordos.map(a => ({
    x: a.valor_causa,
    y: a.valor_acordo,
    z: a.saving,
    name: a.numero_processo
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Metrics (Verde Claro) */}
      <div className="bg-[#eafefa] border border-[#a7f3d0] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row shadow-sm justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#059669] font-bold text-sm">
            <ArrowDownRight className="h-5 w-5" />
            Economia Total Gerada
          </div>
          <div className="text-4xl md:text-5xl font-black text-[#047857]">{formatCurrency(stats.totalSaving)}</div>
          <p className="text-[#059669]/80 text-sm font-medium">Diferença entre valor pedido e valor acordado</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-[#a7f3d0] p-4 flex flex-col justify-center items-center min-w-[120px]">
            <div className="text-[#047857] font-black text-2xl mb-1">{formatPercent(stats.taxaEconomia)}</div>
            <div className="text-[#059669]/70 text-xs font-bold uppercase text-center">Taxa de<br/>Economia</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-[#a7f3d0] p-4 flex flex-col justify-center items-center min-w-[120px]">
            <CheckCircle2 className="h-6 w-6 text-[#047857] mb-1" />
            <div className="text-[#047857] font-black text-2xl mb-1">{stats.totalCount}</div>
            <div className="text-[#059669]/70 text-xs font-bold uppercase text-center">Acordos<br/>Fechados</div>
          </div>
        </div>
      </div>

      {/* 2. Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Valor Total Pedido</h3>
            <p className="text-2xl font-black text-slate-800">{formatCurrency(stats.totalCausa)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Valor Total Acordado</h3>
            <p className="text-2xl font-black text-slate-800">{formatCurrency(stats.totalAcordo)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Média de Desconto</h3>
            <p className="text-2xl font-black text-amber-600">{formatPercent(stats.mediaDesconto)}</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Detail Table */}
      <Card className="rounded-xl shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                Detalhamento de Acordos e Savings
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 ml-4">Listagem técnica de negociações e economia gerada</p>
            </div>
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar processo ou juízo..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-bold uppercase bg-slate-50 border-b border-border text-slate-500">
              <tr>
                <th className="px-6 py-4">Processo</th>
                <th className="px-6 py-4">Juízo</th>
                <th className="px-6 py-4 text-right">Financeiro (Saving)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAcordos.map((a) => {
                const savingPerc = a.valor_causa > 0 ? (a.saving / a.valor_causa) * 100 : 0;
                return (
                  <tr key={a.numero_processo} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-primary font-medium">{a.numero_processo}</td>
                    <td className="px-6 py-4 text-slate-600 uppercase text-xs font-medium">{a.TRT || "N/A"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="text-xs font-medium whitespace-nowrap">
                          <span className="text-slate-400 line-through mr-2">{formatCurrency(a.valor_causa)}</span>
                          <span className="text-slate-800 font-bold">R$ ↘ {formatCurrency(a.valor_acordo)}</span>
                        </div>
                        <Badge variant="outline" className="bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#059669] border-[#a7f3d0] flex items-center gap-1 font-bold whitespace-nowrap">
                          <ArrowDownRight className="h-3 w-3" />
                          {formatPercent(savingPerc)} ({formatCurrency(a.saving)})
                        </Badge>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredAcordos.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground font-medium">Nenhum acordo encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">Totais e Média por Acordo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: "#64748b"}} />
                  <YAxis 
                    yAxisId="left" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 11, fill: "#64748b"}}
                    tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={false}
                  />
                  <Tooltip 
                    cursor={{fill: "#f8fafc"}}
                    contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(val: number) => formatCurrency(val)}
                  />
                  {/* Azul Royal for Bars */}
                  <Bar yAxisId="left" dataKey="total" name="Total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  <Line yAxisId="right" type="monotone" dataKey="media" name="Média" stroke="#1e293b" strokeWidth={2} dot={{r: 4, fill: "#1e293b"}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><span className="w-3 h-3 bg-primary rounded-sm"></span> Total</div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><div className="w-3 h-[2px] bg-[#1e293b] rounded-sm relative"><div className="absolute w-2 h-2 rounded-full bg-[#1e293b] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div></div> Média</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">Comparativo: Valor Pedido vs Valor do Acordo</CardTitle>
            <p className="text-xs text-muted-foreground">Eixo X: Valor Pedido &nbsp;&nbsp; Eixo Y: Valor do Acordo</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Valor Pedido" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 11, fill: "#64748b"}}
                    tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Valor Acordo" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 11, fill: "#64748b"}}
                    tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                  />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} />
                  <Tooltip 
                    cursor={{strokeDasharray: '3 3'}}
                    contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: any, name: string) => [formatCurrency(value as number), name]}
                  />
                  {/* Azul Royal for Scatter Points */}
                  <Scatter name="Acordos" data={scatterData} fill="hsl(var(--primary))" opacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><span className="w-3 h-3 bg-primary rounded-full opacity-70"></span> Valor Pedido x Acordo</div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
