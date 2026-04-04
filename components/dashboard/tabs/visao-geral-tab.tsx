"use client"

import { useMemo } from "react"
import { Processo } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Scale, Activity, Archive, DollarSign, TrendingDown, Building2 } from "lucide-react"

interface VisaoGeralTabProps {
  processos: Processo[];
}

// Azul Royal palette shades
const ROYAL_BLUE = "#0F2A60";
const ROYAL_BLUE_LIGHT = "#1A3F80";
const ROYAL_BLUE_MEDIUM = "#2558A8";
const ROYAL_BLUE_SOFT = "#3B7DD8";
const ROYAL_BLUE_PALE = "#6FA3E8";
const ROYAL_BLUE_TINT = "#A8C8F0";

const CHART_GRADIENT = [ROYAL_BLUE, ROYAL_BLUE_LIGHT, ROYAL_BLUE_MEDIUM, ROYAL_BLUE_SOFT, ROYAL_BLUE_PALE, ROYAL_BLUE_TINT, "#C5DAEE", "#DDE9F5", "#EDF3FA", "#F6F9FD"];

export function VisaoGeralTab({ processos }: VisaoGeralTabProps) {

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const stats = useMemo(() => {
    const total = processos.length;
    const arquivados = processos.filter(p => {
      const fase = (p.fase_processo || p.fase_processual || p.status || "").toLowerCase();
      return fase.includes("arquivado") || fase.includes("encerrado") || fase.includes("transitado");
    }).length;
    const ativos = total - arquivados;
    const valorTotal = processos.reduce((s, p) => s + (p.valor_causa || 0), 0);
    return { total, ativos, arquivados, valorTotal };
  }, [processos]);

  // Comarcas ranking
  const comarcasRanking = useMemo(() => {
    const map: Record<string, number> = {};
    processos.forEach(p => {
      const key = (p.comarca || "N/A").toUpperCase();
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value], i) => ({ name, value, rank: i + 1 }));
  }, [processos]);

  const maxComarca = comarcasRanking[0]?.value || 1;

  // Processos Ativos por Fase
  const faseData = useMemo(() => {
    const map: Record<string, number> = {};
    processos.forEach(p => {
      const fase = (p.fase_processo || p.fase_processual || "OUTROS").toUpperCase();
      if (!(p.status || p.fase_processo || "").toLowerCase().includes("arquivado")) {
        map[fase] = (map[fase] || 0) + 1;
      }
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [processos]);

  // Distribuição por Tipo de Ação
  const tipoAcaoData = useMemo(() => {
    const map: Record<string, number> = {};
    processos.forEach(p => {
      const tipo = (p.tipo_acao || "OUTROS").toUpperCase();
      map[tipo] = (map[tipo] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [processos]);

  // Ranking Advogado Adverso (Reclamante)
  const advogadoData = useMemo(() => {
    const map: Record<string, number> = {};
    processos.forEach(p => {
      const adv = (p.advogado_reclamante || "NÃO INFORMADO").toUpperCase().trim();
      if (adv && adv !== "NÃO INFORMADO") {
        map[adv] = (map[adv] || 0) + 1;
      }
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [processos]);

  // Unidades Organizacionais (chart solicitado)
  const unidadesData = useMemo(() => {
    const map: Record<string, number> = {};
    processos.forEach(p => {
      const un = (p.unidade_organizacional || "NÃO INFORMADO").toUpperCase().trim();
      map[un] = (map[un] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, [processos]);

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg border border-slate-200 rounded-lg px-4 py-3 text-sm">
          <p className="font-bold text-slate-800 mb-1">{label || payload[0]?.payload?.name}</p>
          <p className="text-slate-600">{payload[0]?.value} processo(s)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">

      {/* 1. KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm border-2 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-500">Total de Processos</h3>
              <Scale className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-2 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-500">Processos Ativos</h3>
              <Activity className="h-4 w-4" style={{ color: ROYAL_BLUE }} />
            </div>
            <p className="text-3xl font-black" style={{ color: ROYAL_BLUE }}>{stats.ativos}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-2 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-500">Processos Arquivados</h3>
              <Archive className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-3xl font-black text-slate-600">{stats.arquivados}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-2 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-500">Valor Total das Causas</h3>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-xl font-black text-slate-900 leading-tight">{formatCurrency(stats.valorTotal)}</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Comarcas Ranking + UF Overview (two columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Comarcas com maior volume */}
        <Card className="rounded-xl shadow-sm border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="text-lg">📍</span> Comarcas com maior volume de ajuizamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {comarcasRanking.map((c) => (
              <div key={c.name} className="flex items-center gap-3 py-2 border border-slate-100 rounded-lg px-3 hover:bg-slate-50 transition-colors">
                <span className="text-xs font-black text-slate-400 w-5 text-right">{c.rank}º</span>
                <span className="text-xs font-bold text-slate-700 uppercase flex-shrink-0 min-w-[100px]">
                  {c.name} <span className="text-[10px] text-slate-400">↗</span>
                </span>
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ 
                      width: `${(c.value / maxComarca) * 100}%`, 
                      backgroundColor: ROYAL_BLUE,
                      opacity: 1 - (c.rank - 1) * 0.07
                    }} 
                  />
                </div>
                <span className="text-sm font-black text-slate-700 w-6 text-right">{c.value}</span>
              </div>
            ))}
            {comarcasRanking.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">Sem dados de comarcas.</p>
            )}
          </CardContent>
        </Card>

        {/* Unidades Organizacionais com mais ações */}
        <Card className="rounded-xl shadow-sm border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="h-5 w-5" style={{ color: ROYAL_BLUE }} /> Unidades Organizacionais com mais ações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[370px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={unidadesData} 
                  layout="vertical" 
                  margin={{ top: 5, right: 40, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "#334155", fontWeight: 600 }} 
                    width={130}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {unidadesData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_GRADIENT[index % CHART_GRADIENT.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Processos por Fase + Distribuição por Tipo de Ação */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Processos Ativos por Fase */}
        <Card className="rounded-xl shadow-sm border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              Processos Ativos por Fase
              <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 border-slate-300 text-slate-500 ml-1">Total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={faseData} layout="vertical" margin={{ top: 5, right: 40, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "#334155", fontWeight: 700 }} 
                    width={120}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={26}>
                    {faseData.map((_, index) => (
                      <Cell key={`fase-${index}`} fill={CHART_GRADIENT[index % CHART_GRADIENT.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Tipo de Ação */}
        <Card className="rounded-xl shadow-sm border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-800">Distribuição por Tipo de Ação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tipoAcaoData} layout="vertical" margin={{ top: 5, right: 40, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "#334155", fontWeight: 600 }} 
                    width={150}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={26}>
                    {tipoAcaoData.map((_, index) => (
                      <Cell key={`tipo-${index}`} fill={index === 0 ? ROYAL_BLUE : CHART_GRADIENT[Math.min(index + 1, CHART_GRADIENT.length - 1)]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Ranking Advogado Adverso */}
      <Card className="rounded-xl shadow-sm border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            Ranking Advogado Adverso
            <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 border-slate-300 text-slate-500 ml-1">Total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={advogadoData} layout="vertical" margin={{ top: 5, right: 40, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#334155", fontWeight: 600 }} 
                  width={180}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={24}>
                  {advogadoData.map((_, index) => (
                    <Cell key={`adv-${index}`} fill={CHART_GRADIENT[index % CHART_GRADIENT.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
