/**
 * Testes dos utilitários de data e texto.
 *
 * As datas trafegam como string justamente para não cair na interpretação
 * UTC de `new Date("AAAA-MM-DD")`, que em fuso negativo devolve o dia
 * anterior. Os casos abaixo travam esse comportamento.
 */

import { describe, expect, it } from "vitest";

import { aplicarMascaraData, dataNoFuturo, dataValida, formatarDataBR } from "@/src/utils/data";
import { normalizarTexto } from "@/src/utils/texto";

describe("dataValida", () => {
  it("aceita uma data existente", () => {
    expect(dataValida("2026-06-10")).toBe(true);
  });

  it("recusa dia inexistente no mês", () => {
    expect(dataValida("2026-02-31")).toBe(false);
  });

  it("recusa mês fora do intervalo", () => {
    expect(dataValida("2026-13-01")).toBe(false);
  });

  it("recusa formato diferente do ISO", () => {
    expect(dataValida("10/06/2026")).toBe(false);
    expect(dataValida("")).toBe(false);
  });

  it("aceita 29 de fevereiro em ano bissexto e recusa em ano comum", () => {
    expect(dataValida("2028-02-29")).toBe(true);
    expect(dataValida("2027-02-29")).toBe(false);
  });
});

describe("dataNoFuturo", () => {
  it("não considera futura uma data claramente passada", () => {
    expect(dataNoFuturo("2020-01-01")).toBe(false);
  });

  it("considera futura uma data distante", () => {
    expect(dataNoFuturo("2099-01-01")).toBe(true);
  });
});

describe("formatarDataBR", () => {
  it("converte ISO para o formato brasileiro sem deslocar o dia", () => {
    expect(formatarDataBR("2026-06-10")).toBe("10/06/2026");
    expect(formatarDataBR("2026-01-01")).toBe("01/01/2026");
  });

  it("devolve o valor original quando não é ISO", () => {
    expect(formatarDataBR("sem data")).toBe("sem data");
  });
});

describe("aplicarMascaraData", () => {
  it("insere os hifens conforme o usuário digita", () => {
    expect(aplicarMascaraData("2026")).toBe("2026");
    expect(aplicarMascaraData("202606")).toBe("2026-06");
    expect(aplicarMascaraData("20260610")).toBe("2026-06-10");
  });

  it("descarta caracteres não numéricos coladas pelo usuário", () => {
    expect(aplicarMascaraData("10/06/2026")).toBe("1006-20-26");
  });

  it("não deixa passar de oito dígitos", () => {
    expect(aplicarMascaraData("2026061012345")).toBe("2026-06-10");
  });
});

describe("normalizarTexto", () => {
  it("ignora acentuação e caixa na busca", () => {
    expect(normalizarTexto("Fernão Dias")).toBe(normalizarTexto("fernao dias"));
  });

  it("permite achar trecho com acento digitando sem acento", () => {
    expect(normalizarTexto("Erosão no talude").includes(normalizarTexto("erosao"))).toBe(true);
  });
});
