export interface Processo {
  numero_processo: string;
  nome_reclamante: string;
  comarca: string;
  vara: string;
  data_ajuizamento: string;
  fase_processo: string;
  fase_processual?: string;
  advogado_reclamante: string;
  tipo_acao: string;
  reclamada: string;
  unidade_organizacional: string;
  valor_causa: number;
  UF: string;
  status?: string;
  status_processo?: string;
  provisionamento?: string;
}

export interface Acordo {
  numero_processo: string;
  TRT: string;
  valor_causa: number;
  valor_acordo: number;
  saving: number;
}
