/**
 * Componente PrioridadeBadge
 * Exibe a prioridade operacional do trecho com a cor correspondente.
 * As cores são resolvidas por tema (claro/escuro) para manter contraste.
 */

import { Text, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Prioridade } from "@/src/types";

type Par = { fundo: string; texto: string };

const CORES: Record<Prioridade, { label: string; light: Par; dark: Par }> = {
  ok: {
    label: "Regular",
    light: { fundo: "#DCFCE7", texto: "#166534" },
    dark: { fundo: "#14532D", texto: "#BBF7D0" },
  },
  atencao: {
    label: "Atenção",
    light: { fundo: "#FEF3C7", texto: "#92400E" },
    dark: { fundo: "#78350F", texto: "#FDE68A" },
  },
  critica: {
    label: "Crítica",
    light: { fundo: "#FEE2E2", texto: "#991B1B" },
    dark: { fundo: "#7F1D1D", texto: "#FECACA" },
  },
};

const TAMANHOS = {
  sm: { paddingVertical: 4, paddingHorizontal: 10, fontSize: 12 },
  md: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13 },
  lg: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 15 },
} as const;

interface PrioridadeBadgeProps {
  prioridade: Prioridade;
  size?: keyof typeof TAMANHOS;
}

export function PrioridadeBadge({ prioridade, size = "md" }: PrioridadeBadgeProps) {
  const esquema = useColorScheme() ?? "light";
  const definicao = CORES[prioridade];
  const par = esquema === "dark" ? definicao.dark : definicao.light;
  const tamanho = TAMANHOS[size];

  return (
    <View
      style={{
        backgroundColor: par.fundo,
        paddingVertical: tamanho.paddingVertical,
        paddingHorizontal: tamanho.paddingHorizontal,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: par.texto, fontSize: tamanho.fontSize, fontWeight: "600" }}>
        {definicao.label}
      </Text>
    </View>
  );
}
