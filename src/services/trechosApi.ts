/**
 * Camada de mock de dados (API simulada)
 *
 * Toda a aplicação conversa com este módulo como se fosse um backend real:
 * as funções são assíncronas, têm latência e podem falhar. Quando a API
 * verdadeira existir, basta trocar o corpo destas funções por chamadas HTTP —
 * nenhuma tela precisa ser alterada.
 *
 * Novidade da Sprint 4: o que é gravado sobrevive ao fechamento do app.
 * O estado da base é espelhado no AsyncStorage a cada escrita; a simulação
 * de cenários continua idêntica à Sprint 3.
 *
 * O cenário ativo controla o comportamento simulado:
 * - sucesso: resposta normal (~600ms)
 * - vazio:   base sem registros, para exercitar o estado de lista vazia
 * - erro:    toda operação falha, para exercitar o estado de erro
 * - lento:   resposta em ~2,5s, para exercitar o estado de carregamento
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockIntervencoes, mockTrechos } from "@/src/data/mockTrechos";
import type {
  CenarioMock,
  FormIntervencao,
  FormLeitura,
  Intervencao,
  Trecho,
} from "@/src/types";

/** Erro devolvido pela API simulada */
export class ErroApi extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErroApi";
  }
}

const ATRASOS: Record<CenarioMock, number> = {
  sucesso: 600,
  vazio: 500,
  erro: 800,
  lento: 2500,
};

const MENSAGEM_FALHA_REDE =
  "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";

const CHAVE_TRECHOS = "motiva:trechos";
const CHAVE_INTERVENCOES = "motiva:intervencoes";

let cenarioAtual: CenarioMock = "sucesso";
let trechos: Trecho[] = clonar(mockTrechos);
let intervencoes: Intervencao[] = clonar(mockIntervencoes);
let bancoCarregado = false;

function clonar<T>(lista: T[]): T[] {
  return lista.map((item) => ({ ...item }));
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Lê a base gravada no dispositivo. Na primeira execução não há nada
 * gravado: a base de exemplo é usada como semente e persistida.
 */
async function carregarDoDisco(): Promise<void> {
  if (bancoCarregado) return;
  try {
    const [gravadoTrechos, gravadoIntervencoes] = await AsyncStorage.multiGet([
      CHAVE_TRECHOS,
      CHAVE_INTERVENCOES,
    ]);
    if (gravadoTrechos[1] && gravadoIntervencoes[1]) {
      trechos = JSON.parse(gravadoTrechos[1]) as Trecho[];
      intervencoes = JSON.parse(gravadoIntervencoes[1]) as Intervencao[];
    } else {
      await persistir();
    }
  } catch {
    // Falha de leitura não pode derrubar o app: seguimos com a base em memória.
  }
  bancoCarregado = true;
}

/** Espelha a base no dispositivo. O cenário "vazio" não grava, para não apagar os dados reais. */
async function persistir(): Promise<void> {
  if (cenarioAtual === "vazio") return;
  try {
    await AsyncStorage.multiSet([
      [CHAVE_TRECHOS, JSON.stringify(trechos)],
      [CHAVE_INTERVENCOES, JSON.stringify(intervencoes)],
    ]);
  } catch {
    // Sem espaço ou sem permissão: a sessão continua funcionando em memória.
  }
}

/** Aplica latência e, no cenário de erro, derruba a requisição */
async function simularRede(): Promise<void> {
  await esperar(ATRASOS[cenarioAtual]);
  if (cenarioAtual === "erro") {
    throw new ErroApi(MENSAGEM_FALHA_REDE);
  }
}

function proximoId(): number {
  return intervencoes.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
}

/** Cenário ativo no momento */
export function getCenario(): CenarioMock {
  return cenarioAtual;
}

/**
 * Troca o cenário simulado.
 * "vazio" esvazia a base apenas em memória; os demais recarregam o que está gravado.
 */
export async function definirCenario(cenario: CenarioMock): Promise<void> {
  cenarioAtual = cenario;
  if (cenario === "vazio") {
    trechos = [];
    intervencoes = [];
    return;
  }
  bancoCarregado = false;
  await carregarDoDisco();
}

/** Devolve a base de exemplo ao estado original — usado para reiniciar uma demonstração. */
export async function restaurarBasePadrao(): Promise<void> {
  trechos = clonar(mockTrechos);
  intervencoes = clonar(mockIntervencoes);
  bancoCarregado = true;
  await persistir();
}

/** GET /trechos */
export async function listarTrechos(): Promise<Trecho[]> {
  await carregarDoDisco();
  await simularRede();
  return clonar(trechos);
}

/** GET /intervencoes */
export async function listarIntervencoes(): Promise<Intervencao[]> {
  await carregarDoDisco();
  await simularRede();
  return clonar(intervencoes);
}

/** PATCH /trechos/:id/leitura — registra uma nova medição de vegetação */
export async function registrarLeitura(id: string, dados: FormLeitura): Promise<Trecho> {
  await simularRede();
  const indice = trechos.findIndex((item) => item.id === id);
  if (indice === -1) {
    throw new ErroApi("Trecho não encontrado.");
  }
  const atualizado: Trecho = { ...trechos[indice], ...dados };
  trechos = trechos.map((item) => (item.id === id ? atualizado : item));
  await persistir();
  return { ...atualizado };
}

/** POST /intervencoes */
export async function criarIntervencao(dados: FormIntervencao): Promise<Intervencao> {
  await simularRede();
  const nova: Intervencao = { ...dados, id: proximoId() };
  intervencoes = [nova, ...intervencoes];
  await persistir();
  return { ...nova };
}

/** PUT /intervencoes/:id */
export async function atualizarIntervencao(
  id: number,
  dados: FormIntervencao,
): Promise<Intervencao> {
  await simularRede();
  const indice = intervencoes.findIndex((item) => item.id === id);
  if (indice === -1) {
    throw new ErroApi("Intervenção não encontrada.");
  }
  const atualizada: Intervencao = { ...intervencoes[indice], ...dados };
  intervencoes = intervencoes.map((item) => (item.id === id ? atualizada : item));
  await persistir();
  return { ...atualizada };
}

/** DELETE /intervencoes/:id */
export async function removerIntervencao(id: number): Promise<void> {
  await simularRede();
  const existe = intervencoes.some((item) => item.id === id);
  if (!existe) {
    throw new ErroApi("Intervenção não encontrada.");
  }
  intervencoes = intervencoes.filter((item) => item.id !== id);
  await persistir();
}
