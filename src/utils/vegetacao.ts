/**
 * Regras de domínio da gestão de vegetação
 *
 * Concentra o que transforma uma medição bruta em decisão operacional:
 * qual é o alvo de corte do trecho, em que prioridade ele entra na fila
 * de roçada e qual ação está recomendada.
 */

import { rodovias } from "@/src/data/mockTrechos";
import type {
  AvaliacaoTrecho,
  CausaAlerta,
  Prioridade,
  RodoviaId,
  TipoArea,
  TipoIntervencao,
  Trecho,
} from "@/src/types";

/** Altura máxima tolerada no acostamento, em centímetros. */
const ALVO_ACOSTAMENTO_CM = 40;

/**
 * Alvo mais rigoroso para trechos cuja vegetação compromete a leitura da via.
 * Em curva de raio reduzido ou próximo a placas, 40 cm já obstrui: o corte
 * precisa acontecer antes.
 */
const ALVO_VISIBILIDADE_CM = 25;

/** Cobertura vegetal mínima do talude, em porcentagem — abaixo disso o solo expõe e erode. */
const ALVO_TALUDE_PCT = 50;

export const TIPO_AREA_LABEL: Record<TipoArea, string> = {
  acostamento: "Acostamento",
  talude: "Talude",
};

export const CAUSA_LABEL: Record<CausaAlerta, string> = {
  visibilidade: "Vegetação obstruindo sinalização/visibilidade",
  incendio: "Carga de vegetação seca — risco de incêndio",
  drenagem: "Vegetação obstruindo dispositivo de drenagem",
  erosao: "Cobertura vegetal insuficiente — risco de erosão",
};

export const CAUSA_ACAO: Record<CausaAlerta, string> = {
  visibilidade: "Roçada prioritária — trecho com placas de sinalização ou curva de raio reduzido.",
  incendio: "Roçada prioritária no período de estiagem para reduzir o material combustível.",
  drenagem: "Roçada e desobstrução de valeta/sarjeta antes do período chuvoso.",
  erosao: "Avaliar revegetação/hidrossemeadura para estabilização do talude.",
};

export const TIPO_INTERVENCAO_LABEL: Record<TipoIntervencao, string> = {
  rocada_mecanica: "Roçada mecânica",
  rocada_preventiva: "Roçada preventiva",
  hidrossemeadura: "Hidrossemeadura de contenção",
  desobstrucao_drenagem: "Roçada e desobstrução de valeta",
  monitoramento: "Monitoramento — sem intervenção",
};

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  critica: "Crítica",
  atencao: "Atenção",
  ok: "Regular",
};

/** Alvo do trecho, na unidade do seu tipo de área. */
export function alvoDoTrecho(trecho: Trecho): number {
  if (trecho.tipoArea === "talude") return ALVO_TALUDE_PCT;
  return trecho.causa === "visibilidade" ? ALVO_VISIBILIDADE_CM : ALVO_ACOSTAMENTO_CM;
}

/**
 * Classifica o trecho a partir da medição.
 *
 * O sentido da comparação se inverte conforme o tipo de área: no acostamento
 * o problema é vegetação alta demais; no talude, cobertura baixa demais.
 */
export function avaliarTrecho(trecho: Trecho): AvaliacaoTrecho {
  const alvo = alvoDoTrecho(trecho);
  const unidade = trecho.tipoArea === "talude" ? "%" : "cm";

  let prioridade: Prioridade;
  if (trecho.tipoArea === "acostamento") {
    if (trecho.medicao >= alvo) prioridade = "critica";
    else if (trecho.medicao >= alvo * 0.7) prioridade = "atencao";
    else prioridade = "ok";
  } else {
    if (trecho.medicao <= alvo) prioridade = "critica";
    else if (trecho.medicao <= alvo * 1.2) prioridade = "atencao";
    else prioridade = "ok";
  }

  return {
    prioridade,
    alvo,
    unidade,
    resumo: `${trecho.medicao}${unidade} · alvo ${alvo}${unidade}`,
  };
}

/** Ordena por urgência: críticos primeiro, depois atenção, depois regulares. */
const PESO: Record<Prioridade, number> = { critica: 0, atencao: 1, ok: 2 };

export function ordenarPorPrioridade(lista: Trecho[]): Trecho[] {
  return [...lista].sort((a, b) => {
    const diferenca = PESO[avaliarTrecho(a).prioridade] - PESO[avaliarTrecho(b).prioridade];
    if (diferenca !== 0) return diferenca;
    return a.id.localeCompare(b.id);
  });
}

/** Nome apresentável da rodovia, ex.: "Fernão Dias (BR-381)". */
export function nomeRodovia(id: RodoviaId): string {
  const rodovia = rodovias.find((item) => item.id === id);
  return rodovia ? `${rodovia.nome} (${rodovia.sigla})` : id;
}

/** Faixa de quilometragem em pt-BR, ex.: "km 73,7 – 80,3". */
export function formatarKm(trecho: Trecho): string {
  const formatar = (valor: number) => valor.toFixed(1).replace(".", ",");
  return `km ${formatar(trecho.kmInicial)} – ${formatar(trecho.kmFinal)}`;
}

/** Extensão do trecho em km, usada no cálculo de custo da roçada. */
export function extensaoKm(trecho: Trecho): number {
  return Number((trecho.kmFinal - trecho.kmInicial).toFixed(1));
}
