# Motiva — Sprint 4 (Versão Final, APK e Plano de Negócio)

## Aderência ao desafio (feedback da Sprint 3)

- [x] Redirecionar o produto para a gestão de vegetação na faixa de domínio
- [x] Modelar trecho com rodovia, km inicial/final, tipo de área e altura da vegetação
- [x] Substituir as 8 ocorrências genéricas por 36 trechos das 3 rodovias da Motiva
- [x] Implementar prioridade de roçada derivada da medição e do alvo
- [x] Implementar histórico de intervenções por trecho
- [x] Diferenciar acostamento (altura em cm) de talude (cobertura em %)
- [x] Alvo de corte contextual: 25 cm em trechos de visibilidade, 40 cm nos demais

## Limpeza do repositório (feedback da Sprint 3)

- [x] Remover o servidor (LLM, geração de imagem, transcrição, notificações)
- [x] Remover autenticação OAuth e tRPC
- [x] Remover Drizzle e as migrações
- [x] Remover a tela theme-lab e os componentes não usados do template
- [x] Remover scripts, assets e dependências órfãs (71 → 36 pacotes)

## Funcionalidades pendentes da Sprint 3

- [x] Persistência local com AsyncStorage
- [x] Corrigir o botão voltar do Android (fechava o app em vez de voltar)
- [x] Testes automatizados (27 casos)

## Entrega da Sprint 4

- [x] Configurar o EAS Build com perfil que gera APK
- [x] Escrever o plano de negócio (docs/PLANO-DE-NEGOCIO.md)
- [x] Consolidar o README como documento-âncora das 4 sprints
- [x] Preparar o documento de testes para execução no dispositivo
- [x] Rodar `npx eas-cli login` com a conta Expo do grupo
- [x] Gerar o APK com `pnpm build:apk`
- [x] Montar o emulador Android e instalar o APK (CT-12 verificado)
- [x] Executar os 13 casos restantes da bateria
- [x] Preencher os resultados em docs/TESTES-MANUAIS.md
- [x] Publicar o APK (Google Drive ou GitHub Releases) e colar o link no README
- [x] Gravar o vídeo de pitch de até 5 minutos (narração dos integrantes, sem IA)
- [x] Publicar o vídeo no YouTube como não listado e colar o link no README
- [x] Criar o repositório Sprint4-CrossPlatform-2026 e subir o código
- [x] Preencher o link do vídeo em ENTREGA-SPRINT4.txt e no README
