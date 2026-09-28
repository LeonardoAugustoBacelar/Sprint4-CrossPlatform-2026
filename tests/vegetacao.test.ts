/**
 * Testes das regras de domínio da gestão de vegetação.
 *
 * O que se garante aqui é a inversão do critério entre os dois tipos de
 * área — no acostamento o risco cresce com a altura, no talude cresce com
 * a FALTA de cobertura — e o alvo mais rigoroso dos trechos de visibilidade.
 */

import { describe, expect, it } from "vitest";

import type { Trecho } from "@/src/types";
import { alvoDoTrecho, avaliarTrecho, extensaoKm, formatarKm } from "@/src/utils/vegetacao";

function trecho(parcial: Partial<Trecho> = {}): Trecho {
  return {
    id: "TR-99",
    rodoviaId: "fernaodias",
    kmInicial: 10,
    kmFinal: 16.7,
    tipoArea: "acostamento",
    medicao: 12,
    dataMedicao: "2026-09-20",
    causa: null,
    latitude: -23.4,
    longitude: -46.5,
    ...parcial,
  };
}

describe("alvoDoTrecho", () => {
  it("usa 40 cm como alvo padrão do acostamento", () => {
    expect(alvoDoTrecho(trecho())).toBe(40);
  });

  it("endurece o alvo para 25 cm quando a causa é visibilidade", () => {
    expect(alvoDoTrecho(trecho({ causa: "visibilidade" }))).toBe(25);
  });

  it("usa 50% de cobertura como alvo do talude, independente da causa", () => {
    expect(alvoDoTrecho(trecho({ tipoArea: "talude", causa: "erosao" }))).toBe(50);
  });
});

describe("avaliarTrecho — acostamento", () => {
  it("classifica como crítica quando a altura atinge o alvo", () => {
    expect(avaliarTrecho(trecho({ medicao: 40 })).prioridade).toBe("critica");
  });

  it("classifica como atenção a partir de 70% do alvo", () => {
    expect(avaliarTrecho(trecho({ medicao: 28 })).prioridade).toBe("atencao");
  });

  it("classifica como regular bem abaixo do alvo", () => {
    expect(avaliarTrecho(trecho({ medicao: 12 })).prioridade).toBe("ok");
  });

  it("torna crítica uma altura que seria apenas atenção sem o alerta de visibilidade", () => {
    expect(avaliarTrecho(trecho({ medicao: 30 })).prioridade).toBe("atencao");
    expect(avaliarTrecho(trecho({ medicao: 30, causa: "visibilidade" })).prioridade).toBe(
      "critica",
    );
  });
});

describe("avaliarTrecho — talude", () => {
  const talude = (medicao: number) => trecho({ tipoArea: "talude", medicao });

  it("classifica como crítica quando a cobertura cai até o alvo", () => {
    expect(avaliarTrecho(talude(50)).prioridade).toBe("critica");
  });

  it("classifica como atenção até 20% acima do alvo", () => {
    expect(avaliarTrecho(talude(58)).prioridade).toBe("atencao");
  });

  it("classifica como regular com cobertura alta", () => {
    expect(avaliarTrecho(talude(78)).prioridade).toBe("ok");
  });

  it("usa porcentagem como unidade, não centímetros", () => {
    expect(avaliarTrecho(talude(70)).unidade).toBe("%");
    expect(avaliarTrecho(trecho()).unidade).toBe("cm");
  });
});

describe("apresentação do trecho", () => {
  it("formata a quilometragem em pt-BR", () => {
    expect(formatarKm(trecho({ kmInicial: 73.7, kmFinal: 80.3 }))).toBe("km 73,7 – 80,3");
  });

  it("calcula a extensão do trecho sem ruído de ponto flutuante", () => {
    expect(extensaoKm(trecho({ kmInicial: 20.1, kmFinal: 26.8 }))).toBe(6.7);
  });
});
