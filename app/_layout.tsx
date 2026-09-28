/**
 * Layout raiz do aplicativo.
 *
 * Monta os provedores globais (tema, área segura e gestos) e a pilha de
 * navegação do expo-router. A carga dos dados fica em src/context/AppContext,
 * montado na rota das abas.
 */

import "@/global.css";
import "react-native-reanimated";
import "@/lib/_core/nativewind-pressable";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

import { ThemeProvider } from "@/lib/theme-provider";

const METRICAS_PADRAO = {
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
  frame: { x: 0, y: 0, width: 0, height: 0 },
};

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  // Garante um respiro mínimo no topo e na base mesmo em aparelhos
  // que não reportam recortes (e no navegador).
  const metricasIniciais = useMemo(() => {
    const metricas = initialWindowMetrics ?? METRICAS_PADRAO;
    return {
      ...metricas,
      insets: {
        ...metricas.insets,
        top: Math.max(metricas.insets.top, 16),
        bottom: Math.max(metricas.insets.bottom, 12),
      },
    };
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={metricasIniciais}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/* Cabeçalhos nativos desligados para que os segmentos de rota
              (ex.: "(tabs)") não apareçam como título. */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
