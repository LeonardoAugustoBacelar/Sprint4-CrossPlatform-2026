/**
 * AppContext
 * Estado global da aplicação.
 *
 * Responsável por consumir a camada de serviço (API simulada), expor o
 * resultado para as telas e manter os estados de carregamento e erro.
 * As telas não conhecem o serviço: falam apenas com este contexto.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import * as api from "@/src/services/trechosApi";
import type {
  AppContextType,
  CenarioMock,
  EstadoCarregamento,
  FormIntervencao,
  FormLeitura,
  Intervencao,
  Trecho,
} from "@/src/types";

const AppContext = createContext<AppContextType | undefined>(undefined);

function mensagemDeErro(erro: unknown): string {
  if (erro instanceof Error && erro.message) return erro.message;
  return "Ocorreu um erro inesperado. Tente novamente.";
}

/** Intervenções sempre da mais recente para a mais antiga. */
function ordenarPorData(lista: Intervencao[]): Intervencao[] {
  return [...lista].sort((a, b) => b.data.localeCompare(a.data));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trechos, setTrechos] = useState<Trecho[]>([]);
  const [intervencoes, setIntervencoes] = useState<Intervencao[]>([]);
  const [estado, setEstado] = useState<EstadoCarregamento>("carregando");
  const [erro, setErro] = useState<string | null>(null);
  const [cenario, setCenario] = useState<CenarioMock>(api.getCenario());

  const recarregar = useCallback(async () => {
    setEstado("carregando");
    setErro(null);
    try {
      // As duas listas chegam juntas: a tela de detalhe precisa das duas
      // para montar o histórico sem uma segunda espera.
      const [listaTrechos, listaIntervencoes] = await Promise.all([
        api.listarTrechos(),
        api.listarIntervencoes(),
      ]);
      setTrechos(listaTrechos);
      setIntervencoes(ordenarPorData(listaIntervencoes));
      setEstado("pronto");
    } catch (falha) {
      setTrechos([]);
      setIntervencoes([]);
      setErro(mensagemDeErro(falha));
      setEstado("erro");
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const trocarCenario = useCallback(
    async (novoCenario: CenarioMock) => {
      await api.definirCenario(novoCenario);
      setCenario(novoCenario);
      // Zera as listas para que o estado de carregamento apareca de fato
      // ao trocar de cenario (importante no cenario "lento").
      setTrechos([]);
      setIntervencoes([]);
      await recarregar();
    },
    [recarregar],
  );

  const getTrechoById = useCallback(
    (id: string) => trechos.find((item) => item.id === id),
    [trechos],
  );

  const intervencoesDoTrecho = useCallback(
    (trechoId: string) => intervencoes.filter((item) => item.trechoId === trechoId),
    [intervencoes],
  );

  const registrarLeitura = useCallback(async (trechoId: string, dados: FormLeitura) => {
    const atualizado = await api.registrarLeitura(trechoId, dados);
    setTrechos((anteriores) =>
      anteriores.map((item) => (item.id === trechoId ? atualizado : item)),
    );
  }, []);

  const addIntervencao = useCallback(async (dados: FormIntervencao) => {
    const nova = await api.criarIntervencao(dados);
    setIntervencoes((anteriores) => ordenarPorData([nova, ...anteriores]));
  }, []);

  const updateIntervencao = useCallback(async (id: number, dados: FormIntervencao) => {
    const atualizada = await api.atualizarIntervencao(id, dados);
    setIntervencoes((anteriores) =>
      ordenarPorData(anteriores.map((item) => (item.id === id ? atualizada : item))),
    );
  }, []);

  const deleteIntervencao = useCallback(async (id: number) => {
    await api.removerIntervencao(id);
    setIntervencoes((anteriores) => anteriores.filter((item) => item.id !== id));
  }, []);

  const value: AppContextType = {
    trechos,
    intervencoes,
    estado,
    erro,
    cenario,
    recarregar,
    trocarCenario,
    getTrechoById,
    registrarLeitura,
    intervencoesDoTrecho,
    addIntervencao,
    updateIntervencao,
    deleteIntervencao,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const contexto = useContext(AppContext);
  if (contexto === undefined) {
    throw new Error("useApp deve ser usado dentro de AppProvider");
  }
  return contexto;
}
