/**
 * Componente SeletorRodovia
 * Alterna a malha exibida na listagem. O piloto cobre três rodovias
 * concessionadas, com perfis de risco bem diferentes entre si.
 */

import { Pressable, ScrollView, Text, View } from "react-native";

import { rodovias } from "@/src/data/mockTrechos";
import type { FiltroRodovia } from "@/src/types";

interface SeletorRodoviaProps {
  valor: FiltroRodovia;
  onChange: (rodovia: FiltroRodovia) => void;
}

export function SeletorRodovia({ valor, onChange }: SeletorRodoviaProps) {
  const opcoes: { valor: FiltroRodovia; label: string }[] = [
    { valor: "todas", label: "Todas as rodovias" },
    ...rodovias.map((rodovia) => ({ valor: rodovia.id as FiltroRodovia, label: rodovia.nome })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
    >
      {opcoes.map((opcao) => {
        const ativo = valor === opcao.valor;
        return (
          <Pressable
            key={opcao.valor}
            onPress={() => onChange(opcao.valor)}
            accessibilityRole="button"
            accessibilityLabel={`Ver ${opcao.label}`}
            accessibilityState={{ selected: ativo }}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View
              className={
                ativo
                  ? "px-3 py-2 rounded-full border border-primary bg-primary"
                  : "px-3 py-2 rounded-full border border-border bg-surface"
              }
            >
              <Text
                className={
                  ativo ? "text-white text-sm font-semibold" : "text-foreground text-sm font-semibold"
                }
              >
                {opcao.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
