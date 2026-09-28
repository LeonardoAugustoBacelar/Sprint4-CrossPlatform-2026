/**
 * AppNavigator
 * Navegação entre as telas da aplicação (navegação condicional com useState).
 *
 * Rotas: home → detalhe do trecho → leitura ou formulário de intervenção.
 *
 * O botão voltar do Android é tratado aqui: sem isso, o gesto de voltar
 * fecharia o aplicativo em vez de retornar à tela anterior — defeito que
 * só aparece no APK instalado, não na build web usada na Sprint 3.
 */

import { useCallback, useEffect, useState } from "react";
import { BackHandler, Platform } from "react-native";

import { useApp } from "@/src/context/AppContext";

import { DetalheScreen } from "./DetalheScreen";
import { FormularioScreen } from "./FormularioScreen";
import { HomeScreen } from "./HomeScreen";
import { LeituraScreen } from "./LeituraScreen";

type Tela = "home" | "detalhe" | "leitura" | "formulario";

export function AppNavigator() {
  const [tela, setTela] = useState<Tela>("home");
  const [trechoSelecionado, setTrechoSelecionado] = useState<string | null>(null);
  const [intervencaoEmEdicao, setIntervencaoEmEdicao] = useState<number | null>(null);

  const { getTrechoById, intervencoes } = useApp();

  const irParaDetalhe = (id: string) => {
    setTrechoSelecionado(id);
    setIntervencaoEmEdicao(null);
    setTela("detalhe");
  };

  const voltarParaHome = () => {
    setTrechoSelecionado(null);
    setIntervencaoEmEdicao(null);
    setTela("home");
  };

  const voltarParaDetalhe = useCallback(() => {
    setIntervencaoEmEdicao(null);
    setTela("detalhe");
  }, []);

  /** Um passo para trás na hierarquia. Devolve false quando já está na raiz. */
  const voltar = useCallback((): boolean => {
    if (tela === "leitura" || tela === "formulario") {
      voltarParaDetalhe();
      return true;
    }
    if (tela === "detalhe") {
      setTrechoSelecionado(null);
      setTela("home");
      return true;
    }
    return false;
  }, [tela, voltarParaDetalhe]);

  // Botão/gesto voltar do Android. Na home devolvemos false para que o
  // sistema faça o comportamento padrão (sair do app).
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const inscricao = BackHandler.addEventListener("hardwareBackPress", voltar);
    return () => inscricao.remove();
  }, [voltar]);

  const trecho = trechoSelecionado ? getTrechoById(trechoSelecionado) : undefined;

  if (tela === "leitura" && trecho) {
    return (
      <LeituraScreen trecho={trecho} onSalvar={voltarParaDetalhe} onCancelar={voltarParaDetalhe} />
    );
  }

  if (tela === "formulario" && trecho) {
    return (
      <FormularioScreen
        trecho={trecho}
        intervencao={
          intervencaoEmEdicao !== null
            ? intervencoes.find((item) => item.id === intervencaoEmEdicao)
            : undefined
        }
        onSalvar={voltarParaDetalhe}
        onCancelar={voltarParaDetalhe}
      />
    );
  }

  if (tela === "detalhe" && trechoSelecionado !== null) {
    return (
      <DetalheScreen
        id={trechoSelecionado}
        onVoltar={voltarParaHome}
        onAtualizarLeitura={() => setTela("leitura")}
        onNovaIntervencao={() => {
          setIntervencaoEmEdicao(null);
          setTela("formulario");
        }}
        onEditarIntervencao={(intervencaoId) => {
          setIntervencaoEmEdicao(intervencaoId);
          setTela("formulario");
        }}
      />
    );
  }

  return <HomeScreen onSelecionarTrecho={irParaDetalhe} />;
}
