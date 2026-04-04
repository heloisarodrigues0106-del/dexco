"use client"

import { useMemo, useState } from "react"
import { Processo } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Scale, Activity, DollarSign, Building2, MapPin } from "lucide-react"

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

// SVG paths for Brazilian states
const BRAZIL_STATES: Record<string, { path: string; label: string; cx: number; cy: number }> = {
  AC: { path: "M48,168 L48,195 L80,195 L80,175 L65,168 Z", label: "AC", cx: 64, cy: 182 },
  AM: { path: "M65,100 L145,100 L160,120 L160,165 L80,175 L80,195 L48,195 L48,168 L35,150 L35,120 Z", label: "AM", cx: 98, cy: 145 },
  RR: { path: "M95,45 L130,45 L145,70 L145,100 L95,100 L80,80 Z", label: "RR", cx: 112, cy: 73 },
  AP: { path: "M195,50 L220,40 L235,60 L225,90 L200,95 L190,75 Z", label: "AP", cx: 210, cy: 68 },
  PA: { path: "M145,70 L195,50 L190,75 L200,95 L225,90 L240,105 L255,120 L245,145 L220,155 L195,145 L160,165 L160,120 L145,100 Z", label: "PA", cx: 195, cy: 118 },
  MA: { path: "M240,105 L255,100 L275,105 L290,120 L280,145 L255,158 L240,150 L245,145 L255,120 Z", label: "MA", cx: 265, cy: 128 },
  TO: { path: "M220,155 L245,145 L240,150 L255,158 L250,190 L240,215 L215,215 L210,190 Z", label: "TO", cx: 232, cy: 185 },
  PI: { path: "M275,105 L290,100 L305,115 L300,150 L290,168 L270,170 L258,160 L255,158 L280,145 L290,120 Z", label: "PI", cx: 282, cy: 138 },
  CE: { path: "M305,100 L325,95 L340,108 L330,125 L315,125 L305,115 Z", label: "CE", cx: 322, cy: 110 },
  RN: { path: "M340,108 L355,108 L355,122 L340,125 L330,125 Z", label: "RN", cx: 345, cy: 116 },
  PB: { path: "M330,125 L340,125 L355,122 L358,132 L330,135 Z", label: "PB", cx: 344, cy: 128 },
  PE: { path: "M290,168 L300,150 L315,145 L330,135 L358,132 L360,145 L340,150 L300,170 Z", label: "PE", cx: 328, cy: 148 },
  AL: { path: "M340,150 L360,145 L362,158 L345,162 Z", label: "AL", cx: 352, cy: 154 },
  SE: { path: "M340,162 L345,162 L362,158 L358,172 L342,170 Z", label: "SE", cx: 350, cy: 165 },
  BA: { path: "M270,170 L290,168 L300,170 L340,150 L340,162 L342,170 L358,172 L350,210 L335,240 L310,260 L280,260 L260,245 L250,220 L240,215 L250,190 Z", label: "BA", cx: 300, cy: 215 },
  MT: { path: "M130,185 L160,165 L195,145 L220,155 L210,190 L215,215 L200,240 L165,240 L140,225 L130,200 Z", label: "MT", cx: 172, cy: 200 },
  GO: { path: "M215,215 L240,215 L250,220 L260,245 L255,270 L240,280 L225,275 L218,260 L215,250 L200,240 Z", label: "GO", cx: 232, cy: 250 },
  DF: { path: "M248,252 L258,248 L260,258 L250,260 Z", label: "DF", cx: 254, cy: 254 },
  MS: { path: "M140,225 L165,240 L200,240 L215,250 L218,260 L225,275 L215,300 L190,315 L165,300 L145,275 L135,250 Z", label: "MS", cx: 178, cy: 272 },
  MG: { path: "M255,270 L260,245 L280,260 L310,260 L335,240 L340,255 L330,280 L310,295 L285,300 L265,295 L255,285 Z", label: "MG", cx: 295, cy: 272 },
  ES: { path: "M335,240 L350,235 L355,260 L340,270 L330,280 L340,255 Z", label: "ES", cx: 343, cy: 255 },
  RJ: { path: "M310,295 L330,280 L340,270 L345,280 L330,300 L310,305 Z", label: "RJ", cx: 328, cy: 290 },
  SP: { path: "M218,260 L225,275 L215,300 L230,315 L255,315 L275,305 L285,300 L265,295 L255,285 L255,270 L240,280 Z", label: "SP", cx: 250, cy: 292 },
  PR: { path: "M190,315 L215,300 L230,315 L255,315 L260,330 L240,340 L215,340 L195,330 Z", label: "PR", cx: 225, cy: 325 },
  SC: { path: "M215,340 L240,340 L255,345 L250,360 L230,365 L215,355 Z", label: "SC", cx: 235, cy: 350 },
  RS: { path: "M195,330 L215,340 L215,355 L230,365 L225,390 L210,400 L190,395 L172,370 L175,345 Z", label: "RS", cx: 200, cy: 368 },
  RO: { path: "M80,175 L130,185 L130,200 L110,210 L90,215 L75,205 L80,195 Z", label: "RO", cx: 105, cy: 195 },
};

