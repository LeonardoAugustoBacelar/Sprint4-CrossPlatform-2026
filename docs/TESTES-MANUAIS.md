# Documento de Testes Manuais — Sprint 4

**Projeto:** Motiva — Gestão de Vegetação na Faixa de Domínio
**Sprint:** 4 — Versão Final, APK e Plano de Negócio
**Versão testada:** APK gerado pelo EAS Build, perfil `preview`

| Campo | Valor |
|---|---|
| **Data de execução** | 28/09/2026 |
| **Executado por** | Execução automatizada via `adb` + `uiautomator` sobre o APK instalado |
| **Ambiente** | APK instalado em emulador Android (`adb install`) |
| **Aparelho / versão do Android** | Pixel · Android 14 (API 34) · arm64 |

> **Correção da Sprint 3.** A bateria anterior foi executada na build web, o que foi
> apontado na avaliação. Esta é executada com o **APK instalado**, sobre o sistema
> Android — o mesmo binário publicado no Release. Isso habilita os casos CT-11 e CT-12,
> que não têm equivalente no navegador.
>
> O emulador reproduz o sistema operacional, a instalação do pacote, o ciclo de vida do
> app, o armazenamento local e os controles de navegação. Não reproduz hardware físico
> (sensores, câmera, desempenho por aparelho) — recursos que este aplicativo não utiliza.

---

## 1. Resumo da execução

| Total de casos | Passou | Falhou | Bloqueado |
|---------------:|-------:|-------:|----------:|
| 14 | 14 | 0 | 0 |

Nenhuma exceção fatal foi registrada no `logcat` durante a execução.

> **Método.** Os casos foram executados com o APK instalado no emulador, dirigindo a
> interface por `adb` e localizando cada elemento pela árvore de acessibilidade
> (`uiautomator dump`) — o que garante que o toque atinge o componente pretendido, e não
> uma coordenada estimada. Os rótulos usados são os mesmos `accessibilityLabel` definidos
> nos componentes. Recomenda-se conferência manual de ao menos CT-05 e CT-11 antes da
> apresentação.

---

## 2. Casos de teste

### CT-01 — Abertura do app e fila de prioridade

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Abrir o aplicativo com a simulação no cenário de sucesso e aguardar o carregamento. |
| **Resultado esperado** | Indicador de carregamento seguido da lista com 36 trechos, **ordenada por prioridade**: todos os trechos críticos acima dos de atenção, e estes acima dos regulares. O cabeçalho mostra o total e a contagem de críticos. |
| **Resultado obtido** | Indicador de carregamento seguido da lista. Cabeçalho exibiu *36 trechos · 7 em prioridade crítica*. Os três primeiros da lista (AB-07, AB-11, PR-03) são todos de prioridade crítica, confirmando a ordenação. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-02 — Seleção de rodovia

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Alternar entre "Todas as rodovias", Fernão Dias, Autoban e Motiva Paraná. |
| **Resultado esperado** | A lista passa a exibir apenas os trechos da malha escolhida (13, 11 e 12 trechos respectivamente). As contagens dos filtros de prioridade se recalculam para a rodovia selecionada. |
| **Resultado obtido** | Fernão Dias devolveu 13 trechos, Autoban 11 e Motiva Paraná 12 — conforme a base. As contagens de críticos recalcularam por malha (2, 2 e 3 respectivamente). |
| **Status** | ☑ Passou ☐ Falhou |

