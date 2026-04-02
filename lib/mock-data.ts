import { Processo, Acordo } from "./types";

export const mockProcessos: Processo[] = [
  {
    numero_processo: "0001234-56.2024.5.15.0001",
    nome_reclamante: "João da Silva",
    comarca: "Campinas",
    vara: "1ª Vara do Trabalho de Campinas",
    data_ajuizamento: "2024-01-15",
    fase_processo: "Conhecimento",
    advogado_reclamante: "Dra. Maria Oliveira",
    tipo_acao: "Reclamação Trabalhista",
    reclamada: "DEXCO S.A.",
    unidade_organizacional: "Unidade Campinas",
    valor_causa: 50000.00,
    UF: "SP",
  },
  {
    numero_processo: "0009876-54.2023.5.02.0012",
    nome_reclamante: "Ana Costa",
    comarca: "São Paulo",
    vara: "12ª Vara do Trabalho de São Paulo",
    data_ajuizamento: "2023-11-20",
    fase_processo: "Execução",
    advogado_reclamante: "Dr. Pedro Santos",
    tipo_acao: "Indenização por Danos Morais",
    reclamada: "DEXCO S.A.",
    unidade_organizacional: "Sede Corporativa",
    valor_causa: 120000.00,
    UF: "SP",
  },
  {
    numero_processo: "0004567-89.2024.5.04.0005",
    nome_reclamante: "Carlos Souza",
    comarca: "Porto Alegre",
    vara: "5ª Vara do Trabalho de Porto Alegre",
    data_ajuizamento: "2024-02-10",
    fase_processo: "Conhecimento",
    advogado_reclamante: "Dr. Lucas Lima",
    tipo_acao: "Reclamação Trabalhista",
    reclamada: "DEXCO S.A.",
    unidade_organizacional: "Unidade Sul",
    valor_causa: 35000.00,
    UF: "RS",
  },
  {
    numero_processo: "0002222-33.2023.5.03.0010",
    nome_reclamante: "Fernanda Lima",
    comarca: "Belo Horizonte",
    vara: "10ª Vara do Trabalho de Belo Horizonte",
    data_ajuizamento: "2023-08-05",
    fase_processo: "Recursal",
    advogado_reclamante: "Dra. Juliana Pereira",
    tipo_acao: "Reclamação Trabalhista",
    reclamada: "DEXCO S.A.",
    unidade_organizacional: "Unidade Minas",
    valor_causa: 85000.00,
    UF: "MG",
  },
  {
    numero_processo: "0005555-44.2024.5.01.0008",
    nome_reclamante: "Roberto Alves",
    comarca: "Rio de Janeiro",
    vara: "8ª Vara do Trabalho do Rio de Janeiro",
    data_ajuizamento: "2024-03-01",
    fase_processo: "Conhecimento",
    advogado_reclamante: "Dr. Fernando Mendes",
    tipo_acao: "Reclamação Trabalhista",
    reclamada: "DEXCO S.A.",
    unidade_organizacional: "Unidade Rio",
    valor_causa: 42000.00,
    UF: "RJ",
  }
];

export const mockAcordos: Acordo[] = [
  {
    numero_processo: "0009876-54.2023.5.02.0012",
    TRT: "TRT-02",
    valor_causa: 120000.00,
    valor_acordo: 40000.00,
    saving: 80000.00
  },
  {
    numero_processo: "0002222-33.2023.5.03.0010",
    TRT: "TRT-03",
    valor_causa: 85000.00,
    valor_acordo: 50000.00,
    saving: 35000.00
  }
];
