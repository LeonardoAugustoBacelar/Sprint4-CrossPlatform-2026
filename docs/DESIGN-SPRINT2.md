> **Documento histórico — Sprint 2.**
> Registra o design original da aplicação, quando o escopo ainda era o registro
> genérico de ocorrências. Na Sprint 4 o produto foi redirecionado para a gestão de
> vegetação na faixa de domínio, conforme o desafio da Motiva: o domínio e as telas
> mudaram, mas as diretrizes visuais descritas aqui (orientação, paleta, tipografia,
> espaçamento e padrão de componentes) continuam valendo e foram mantidas.
> O estado atual do produto está no [README](../README.md).

---

# Design da Aplicação Motiva - Registro de Ocorrências

## Visão Geral

Aplicativo mobile para registro, visualização e gerenciamento de ocorrências (riscos) em ambientes de trabalho. O design segue padrões iOS com foco em usabilidade e clareza de informações.

## Orientação e Uso

- **Orientação**: Portrait (9:16)
- **Uso**: Uma mão
- **Padrão**: Apple Human Interface Guidelines (HIG)

---

## Telas da Aplicação

### 1. **Home - Lista de Ocorrências**

**Conteúdo Principal:**
- Header com título "Ocorrências"
- Botão flutuante (FAB) para criar nova ocorrência
- Lista de cards de ocorrências com:
  - Descrição breve
  - Local
  - Nível de risco (badge com cor: verde=baixo, amarelo=médio, vermelho=alto)
  - Data
  - Ícone de navegação

**Funcionalidade:**
- Tap em card → vai para tela de Detalhe
- Tap em FAB → vai para tela de Cadastro
- Scroll infinito ou paginação
- Sem ocorrências: mensagem vazia com ícone

**Layout:**
```
┌─────────────────────────┐
│ Ocorrências             │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ Queda de altura     │ │
│ │ Andar 3 - Baixo     │ │
│ │ 10/06/2026          │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Máquina sem guarda  │ │
│ │ Fábrica - Alto      │ │
│ │ 09/06/2026          │ │
│ └─────────────────────┘ │
│                         │
│                    [+]  │
└─────────────────────────┘
```

---

### 2. **Cadastro de Ocorrência**

**Conteúdo Principal:**
- Header com "Nova Ocorrência"
- Formulário com campos:
  - **Descrição** (TextInput, multiline)
  - **Local** (TextInput)
  - **Nível de Risco** (Picker/Segmented: Baixo, Médio, Alto)
  - **Data** (DatePicker)
- Botão "Salvar" (primário)
- Botão "Cancelar" (secundário)

**Funcionalidade:**
- Validação básica (campos obrigatórios)
- Tap "Salvar" → adiciona à lista e volta para Home
- Tap "Cancelar" → volta sem salvar
- Feedback visual ao salvar (loading)

**Layout:**
```
┌─────────────────────────┐
│ ← Nova Ocorrência       │
├─────────────────────────┤
│ Descrição               │
│ ┌─────────────────────┐ │
│ │ [TextInput]         │ │
│ └─────────────────────┘ │
│                         │
│ Local                   │
│ ┌─────────────────────┐ │
│ │ [TextInput]         │ │
│ └─────────────────────┘ │
│                         │
│ Nível de Risco          │
│ [Baixo] [Médio] [Alto]  │
│                         │
│ Data                    │
│ [DatePicker]            │
│                         │
│ ┌─────────────────────┐ │
│ │     Salvar          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │     Cancelar        │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

---

### 3. **Detalhe da Ocorrência**

**Conteúdo Principal:**
- Header com "Detalhes" e botão voltar
- Informações completas:
  - Descrição (expandida)
  - Local
  - Nível de risco (badge grande com cor)
  - Data e hora
  - ID da ocorrência
- Botões de ação:
  - Editar (opcional para Sprint 2)
  - Deletar (com confirmação)
  - Voltar

**Funcionalidade:**
- Tap "Voltar" → retorna à lista
- Tap "Deletar" → confirma e remove da lista
- Layout responsivo com scroll se necessário

**Layout:**
```
┌─────────────────────────┐
│ ← Detalhes              │
├─────────────────────────┤
│ Descrição               │
│ Queda de altura no      │
│ piso 3 durante         │
│ manutenção.            │
│                         │
│ Local: Andar 3          │
│ Data: 10/06/2026        │
│ Risco: [BAIXO]          │
│ ID: #001                │
│                         │
│ ┌─────────────────────┐ │
│ │     Deletar         │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

---

## Fluxo de Usuário

### Fluxo Principal: Criar e Visualizar Ocorrência

```
Home (Lista Vazia)
    ↓
    [Tap FAB +]
    ↓
Cadastro (Nova Ocorrência)
    ↓
    [Preenche formulário]
    ↓
    [Tap Salvar]
    ↓
Home (Lista com 1 item)
    ↓
    [Tap no card]
    ↓
Detalhe (Visualiza informações)
    ↓
    [Tap Voltar]
    ↓
Home (Lista)
```

---

## Paleta de Cores

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Fundo** | #FFFFFF (light) / #151718 (dark) | Background geral |
| **Texto Principal** | #11181C (light) / #ECEDEE (dark) | Títulos e texto principal |
| **Texto Secundário** | #687076 (light) / #9BA1A6 (dark) | Subtítulos e labels |
| **Risco Baixo** | #22C55E (verde) | Badge e indicador |
| **Risco Médio** | #F59E0B (amarelo) | Badge e indicador |
| **Risco Alto** | #EF4444 (vermelho) | Badge e indicador |
| **Primária** | #0a7ea4 (azul) | Botões e CTAs |
| **Superfície** | #f5f5f5 (light) / #1e2022 (dark) | Cards e containers |
| **Borda** | #E5E7EB (light) / #334155 (dark) | Divisores e bordas |

---

## Componentes Principais

1. **OcorrenciaCard** - Card na lista com resumo da ocorrência
2. **RiscoBadge** - Badge colorida com nível de risco
3. **FormField** - Campo de formulário com label
4. **Button** - Botão primário e secundário
5. **ScreenContainer** - Wrapper com SafeArea

---

## Notas de Design

- Todos os cards têm sombra sutil para profundidade
- Botões primários usam cor azul (#0a7ea4)
- Transições suaves entre telas (fade/slide)
- Feedback tátil (haptics) em ações principais
- Cores de risco são acessíveis (WCAG AA)
- Espaçamento consistente: 8px, 16px, 24px
- Tipografia: SF Pro Display (iOS) / Roboto (Android)

