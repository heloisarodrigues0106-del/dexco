import { Processo } from "@/lib/types";

interface KPICardsProps {
  processos: Processo[];
}

export function KPICards({ processos }: KPICardsProps) {
  const totalProcessos = processos.length;
  const totalValorCausa = processos.reduce((sum, p) => sum + (p.valor_causa || 0), 0);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* 
        FRONTEND RULES COMPLIANCE:
        - Sharp Geometry: rounded-none
        - Borders: Hard borders instead of soft shadows
        - Colors: Primary (Azul Royal) emphasis
      */}
      <div className="bg-card border-l-4 border-l-primary border-t-2 border-r-2 border-b-2 border-border p-6 shadow-sm rounded-none hover:translate-y-[-2px] transition-transform duration-300">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Total Processos</h3>
        <p className="text-4xl font-black text-foreground">{totalProcessos}</p>
      </div>

      <div className="bg-card border-l-4 border-l-primary border-t-2 border-r-2 border-b-2 border-border p-6 shadow-sm rounded-none hover:translate-y-[-2px] transition-transform duration-300">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Valor da Causa Base</h3>
        <p className="text-2xl font-black text-foreground">{formatCurrency(totalValorCausa)}</p>
      </div>
    </div>
  );
}
