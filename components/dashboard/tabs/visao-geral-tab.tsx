"use client"

import { useMemo } from "react"
import { Processo } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Scale, Activity, DollarSign, Building2, TrendingUp, ArrowUpRight } from "lucide-react"

interface VisaoGeralTabProps {
  processos: Processo[];
}

// Azul Royal palette
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
    const ativos = total;
    const valorTotal = processos.reduce((s, p) => s + (p.valor_causa || 0), 0);
    return { total, ativos, valorTotal };
  }, [processos]);

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

  const faseData = useMemo(() => {
    const map: Record<string, number> = {};
    processos.forEach(p => {
      const fase = (p.fase_processo || p.fase_processual || "OUTROS").toUpperCase();
      map[fase] = (map[fase] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [processos]);

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-xl border border-border rounded-xl px-4 py-3 text-sm">
          <p className="font-semibold text-foreground mb-0.5">{label || payload[0]?.payload?.name}</p>
          <p className="text-muted-foreground text-xs">{payload[0]?.value} processo(s)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total de Processos */}
        <Card className="glass-card rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${ROYAL_BLUE}10` }}>
                <Scale className="h-5 w-5" style={{ color: ROYAL_BLUE }} />
              </div>
              <Badge variant="outline" className="text-[9px] font-semibold px-2 py-0.5 rounded-full border-border text-muted-foreground">
                Todos
              </Badge>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Total de Processos</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-foreground tabular-nums">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        {/* Processos Ativos */}
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 rounded-xl border-0" style={{ background: `linear-gradient(135deg, ${ROYAL_BLUE} 0%, #1a3f80 100%)` }}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5">
                <TrendingUp className="h-3 w-3 text-emerald-300" />
                <span className="text-[9px] font-semibold text-emerald-300">Ativos</span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-white/60 uppercase tracking-wider mb-1">Processos Ativos</p>
            <p className="text-3xl font-bold text-white tabular-nums">{stats.ativos}</p>
          </CardContent>
        </Card>

        {/* Valor Total */}
        <Card className="glass-card rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Valor Total das Causas</p>
            <p className="text-xl font-bold text-foreground tabular-nums leading-tight">{formatCurrency(stats.valorTotal)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Rankings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Comarcas Ranking */}
        <Card className="rounded-xl shadow-sm border border-border/60 bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2.5">
              <span className="h-5 w-5 rounded-md flex items-center justify-center text-xs" style={{ backgroundColor: `${ROYAL_BLUE}12` }}>📍</span>
              Comarcas com maior volume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 pt-0">
            {comarcasRanking.map((c) => (
              <div key={c.name} className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors group cursor-default">
                <span className="text-[10px] font-bold text-muted-foreground/60 w-5 text-right tabular-nums">{c.rank}º</span>
                <span className="text-[11px] font-semibold text-foreground/80 uppercase flex-shrink-0 min-w-[100px] group-hover:text-foreground transition-colors">
                  {c.name}
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${(c.value / maxComarca) * 100}%`, 
                      background: `linear-gradient(90deg, ${ROYAL_BLUE} 0%, ${ROYAL_BLUE_SOFT} 100%)`,
                      opacity: 1 - (c.rank - 1) * 0.06
                    }} 
                  />
                </div>
                <span className="text-xs font-bold text-foreground tabular-nums w-8 text-right">{c.value}</span>
              </div>
            ))}
            {comarcasRanking.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-6">Sem dados de comarcas.</p>
            )}
          </CardContent>
        </Card>

        {/* Unidades Organizacionais */}
        <Card className="rounded-xl shadow-sm border border-border/60 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2.5">
              <Building2 className="h-4 w-4" style={{ color: ROYAL_BLUE }} />
              Unidades com mais ações ajuizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unidadesData} layout="vertical" margin={{ top: 5, right: 40, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--foreground))", fontWeight: 500 }} width={150} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={24}>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Fase */}
        <Card className="rounded-xl shadow-sm border border-border/60 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              Processos Ativos por Fase
              <Badge variant="secondary" className="text-[9px] font-semibold px-2 py-0 rounded-full">Total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={faseData} layout="vertical" margin={{ top: 5, right: 40, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--foreground))", fontWeight: 600 }} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={22}>
                    {faseData.map((_, index) => (
                      <Cell key={`fase-${index}`} fill={CHART_GRADIENT[index % CHART_GRADIENT.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tipo de Ação */}
        <Card className="rounded-xl shadow-sm border border-border/60 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">Distribuição por Tipo de Ação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tipoAcaoData} layout="vertical" margin={{ top: 5, right: 40, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--foreground))", fontWeight: 500 }} width={150} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={22}>
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

      {/* Ranking Advogado */}
      <Card className="rounded-xl shadow-sm border border-border/60 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            Ranking Advogado Adverso
            <Badge variant="secondary" className="text-[9px] font-semibold px-2 py-0 rounded-full">Total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={advogadoData} layout="vertical" margin={{ top: 5, right: 40, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--foreground))", fontWeight: 500 }} width={180} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={20}>
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