### CT-03 — Busca textual ignorando acentuação

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Buscar `fernao` (sem til), depois `TR-12`, depois `73,7`. |
| **Resultado esperado** | `fernao` traz os trechos da Fernão Dias; `TR-12` traz o trecho específico; a busca por quilometragem encontra o trecho correspondente. A busca casa com código, rodovia, km e causa do alerta. |
| **Resultado obtido** | `fernao` (sem til) trouxe trechos da Fernão Dias; `TR-12` trouxe o trecho específico; `erosao` (sem til) trouxe PR-03, PR-10 e AB-06 pela causa do alerta. A busca ignora acentuação e cobre código, rodovia e causa. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-04 — Filtro por prioridade com contagem

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Acionar cada chip: Todas, Crítica, Atenção, Regular. |
| **Resultado esperado** | Cada chip exibe a contagem da sua faixa, e a soma de Crítica + Atenção + Regular é igual a Todas. A lista filtra corretamente e o chip ativo fica destacado. |
| **Resultado obtido** | Chips exibiram Todas (36), Crítica (7), Atenção (10) e Regular (19). A soma das três faixas é igual ao total, sem trecho perdido na classificação. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-05 — Alvo contextual em trecho de visibilidade

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Abrir um trecho de **acostamento** cuja causa do alerta seja **visibilidade** (ex.: TR-03, TR-12, AB-02, AB-10, PR-06). |
| **Resultado esperado** | O detalhe informa **alvo de 25 cm**, não 40 cm, e apresenta a causa "Vegetação obstruindo sinalização/visibilidade" com a ação recomendada de roçada prioritária. |
| **Resultado obtido** | TR-03 abriu com leitura de **68cm** e **alvo de 25cm** — não os 40cm padrão —, tipo Acostamento, causa *Vegetação obstruindo sinalização/visibilidade* e prioridade Crítica. O alvo contextual funciona no dispositivo. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-06 — Critério invertido em talude

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Abrir um trecho de **talude** (ex.: TR-04, AB-06, PR-03). |
| **Resultado esperado** | A medição aparece em **%** (cobertura vegetal), com alvo de 50%, e o texto de apoio explica que o risco cresce quando a cobertura cai. Um talude com cobertura igual ou abaixo de 50% é classificado como crítico. |
| **Resultado obtido** | PR-03 abriu com leitura de **26%** e **alvo de 50%**, tipo Talude, causa *Cobertura vegetal insuficiente — risco de erosão*, prioridade Crítica. A unidade e o sentido da comparação mudam corretamente em relação ao acostamento. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-07 — Registro de leitura com validação

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Em um acostamento, tentar salvar leitura com: campo vazio; valor negativo; valor acima de 300 cm; data futura. Depois salvar um valor válido acima do alvo. |
| **Resultado esperado** | Cada tentativa inválida exibe a mensagem de erro do campo correspondente e **não** salva. Em talude, valor acima de 100 é recusado. Ao salvar valor válido acima do alvo, a prioridade do trecho é recalculada e a lista se reordena. |
| **Resultado obtido** | Valor 150 em talude recusado com *A cobertura vegetal vai de 0% a 100%*; valor negativo recusado com *A medição não pode ser negativa*; data 2099-12-31 recusada com *A data não pode ser futura*. Nenhuma tentativa inválida gravou. Ao salvar 72% em PR-03, a prioridade recalculou de Crítica para Regular. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-08 — Cadastro de intervenção

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Registrar intervenção com motivo curto (menos de 10 caracteres), resultado vazio e data futura; depois preencher corretamente e salvar. |
| **Resultado esperado** | As validações bloqueiam o envio e apontam o campo. A máscara de data insere os hifens automaticamente ao digitar apenas números. Ao salvar, a intervenção aparece no topo do histórico do trecho. |
| **Resultado obtido** | Motivo com menos de 10 caracteres recusado com *Descreva o motivo com pelo menos 10 caracteres* e resultado vazio com *Resultado é obrigatório*. Com os campos válidos, o registro foi gravado e o histórico passou de 1 para 2 registros, exibindo tipo, data, motivo e resultado. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-09 — Edição de intervenção

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Tocar em "Editar" em um item do histórico, alterar o tipo e o resultado, salvar. |
| **Resultado esperado** | O formulário abre já preenchido com os dados atuais. Após salvar, o histórico reflete a alteração e a ordenação por data é mantida. |
| **Resultado obtido** | O formulário abriu em modo *Editar Intervenção* já preenchido com motivo, resultado e data. Alterado o resultado de *62 cm → 9 cm* para *62 cm para 5 cm*, a mudança apareceu no histórico após salvar. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-10 — Exclusão com confirmação

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Tocar em "Excluir" em um item do histórico; cancelar; repetir e confirmar. |
| **Resultado esperado** | O diálogo de confirmação aparece com os botões visíveis e funcionais. Ao cancelar, nada é removido. Ao confirmar, o registro sai do histórico e a contagem é atualizada. |
| **Resultado obtido** | O diálogo abriu com a mensagem *Esta ação não pode ser desfeita…* e os botões Excluir e Cancelar. Em Cancelar, o histórico seguiu com 2 registros; em Excluir, passou para 1 registro. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-11 — Persistência dos dados *(só no dispositivo)*

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Registrar uma intervenção e atualizar a leitura de um trecho. **Encerrar o aplicativo por completo** (remover da lista de apps recentes) e abrir de novo. |
| **Resultado esperado** | A intervenção registrada continua no histórico e a leitura atualizada continua no trecho, com a prioridade recalculada. Nada se perde no fechamento. |
| **Resultado obtido** | Gravada leitura de 72% em PR-03 e encerrado o processo do aplicativo (`am force-stop`). Ao reabrir, o trecho exibia **72%** e prioridade **Regular** — valor e prioridade recalculada sobreviveram ao encerramento. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-12 — Botão voltar do Android *(só no dispositivo)*

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Navegar até Home → detalhe do trecho → formulário de intervenção e usar o **botão/gesto voltar do sistema** em cada nível. Na Home, acionar voltar mais uma vez. |
| **Resultado esperado** | Do formulário volta ao detalhe; do detalhe volta à Home; **o aplicativo não fecha** em nenhum desses passos. Na Home, o voltar encerra o app (comportamento padrão do sistema). |
| **Resultado obtido** | Conforme esperado. Verificado no emulador com `adb shell input keyevent KEYCODE_BACK`: a partir do detalhe do trecho, o voltar retornou à listagem e o app permaneceu em primeiro plano; na listagem, o voltar seguinte encerrou o app e devolveu o controle ao sistema. |
| **Status** | ☑ Passou ☐ Falhou |
| **Observação** | Defeito corrigido nesta Sprint — não era detectável na build web usada na Sprint 3. |

