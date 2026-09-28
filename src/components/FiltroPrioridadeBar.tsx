/**
 * Componente FiltroPrioridadeBar
 * Chips de filtro por prioridade operacional, com a contagem de cada faixa.
 */

import { Pressable, ScrollView, Text, View } from "react-native";

import type { FiltroPrioridade } from "@/src/types";

interface FiltroPrioridadeBarProps {
  valor: FiltroPrioridade;
  contagens: Record<FiltroPrioridade, number>;
  onChange: (filtro: FiltroPrioridade) => void;
}

const OPCOES: { valor: FiltroPrioridade; label: string }[] = [
  { valor: "todas", label: "Todas" },
  { valor: "critica", label: "Crítica" },
  { valor: "atencao", label: "Atenção" },
  { valor: "ok", label: "Regular" },
];

export function FiltroPrioridadeBar({ valor, contagens, onChange }: FiltroPrioridadeBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
    >
      {OPCOES.map((opcao) => {
        const ativo = valor === opcao.valor;
        return (
          <Pressable
            key={opcao.valor}
            onPress={() => onChange(opcao.valor)}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar por prioridade ${opcao.label}`}
            accessibilityState={{ selected: ativo }}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View
              className={
                ativo
                  ? "px-3 py-2 rounded-full border border-primary bg-primary flex-row items-center gap-1"
                  : "px-3 py-2 rounded-full border border-border bg-surface flex-row items-center gap-1"
              }
            >
              <Text
                className={
                  ativo
                    ? "text-white text-sm font-semibold"
                    : "text-foreground text-sm font-semibold"
                }
              >
                {opcao.label}
              </Text>
              <Text className={ativo ? "text-white text-xs" : "text-muted text-xs"}>
                ({contagens[opcao.valor] ?? 0})
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
