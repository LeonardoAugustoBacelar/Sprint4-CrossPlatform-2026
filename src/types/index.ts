/**
 * Modelagem de domínio — gestão de vegetação na faixa de domínio
 *
 * O produto monitora TRECHOS de rodovia e registra as INTERVENÇÕES
 * (roçada, hidrossemeadura, desobstrução) executadas sobre eles.
 */

/** Rodovias concessionadas atendidas pelo piloto */
export type RodoviaId = "fernaodias" | "autoban" | "parana";

export type Rodovia = {
  id: RodoviaId;
  nome: string;
  sigla: string;
  kmTotal: number;
  /** Como a vegetação é medida nessa malha (usado no texto de apoio) */
  contexto: string;
};

/**
 * Tipo de área monitorada dentro da faixa de domínio.
 * A unidade da medição muda conforme o tipo:
 * - acostamento: altura da vegetação, em centímetros (quanto MAIOR, pior)
 * - talude: cobertura vegetal do solo, em porcentagem (quanto MENOR, pior)
 */
export type TipoArea = "acostamento" | "talude";

/** Motivo pelo qual o trecho entra na fila de roçada */
export type CausaAlerta = "visibilidade" | "incendio" | "drenagem" | "erosao";

/** Prioridade operacional, derivada da medição e do alvo do trecho */
export type Prioridade = "critica" | "atencao" | "ok";

/** Trecho monitorado da faixa de domínio */
export type Trecho = {
  /** Código operacional do trecho, ex.: "TR-12" */
  id: string;
  rodoviaId: RodoviaId;
  kmInicial: number;
  kmFinal: number;
  tipoArea: TipoArea;
  /** Altura em cm (acostamento) ou cobertura em % (talude) */
  medicao: number;
  /** Data da última leitura (ISO: AAAA-MM-DD) */
  dataMedicao: string;
  /** Motivo do alerta; nulo quando o trecho só é acompanhado */
  causa: CausaAlerta | null;
  latitude: number;
  longitude: number;
};

/** Natureza do serviço executado em campo */
export type TipoIntervencao =
  | "rocada_mecanica"
  | "rocada_preventiva"
  | "hidrossemeadura"
  | "desobstrucao_drenagem"
  | "monitoramento";

/** Serviço executado (ou dispensado) sobre um trecho */
export type Intervencao = {
  id: number;
  trechoId: string;
  /** Data da execução (ISO: AAAA-MM-DD) */
  data: string;
  tipo: TipoIntervencao;
  /** O que motivou a ida a campo */
  motivo: string;
  /** Efeito medido, ex.: "62 cm → 9 cm" */
  resultado: string;
};

/** Campos editáveis de uma intervenção (cadastro e edição) */
export type FormIntervencao = Omit<Intervencao, "id">;

/** Campos editáveis de uma leitura de trecho */
export type FormLeitura = Pick<Trecho, "medicao" | "dataMedicao" | "causa">;

/** Avaliação derivada de um trecho — não é persistida, é calculada */
export type AvaliacaoTrecho = {
  prioridade: Prioridade;
  /** Limite aceitável para a medição, na unidade do tipo de área */
  alvo: number;
  unidade: "cm" | "%";
  /** Texto curto do estado, ex.: "62 cm · alvo 25 cm" */
  resumo: string;
};

/** Valor do filtro de prioridade na listagem */
export type FiltroPrioridade = Prioridade | "todas";

/** Valor do filtro de rodovia na listagem */
export type FiltroRodovia = RodoviaId | "todas";

/**
 * Cenário simulado pela camada de mock.
 * Permite demonstrar todos os estados da aplicação sem backend real.
 */
export type CenarioMock = "sucesso" | "vazio" | "erro" | "lento";

/** Estado de carregamento da listagem */
export type EstadoCarregamento = "carregando" | "pronto" | "erro";

/** Contrato do contexto global da aplicação */
export type AppContextType = {
  trechos: Trecho[];
  intervencoes: Intervencao[];
  estado: EstadoCarregamento;
  erro: string | null;
  cenario: CenarioMock;
  recarregar: () => Promise<void>;
  trocarCenario: (cenario: CenarioMock) => Promise<void>;
  getTrechoById: (id: string) => Trecho | undefined;
  registrarLeitura: (trechoId: string, dados: FormLeitura) => Promise<void>;
  intervencoesDoTrecho: (trechoId: string) => Intervencao[];
  addIntervencao: (dados: FormIntervencao) => Promise<void>;
  updateIntervencao: (id: number, dados: FormIntervencao) => Promise<void>;
  deleteIntervencao: (id: number) => Promise<void>;
};
