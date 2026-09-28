/**
 * Componente CampoBusca
 * Busca textual por trecho, rodovia, quilometragem ou causa do alerta.
 */

import { Pressable, Text, TextInput, View } from "react-native";

import { useColors } from "@/hooks/use-colors";

interface CampoBuscaProps {
  valor: string;
  onChange: (texto: string) => void;
  placeholder?: string;
}

export function CampoBusca({
  valor,
  onChange,
  placeholder = "Buscar por trecho, rodovia ou km",
}: CampoBuscaProps) {
  const cores = useColors();

  return (
    <View className="flex-row items-center bg-surface border border-border rounded-lg px-3">
      <Text style={{ fontSize: 14 }}>🔍</Text>
      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={cores.muted}
        className="flex-1 text-foreground px-2 py-3"
        accessibilityLabel="Campo de busca"
      />
      {valor.length > 0 ? (
        <Pressable
          onPress={() => onChange("")}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text className="text-muted text-base">✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
