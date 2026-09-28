/**
 * Componente TipoAreaBadge
 * Indica se o trecho monitorado é acostamento ou talude — o que também
 * define a unidade da medição (altura em cm ou cobertura em %).
 */

import { Text, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import type { TipoArea } from "@/src/types";

type Par = { fundo: string; texto: string };

const CORES: Record<TipoArea, { label: string; light: Par; dark: Par }> = {
  acostamento: {
    label: "Acostamento",
    light: { fundo: "#DBEAFE", texto: "#1E40AF" },
    dark: { fundo: "#1E3A8A", texto: "#BFDBFE" },
  },
  talude: {
    label: "Talude",
    light: { fundo: "#EDE9FE", texto: "#5B21B6" },
    dark: { fundo: "#4C1D95", texto: "#DDD6FE" },
  },
};

const TAMANHOS = {
  sm: { paddingVertical: 4, paddingHorizontal: 10, fontSize: 12 },
  md: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13 },
  lg: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 15 },
} as const;

interface TipoAreaBadgeProps {
  tipoArea: TipoArea;
  size?: keyof typeof TAMANHOS;
}

export function TipoAreaBadge({ tipoArea, size = "md" }: TipoAreaBadgeProps) {
  const esquema = useColorScheme() ?? "light";
  const definicao = CORES[tipoArea];
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
