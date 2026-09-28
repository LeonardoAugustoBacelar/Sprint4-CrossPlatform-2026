/**
 * Tela Leitura — Atualização da medição do trecho
 *
 * Registra o que a equipe (ou o monitoramento remoto) mediu no trecho.
 * A unidade e os limites de validação mudam conforme o tipo de área:
 * altura em centímetros no acostamento, cobertura em porcentagem no talude.
 */

import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AvisoErro } from "@/src/components/AvisoErro";
import { Button } from "@/src/components/Button";
import { FormField } from "@/src/components/FormField";
import { useApp } from "@/src/context/AppContext";
import type { CausaAlerta, Trecho } from "@/src/types";
import { aplicarMascaraData, dataNoFuturo, dataValida, hojeISO } from "@/src/utils/data";
import { avaliarTrecho, CAUSA_LABEL, formatarKm } from "@/src/utils/vegetacao";

interface LeituraScreenProps {
  trecho: Trecho;
  onSalvar: () => void;
  onCancelar: () => void;
}

const CAUSAS: (CausaAlerta | "nenhuma")[] = [
  "nenhuma",
  "visibilidade",
  "incendio",
  "drenagem",
  "erosao",
];

/** Altura máxima aceita em campo, em cm — acima disso é erro de digitação. */
const LIMITE_ALTURA_CM = 300;

export function LeituraScreen({ trecho, onSalvar, onCancelar }: LeituraScreenProps) {
  const { registrarLeitura } = useApp();
  const avaliacao = avaliarTrecho(trecho);
  const ehTalude = trecho.tipoArea === "talude";

  const [medicao, setMedicao] = useState(String(trecho.medicao));
  const [data, setData] = useState(hojeISO());
  const [causa, setCausa] = useState<CausaAlerta | "nenhuma">(trecho.causa ?? "nenhuma");

  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};
    const valor = Number(medicao);

    if (!medicao.trim()) {
      novosErros.medicao = "Medição é obrigatória";
    } else if (!Number.isFinite(valor)) {
      novosErros.medicao = "Informe um número válido";
    } else if (valor < 0) {
      novosErros.medicao = "A medição não pode ser negativa";
    } else if (ehTalude && valor > 100) {
      novosErros.medicao = "A cobertura vegetal vai de 0% a 100%";
    } else if (!ehTalude && valor > LIMITE_ALTURA_CM) {
      novosErros.medicao = `Altura acima de ${LIMITE_ALTURA_CM} cm — confira o valor digitado`;
    }

    if (!data.trim()) {
      novosErros.data = "Data é obrigatória";
    } else if (!dataValida(data)) {
      novosErros.data = "Data inválida. Use o formato AAAA-MM-DD";
    } else if (dataNoFuturo(data)) {
      novosErros.data = "A data não pode ser futura";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (salvando) return;
    if (!validar()) return;

    setSalvando(true);
    setErroEnvio(null);

    try {
      await registrarLeitura(trecho.id, {
        medicao: Number(medicao),
        dataMedicao: data,
        causa: causa === "nenhuma" ? null : causa,
      });
      onSalvar();
    } catch (falha) {
      setErroEnvio(
        falha instanceof Error
          ? falha.message
          : "Não foi possível salvar a leitura. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="mb-2 flex-row items-center">
          <Pressable
            onPress={onCancelar}
            disabled={salvando}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
            style={({ pressed }) => ({ marginRight: 12, opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-primary text-2xl font-semibold">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Atualizar leitura</Text>
        </View>

        <Text className="text-muted text-sm mb-6">
          Trecho {trecho.id} · {formatarKm(trecho)}
        </Text>

        {erroEnvio ? <AvisoErro mensagem={erroEnvio} /> : null}

        <FormField
          label={ehTalude ? "Cobertura vegetal (%)" : "Altura da vegetação (cm)"}
          placeholder={ehTalude ? "0 a 100" : "Ex.: 62"}
          value={medicao}
          onChangeText={setMedicao}
          keyboardType="number-pad"
          error={erros.medicao}
          hint={`Alvo do trecho: ${avaliacao.alvo}${avaliacao.unidade}`}
          editable={!salvando}
        />

        <FormField
          label="Data da leitura"
          placeholder="AAAA-MM-DD"
          value={data}
          onChangeText={(texto) => setData(aplicarMascaraData(texto))}
          keyboardType="number-pad"
          maxLength={10}
          error={erros.data}
          hint="Somente números: a máscara insere os hifens automaticamente"
          editable={!salvando}
        />

        <View className="mb-4">
          <Text className="text-foreground font-semibold text-sm mb-2">Causa do alerta</Text>
          <View className="gap-2">
            {CAUSAS.map((opcao) => {
              const ativo = causa === opcao;
              const rotulo =
                opcao === "nenhuma" ? "Sem alerta — acompanhamento de rotina" : CAUSA_LABEL[opcao];
              return (
                <Pressable
                  key={opcao}
                  onPress={() => setCausa(opcao)}
                  disabled={salvando}
                  accessibilityRole="button"
                  accessibilityLabel={rotulo}
                  accessibilityState={{ selected: ativo }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                >
                  <View
                    className={
                      ativo
                        ? "py-3 px-3 rounded-lg border border-primary bg-primary"
                        : "py-3 px-3 rounded-lg border border-border bg-surface"
                    }
                  >
                    <Text
                      className={
                        ativo
                          ? "font-semibold text-sm text-white"
                          : "font-semibold text-sm text-foreground"
                      }
                    >
                      {rotulo}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Text className="text-muted text-xs mt-2">
            A causa &quot;visibilidade&quot; endurece o alvo do acostamento de 40 cm para 25 cm.
          </Text>
        </View>

        <View className="gap-3 mt-2 mb-8">
          <Button
            title="Salvar leitura"
            onPress={handleSalvar}
            loading={salvando}
            variant="primary"
          />
          <Button title="Cancelar" onPress={onCancelar} variant="secondary" disabled={salvando} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
