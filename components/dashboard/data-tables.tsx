import { Processo } from "@/lib/types";

interface DataTablesProps {
  processos: Processo[];
}

export function DataTables({ processos }: DataTablesProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  return (
    <div className="flex flex-col gap-10">
      
      {/* Processos Table */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-8 w-2 bg-primary"></div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Processos Em Curso</h2>
        </div>
        
        <div className="overflow-x-auto border-2 border-border p-1 bg-card rounded-none">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 border-b-2 border-border">
              <tr>
                <th className="px-4 py-4 font-black">Nº Processo</th>
                <th className="px-4 py-4 font-black">Reclamante</th>
                <th className="px-4 py-4 font-black">Vara/Comarca</th>
                <th className="px-4 py-4 font-black">Fase</th>
                <th className="px-4 py-4 font-black">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {processos.map((p) => (
                <tr key={p.numero_processo} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-4 py-3 font-mono text-xs">{p.numero_processo}</td>
                  <td className="px-4 py-3 font-bold group-hover:text-primary transition-colors">{p.nome_reclamante}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.vara} - {p.comarca}/{p.UF}</td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                      {p.fase_processo}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">{formatCurrency(p.valor_causa)}</td>
                </tr>
              ))}
              {processos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground uppercase font-bold tracking-widest text-xs">
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