// Compute heat color from count
function getStateColor(count: number, maxCount: number): string {
  if (count === 0) return "#E8ECF0";
  const intensity = count / maxCount;
  if (intensity > 0.7) return "#D4A017"; // gold/yellow for high
  if (intensity > 0.4) return "#F5DEB3"; // wheat for medium
  return "#FFF8DC"; // cornsilk for low
}

export function VisaoGeralTab({ processos }: VisaoGeralTabProps) {
  const [selectedUF, setSelectedUF] = useState<string | null>(null);
  const [hoveredUF, setHoveredUF] = useState<string | null>(null);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const stats = useMemo(() => {
    const total = processos.length;
    const ativos = total; // all are active unless status says otherwise
    const valorTotal = processos.reduce((s, p) => s + (p.valor_causa || 0), 0);
    return { total, ativos, valorTotal };
  }, [processos]);

  // UF-based data for map
  const ufData = useMemo(() => {
    const map: Record<string, { count: number; valor: number; comarcas: Record<string, number> }> = {};
    processos.forEach(p => {
      const uf = (p.UF || "").toUpperCase().trim();
      if (!uf) return;
      if (!map[uf]) map[uf] = { count: 0, valor: 0, comarcas: {} };
      map[uf].count++;
      map[uf].valor += (p.valor_causa || 0);
      const comarca = (p.comarca || "N/A").toUpperCase();
      map[uf].comarcas[comarca] = (map[uf].comarcas[comarca] || 0) + 1;
    });
    return map;
  }, [processos]);

  const maxUFCount = useMemo(() => {
    return Math.max(1, ...Object.values(ufData).map(d => d.count));
  }, [ufData]);

  const activeUF = selectedUF || hoveredUF;
  const activeUFData = activeUF ? ufData[activeUF] : null;
  const activeComarcas = activeUFData
    ? Object.entries(activeUFData.comarcas).sort((a, b) => b[1] - a[1]).slice(0, 6)
    : [];

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
      map[fase] = (map[fase] || 0) + 1;
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

  // Ranking Advogado Adverso
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

  // Unidades Organizacionais
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

  // Custom tooltip for charts
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

      {/* 1. KPI Cards — 3 cards (sem Arquivados) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <h3 className="text-sm font-semibold text-slate-500">Valor Total das Causas</h3>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-xl font-black text-slate-900 leading-tight">{formatCurrency(stats.valorTotal)}</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Comarcas Ranking + Mapa */}
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

        {/* Mapa de Processos Ativos por UF */}
        <Card className="rounded-xl shadow-sm border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-800">Mapa de Processos Ativos por UF</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* SVG Map */}
              <div className="flex-1 min-h-[380px] flex items-center justify-center bg-slate-50/50 rounded-lg p-2">
                <svg 
                  viewBox="20 30 370 390" 
                  className="w-full h-auto max-h-[380px]"
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.08))" }}
                >
                  {Object.entries(BRAZIL_STATES).map(([uf, data]) => {
                    const count = ufData[uf]?.count || 0;
                    const isActive = activeUF === uf;
                    return (
                      <g key={uf}>
                        <path
                          d={data.path}
                          fill={isActive ? "#D4A017" : getStateColor(count, maxUFCount)}
                          stroke="#9ca3af"
                          strokeWidth={isActive ? 1.8 : 0.7}
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={() => setHoveredUF(uf)}
                          onMouseLeave={() => setHoveredUF(null)}
                          onClick={() => setSelectedUF(prev => prev === uf ? null : uf)}
                        />
                        {count > 0 && (
                          <text 
                            x={data.cx} 
                            y={data.cy} 
                            textAnchor="middle" 
                            dominantBaseline="central" 
                            className="pointer-events-none select-none"
                            fill={isActive ? "#000" : "#4a5568"} 
                            fontSize="8" 
                            fontWeight="700"
                          >
                            {uf}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Info Panel */}
              <div className="w-full md:w-[200px] flex-shrink-0">
                {activeUF && activeUFData ? (
                  <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="font-black text-lg text-slate-900">{activeUF}</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Processos:</span>
                        <span className="text-sm font-black" style={{ color: ROYAL_BLUE }}>{activeUFData.count}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Valor Total:</span>
                        <span className="text-xs font-bold text-orange-600">{formatCurrency(activeUFData.valor)}</span>
                      </div>
                    </div>
                    {activeComarcas.length > 0 && (
                      <div className="border-t pt-2 space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Por Comarca</p>
                        {activeComarcas.map(([comarca, count]) => (
                          <div key={comarca} className="flex justify-between items-center">
                            <span className="text-[10px] font-semibold text-slate-600 uppercase truncate max-w-[120px]">{comarca}</span>
                            <span className="text-xs font-black text-slate-700">{count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-lg p-4 text-center">
                    <MapPin className="h-5 w-5 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-medium">Passe o mouse sobre um estado ou clique para ver detalhes</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Unidades Organizacionais (full width) */}
      <Card className="rounded-xl shadow-sm border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="h-5 w-5" style={{ color: ROYAL_BLUE }} /> Unidades Organizacionais com mais ações ajuizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
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
                  width={160}
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

      {/* 4. Processos por Fase + Distribuição por Tipo de Ação */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
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

      {/* 5. Ranking Advogado Adverso */}
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