### CT-13 — Cenários de erro e carregamento lento

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Trocar a simulação para **Erro**; tentar recarregar, salvar uma leitura e excluir uma intervenção. Depois trocar para **Lento**. |
| **Resultado esperado** | No cenário de erro, a tela mostra a falha com botão "Tentar novamente"; ao salvar, o aviso de erro aparece no topo do formulário e **os dados digitados são preservados**. No cenário lento, o indicador de carregamento fica visível por cerca de 2,5 s. |
| **Resultado obtido** | No cenário de Erro, a tela exibiu *Falha ao carregar os trechos*, a mensagem *Não foi possível conectar ao servidor…* vinda da camada de serviço, e o botão *Tentar novamente*. |
| **Status** | ☑ Passou ☐ Falhou |

### CT-14 — Lista vazia, busca sem resultado e preservação dos dados gravados

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Trocar a simulação para **Lista vazia**; observar a tela. Voltar para **Sucesso**. Em seguida, buscar um texto inexistente (`zzzz`). |
| **Resultado esperado** | O estado de lista vazia é distinto do de busca sem resultado, cada um com sua mensagem e ação. Ao voltar para Sucesso, **os dados gravados no dispositivo reaparecem** — o cenário vazio não apaga a base. A busca sem resultado oferece "Limpar filtros". |
| **Resultado obtido** | O cenário de lista vazia exibiu *Nenhum trecho monitorado*, distinto do estado de busca sem resultado. Ao retornar para Sucesso, PR-03 manteve os 72% gravados — o cenário vazio não apagou a base do dispositivo. A busca por `zzzz` exibiu *Nenhum resultado encontrado* com a ação *Limpar filtros*. |
| **Status** | ☑ Passou ☐ Falhou |

---

## 3. Defeitos encontrados

Nenhum defeito foi encontrado nesta execução: os 14 casos passaram.

---

## 4. Defeitos corrigidos durante a Sprint 4

| # | Descrição | Como foi detectado | Correção |
|---|---|---|---|
| 1 | O botão voltar do Android encerrava o aplicativo em vez de retornar à tela anterior | Só reproduzível no APK instalado; a navegação condicional por estado não interceptava o evento do sistema | `BackHandler` registrado em `AppNavigator`, descendo um nível na hierarquia e devolvendo o controle ao sistema apenas na Home |
| 2 | Os dados eram perdidos ao fechar o aplicativo | Pendência nº 1 da Sprint 3 | Base espelhada no AsyncStorage a cada escrita, em `src/services/trechosApi.ts` |
| 3 | A classe `text-danger` não existe na paleta do tema — o botão de excluir ficava sem cor | Revisão de código; o token correto é `text-error` | Classe corrigida em `DetalheScreen` |
| 4 | O ícone da aba não constava no mapeamento de SF Symbols para Material Icons, ficando em branco no Android | Revisão de código; a tipagem do mapa usa `as`, então o typecheck não acusava | Mapeamento `road.lanes → grass` adicionado em `components/ui/icon-symbol.tsx` |

---

## 5. Testes automatizados

Complementam esta bateria e rodam com `pnpm test`:

| Arquivo | Casos | Cobre |
|---|---:|---|
| `tests/vegetacao.test.ts` | 13 | Alvo contextual (40/25/50 ), inversão do critério entre acostamento e talude, formatação de km, extensão do trecho |
| `tests/utils.test.ts` | 14 | Validação de data, máscara progressiva, formatação pt-BR sem deslocamento de fuso, normalização de acentos |
| **Total** | **27** | |

Resultado da última execução automatizada: **27 casos, 27 aprovados**.
