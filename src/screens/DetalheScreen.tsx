/**
 * Tela Detalhe — Trecho monitorado
 *
 * Mostra o estado atual da vegetação no trecho, o que a regra de negócio
 * recomenda fazer e o histórico de intervenções já executadas ali.
 * Concentra as ações: atualizar a leitura e manter o histórico.
 */

import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AvisoErro } from "@/src/components/AvisoErro";
import { Button } from "@/src/components/Button";
import { ConfirmDialog } from "@/src/components/ConfirmDialog";
import { EstadoMensagem } from "@/src/components/EstadoMensagem";
import { PrioridadeBadge } from "@/src/components/PrioridadeBadge";
import { TipoAreaBadge } from "@/src/components/TipoAreaBadge";
import { useApp } from "@/src/context/AppContext";
import type { Intervencao } from "@/src/types";
import { formatarDataBR } from "@/src/utils/data";
import {
  avaliarTrecho,
  CAUSA_ACAO,
  CAUSA_LABEL,
  extensaoKm,
  formatarKm,
  nomeRodovia,
  TIPO_INTERVENCAO_LABEL,
} from "@/src/utils/vegetacao";

interface DetalheScreenProps {
  id: string;
  onVoltar: () => void;
  onAtualizarLeitura: () => void;
  onNovaIntervencao: () => void;
  onEditarIntervencao: (intervencaoId: number) => void;
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <View className="mb-4 pb-4 border-b border-border">
      <Text className="text-muted text-xs uppercase tracking-wide mb-1">{rotulo}</Text>
      {children}
    </View>
  );
}

export function DetalheScreen({
  id,
  onVoltar,
  onAtualizarLeitura,
  onNovaIntervencao,
  onEditarIntervencao,
}: DetalheScreenProps) {
  const { getTrechoById, intervencoesDoTrecho, deleteIntervencao } = useApp();
  const trecho = getTrechoById(id);

  const [aExcluir, setAExcluir] = useState<Intervencao | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  if (!trecho) {
    return (
      <ScreenContainer className="p-4">
        <EstadoMensagem
          icone="🔎"
          titulo="Trecho não encontrado"
          descricao="O registro pode ter sido removido da base."
          acaoTitulo="Voltar para a lista"
          onAcao={onVoltar}
        />
      </ScreenContainer>
    );
  }

  const avaliacao = avaliarTrecho(trecho);
  const historico = intervencoesDoTrecho(trecho.id);

  const handleExcluir = async () => {
    if (!aExcluir) return;
    setExcluindo(true);
    setErroAcao(null);
    try {
      await deleteIntervencao(aExcluir.id);
      setAExcluir(null);
    } catch (falha) {
      setAExcluir(null);
      setErroAcao(
        falha instanceof Error && falha.message
          ? falha.message
          : "Não foi possível excluir a intervenção.",
      );
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6 flex-row items-center">
          <Pressable
            onPress={onVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
            style={({ pressed }) => ({ marginRight: 12, opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-primary text-2xl font-semibold">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Trecho {trecho.id}</Text>
        </View>

        {erroAcao ? <AvisoErro mensagem={erroAcao} /> : null}

        <View className="bg-surface rounded-lg p-4 border border-border mb-6">
          <Campo rotulo="Rodovia">
            <Text className="text-foreground text-base">{nomeRodovia(trecho.rodoviaId)}</Text>
          </Campo>

          <Campo rotulo="Localização">
            <Text className="text-foreground text-base">
              📍 {formatarKm(trecho)} · {extensaoKm(trecho)} km de extensão
            </Text>
            <Text className="text-muted text-xs mt-1">
              {trecho.latitude.toFixed(5)}, {trecho.longitude.toFixed(5)}
            </Text>
          </Campo>

          <Campo rotulo="Tipo de área">
            <TipoAreaBadge tipoArea={trecho.tipoArea} size="md" />
            <Text className="text-muted text-xs mt-2">
              {trecho.tipoArea === "acostamento"
                ? "Medição por altura da vegetação — quanto mais alta, maior o risco."
                : "Medição por cobertura vegetal do solo — quanto menor, maior o risco de erosão."}
            </Text>
          </Campo>

          <Campo rotulo="Última leitura">
            <Text className="text-foreground text-2xl font-bold">
              {trecho.medicao}
              {avaliacao.unidade}
            </Text>
            <Text className="text-muted text-sm mt-1">
              Alvo do trecho: {avaliacao.alvo}
              {avaliacao.unidade} · medido em {formatarDataBR(trecho.dataMedicao)}
            </Text>
          </Campo>

          <Campo rotulo="Prioridade">
            <PrioridadeBadge prioridade={avaliacao.prioridade} size="lg" />
          </Campo>

          <View>
            <Text className="text-muted text-xs uppercase tracking-wide mb-1">
              Causa do alerta
            </Text>
            {trecho.causa ? (
              <>
                <Text className="text-foreground text-base leading-relaxed">
                  {CAUSA_LABEL[trecho.causa]}
                </Text>
                <Text className="text-muted text-sm mt-2 leading-relaxed">
                  {CAUSA_ACAO[trecho.causa]}
                </Text>
              </>
            ) : (
              <Text className="text-muted text-base">
                Sem alerta registrado — trecho em acompanhamento de rotina.
              </Text>
            )}
          </View>
        </View>

        <View className="gap-3 mb-6">
          <Button title="Atualizar leitura" onPress={onAtualizarLeitura} variant="primary" />
          <Button title="Registrar intervenção" onPress={onNovaIntervencao} variant="secondary" />
        </View>

        <Text className="text-xl font-bold text-foreground mb-1">Histórico de intervenções</Text>
        <Text className="text-muted text-sm mb-3">
          {historico.length === 0
            ? "Nenhuma intervenção registrada neste trecho."
            : `${historico.length} ${historico.length === 1 ? "registro" : "registros"}`}
        </Text>

        <View className="mb-8">
          {historico.map((intervencao) => (
            <View
              key={intervencao.id}
              className="bg-surface rounded-lg p-4 mb-3 border border-border"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-foreground font-semibold text-base">
                  {TIPO_INTERVENCAO_LABEL[intervencao.tipo]}
                </Text>
                <Text className="text-muted text-xs">{formatarDataBR(intervencao.data)}</Text>
              </View>

              <Text className="text-muted text-sm mb-2 leading-relaxed">{intervencao.motivo}</Text>
              <Text className="text-foreground text-sm font-semibold mb-3">
                Resultado: {intervencao.resultado}
              </Text>

              <View className="flex-row gap-4">
                <Pressable
                  onPress={() => onEditarIntervencao(intervencao.id)}
                  accessibilityRole="button"
                  accessibilityLabel="Editar intervenção"
                  hitSlop={8}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text className="text-primary text-sm font-semibold">Editar</Text>
                </Pressable>
                <Pressable
                  onPress={() => setAExcluir(intervencao)}
                  accessibilityRole="button"
                  accessibilityLabel="Excluir intervenção"
                  hitSlop={8}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text className="text-error text-sm font-semibold">Excluir</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <ConfirmDialog
        visivel={aExcluir !== null}
        titulo="Excluir intervenção"
        mensagem="Esta ação não pode ser desfeita. Deseja realmente excluir este registro do histórico?"
        textoConfirmar="Excluir"
        carregando={excluindo}
        onConfirmar={handleExcluir}
        onCancelar={() => setAExcluir(null)}
      />
    </ScreenContainer>
  );
}
