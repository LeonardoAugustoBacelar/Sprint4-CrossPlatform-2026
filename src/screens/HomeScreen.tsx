/**
 * Tela Home — Trechos monitorados
 *
 * Concentra os estados da listagem: carregando, erro, base vazia,
 * busca sem resultado e lista preenchida. Os trechos chegam ordenados
 * por prioridade, para que a fila de roçada apareça de cima para baixo.
 */

import { useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { CampoBusca } from "@/src/components/CampoBusca";
import { EstadoMensagem } from "@/src/components/EstadoMensagem";
import { FiltroPrioridadeBar } from "@/src/components/FiltroPrioridadeBar";
import { SeletorCenario } from "@/src/components/SeletorCenario";
import { SeletorRodovia } from "@/src/components/SeletorRodovia";
import { TrechoCard } from "@/src/components/TrechoCard";
import { useApp } from "@/src/context/AppContext";
import type { FiltroPrioridade, FiltroRodovia } from "@/src/types";
import { normalizarTexto } from "@/src/utils/texto";
import {
  avaliarTrecho,
  CAUSA_LABEL,
  formatarKm,
  nomeRodovia,
  ordenarPorPrioridade,
} from "@/src/utils/vegetacao";

interface HomeScreenProps {
  onSelecionarTrecho: (id: string) => void;
}

export function HomeScreen({ onSelecionarTrecho }: HomeScreenProps) {
  const { trechos, estado, erro, cenario, recarregar, trocarCenario } = useApp();
  const cores = useColors();

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroPrioridade>("todas");
  const [rodovia, setRodovia] = useState<FiltroRodovia>("todas");

  // A rodovia selecionada é o recorte de base: contagens e filtros de
  // prioridade se referem sempre à malha que está sendo olhada.
  const daRodovia = useMemo(
    () => (rodovia === "todas" ? trechos : trechos.filter((item) => item.rodoviaId === rodovia)),
    [trechos, rodovia],
  );

  const contagens = useMemo<Record<FiltroPrioridade, number>>(() => {
    const prioridades = daRodovia.map((item) => avaliarTrecho(item).prioridade);
    return {
      todas: daRodovia.length,
      critica: prioridades.filter((p) => p === "critica").length,
      atencao: prioridades.filter((p) => p === "atencao").length,
      ok: prioridades.filter((p) => p === "ok").length,
    };
  }, [daRodovia]);

  const filtrados = useMemo(() => {
    const termo = normalizarTexto(busca);
    const lista = daRodovia.filter((item) => {
      const atendePrioridade = filtro === "todas" || avaliarTrecho(item).prioridade === filtro;
      const alvoDeBusca = [
        item.id,
        nomeRodovia(item.rodoviaId),
        formatarKm(item),
        item.causa ? CAUSA_LABEL[item.causa] : "",
      ].join(" ");
      const atendeBusca = termo.length === 0 || normalizarTexto(alvoDeBusca).includes(termo);
      return atendePrioridade && atendeBusca;
    });
    return ordenarPorPrioridade(lista);
  }, [daRodovia, busca, filtro]);

  const carregandoInicial = estado === "carregando" && trechos.length === 0;
  const listaDisponivel = estado === "pronto" && trechos.length > 0;

  const limparFiltros = () => {
    setBusca("");
    setFiltro("todas");
    setRodovia("todas");
  };

  const subtitulo = () => {
    if (carregandoInicial) return "Carregando trechos...";
    if (estado === "erro") return "Não foi possível carregar os dados";
    if (trechos.length === 0) return "Nenhum trecho monitorado";
    const criticos = contagens.critica;
    const total = daRodovia.length;
    return `${total} ${total === 1 ? "trecho" : "trechos"} · ${criticos} em prioridade crítica`;
  };

  const conteudo = () => {
    if (carregandoInicial) {
      return (
        <EstadoMensagem
          carregando
          titulo="Carregando trechos"
          descricao="Consultando a base de monitoramento."
        />
      );
    }

    if (estado === "erro") {
      return (
        <EstadoMensagem
          icone="⚠️"
          titulo="Falha ao carregar os trechos"
          descricao={erro ?? undefined}
          acaoTitulo="Tentar novamente"
          onAcao={recarregar}
        />
      );
    }

    if (trechos.length === 0) {
      return (
        <EstadoMensagem
          icone="🌱"
          titulo="Nenhum trecho monitorado"
          descricao="Assim que a malha for cadastrada, os trechos aparecem aqui ordenados por prioridade."
          acaoTitulo="Recarregar"
          onAcao={recarregar}
        />
      );
    }

    if (filtrados.length === 0) {
      return (
        <EstadoMensagem
          icone="🔍"
          titulo="Nenhum resultado encontrado"
          descricao="Nenhum trecho corresponde à busca ou aos filtros selecionados."
          acaoTitulo="Limpar filtros"
          onAcao={limparFiltros}
        />
      );
    }

    return (
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrechoCard trecho={item} onPress={() => onSelecionarTrecho(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={estado === "carregando"}
            onRefresh={recarregar}
            tintColor={cores.primary}
            colors={[cores.primary]}
          />
        }
      />
    );
  };

  return (
    <ScreenContainer className="p-4">
      <View className="mb-4">
        <Text className="text-3xl font-bold text-foreground">Faixa de domínio</Text>
        <Text className="text-muted text-sm mt-1">{subtitulo()}</Text>
      </View>

      <SeletorCenario
        cenario={cenario}
        onTrocar={trocarCenario}
        desabilitado={estado === "carregando"}
      />

      {listaDisponivel ? (
        <View className="mb-3">
          <SeletorRodovia valor={rodovia} onChange={setRodovia} />
          <View className="mt-3">
            <CampoBusca valor={busca} onChange={setBusca} />
          </View>
          <View className="mt-3">
            <FiltroPrioridadeBar valor={filtro} contagens={contagens} onChange={setFiltro} />
          </View>
        </View>
      ) : null}

      <View className="flex-1">{conteudo()}</View>
    </ScreenContainer>
  );
}
