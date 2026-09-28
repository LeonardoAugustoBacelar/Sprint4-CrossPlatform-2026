/**
 * Componente TrechoCard
 * Resumo de um trecho monitorado na listagem: onde fica, como está a
 * vegetação hoje e em que prioridade de roçada ele entrou.
 */

import { Pressable, Text, View } from "react-native";

import type { Trecho } from "@/src/types";
import { avaliarTrecho, CAUSA_LABEL, formatarKm, nomeRodovia } from "@/src/utils/vegetacao";

import { PrioridadeBadge } from "./PrioridadeBadge";
import { TipoAreaBadge } from "./TipoAreaBadge";

interface TrechoCardProps {
  trecho: Trecho;
  onPress: () => void;
}

export function TrechoCard({ trecho, onPress }: TrechoCardProps) {
  const avaliacao = avaliarTrecho(trecho);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Trecho ${trecho.id}, prioridade ${avaliacao.prioridade}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-foreground font-bold text-base">{trecho.id}</Text>
          <PrioridadeBadge prioridade={avaliacao.prioridade} size="sm" />
        </View>

        <Text className="text-muted text-sm mb-1" numberOfLines={1}>
          {nomeRodovia(trecho.rodoviaId)}
        </Text>

        <Text className="text-muted text-sm mb-3">📍 {formatarKm(trecho)}</Text>

        {trecho.causa ? (
          <Text className="text-foreground text-sm mb-3 leading-relaxed" numberOfLines={2}>
            {CAUSA_LABEL[trecho.causa]}
          </Text>
        ) : null}

        <View className="flex-row items-center justify-between">
          <TipoAreaBadge tipoArea={trecho.tipoArea} size="sm" />
          <Text className="text-foreground text-sm font-semibold">{avaliacao.resumo}</Text>
        </View>
      </View>
    </Pressable>
  );
}
