# Plano de Negócio — Motiva Faixa Viva

**Disciplina:** Desenvolvimento Mobile · Sprint 4
**Produto:** aplicativo de gestão e monitoramento de vegetação na faixa de domínio
**Cliente-alvo:** Motiva (concessionárias de rodovias)

> **Sobre os números deste documento.** Estão marcados como *referência real* os
> valores verificados em fonte pública (tabela SICRO/DNIT, extensões das rodovias,
> programa de investimento da Motiva). Os demais são **estimativas de trabalho**,
> declaradas como tal — a calibração final depende do cronograma real de
> conservação da concessionária.

---

## 1. O problema

A vegetação na faixa de domínio é tratada hoje por **cronograma fixo**: a roçada
acontece em data marcada, não quando o trecho precisa. Isso produz os dois erros ao
mesmo tempo.

- **Roçada onde não precisava** — trechos cortados com a vegetação ainda baixa,
  gastando hora-máquina e equipe sem ganho de segurança.
- **Trecho crítico esperando a vez** — vegetação obstruindo placa de sinalização ou
  curva de raio reduzido, ou talude com cobertura vegetal insuficiente e risco de
  erosão, aguardando a data do cronograma.

O segundo erro é o caro. Vegetação alta em acostamento esconde sinalização e reduz o
campo de visão; talude descoberto erode e, em época de chuva, desliza sobre a pista.
Nenhum dos dois aparece no cronograma — só aparece na inspeção visual, que é cara,
lenta e não cobre a malha inteira.

## 2. Proposta de valor

**Substituir o cronograma fixo de roçada por uma fila de prioridade baseada em
medição.** O app mostra, a cada momento, quais trechos precisam de intervenção agora,
por quê, e o que já foi feito ali antes.

O que muda na prática para a concessionária:

| Hoje | Com o produto |
|---|---|
| Roçada por data marcada | Roçada por prioridade medida |
| ~12 roçadas/km/ano *(estimativa)* | ~5 roçadas/km/ano *(estimativa)* |
| Inspeção visual para achar o problema | Trecho e km já chegam identificados |
| Histórico disperso em planilha e ordem de serviço | Histórico por trecho, auditável |

O alvo de corte **não é um número único**. Um trecho de acostamento cuja causa de
alerta é visibilidade — curva fechada ou proximidade de placa — usa alvo de **25 cm**;
os demais usam **40 cm**. Em talude, o critério se inverte: o problema é cobertura
vegetal **abaixo de 50%**, que expõe o solo. Essa distinção é o núcleo do produto e
está implementada em `src/utils/vegetacao.ts`.

## 3. Personas e público-alvo

**Público-alvo primário:** concessionárias de rodovias sob regulação da ANTT e das
agências estaduais, começando pela malha da Motiva (~3.000 km).

| Persona | Cargo | Dor | O que o produto entrega |
|---|---|---|---|
| **Ricardo** | Coordenador de Conservação | Decide o cronograma de roçada sem saber qual trecho está pior | Fila ordenada por prioridade, com km e causa |
| **Sandra** | Encarregada de equipe de campo | Recebe ordem de serviço genérica e descobre o problema no local | Trecho, km exato, causa e ação recomendada |
| **Marcelo** | Gerente do CCO | Alerta de vegetação não entra no mesmo fluxo de tráfego e incidentes | Alerta geolocalizado por km, no formato que o CCO já opera |
| **Cláudia** | Diretora de Operações | Precisa justificar gasto de conservação ao poder concedente | Histórico de intervenções por trecho, com resultado medido |

O usuário do **aplicativo** é a Sandra e o Ricardo — campo e coordenação. A Cláudia é
quem assina o contrato; o que a convence é a seção 4 e o histórico auditável.

## 4. Modelo de receita

**SaaS B2B, assinatura por quilômetro monitorado.**

> **R$ 60 por km monitorado/mês** — R$ 720/km/ano

A escolha por km (e não por usuário ou por licença fechada) alinha o preço ao valor:
a concessionária paga proporcionalmente à malha que o produto cobre, e a expansão
para um novo trecho tem custo previsível.

**Por que esse preço se sustenta:** a economia estimada é de **R$ 6.300/km/ano**
(seção 5). A assinatura custa **R$ 720/km/ano** — cerca de **11% do que economiza**.

| Contrato | Extensão | Receita anual |
|---|---:|---:|
| Piloto — Fernão Dias (BR-381) | 569 km *(real)* | R$ 409.680 |
| Autoban (SP-330/SP-348) | 316,8 km *(real)* | R$ 228.096 |
| Motiva Paraná (BR-369/373/376) | 569 km *(real)* | R$ 409.680 |
| **Três rodovias do piloto** | **1.454,8 km** | **R$ 1.047.456** |
| Malha Motiva completa | ~3.000 km | R$ 2.160.000 |

**Receitas complementares**

- **Implantação e calibração** — R$ 40.000 a R$ 80.000 por rodovia, cobrado uma vez.
  Cobre o levantamento da geometria dos trechos e a calibração dos limiares de alerta
  ao perfil da malha (uma serra não usa o mesmo limiar de um corredor urbano).
- **Integração com o sistema de manutenção** da concessionária — projeto sob medida,
  a partir de R$ 30.000.

## 5. Impacto econômico esperado

Base de cálculo, por km de faixa de domínio:

| Item | Valor |
|---|---:|
| Custo de uma roçada | R$ 900/km *(estimativa de referência)* |
| Frequência no cronograma fixo | 12 roçadas/ano *(estimativa)* |
| Frequência orientada por dados | 5 roçadas/ano *(estimativa)* |
| **Custo atual** | **R$ 10.800/km/ano** |
| **Custo com o produto** | **R$ 4.500/km/ano** |
| **Economia bruta** | **R$ 6.300/km/ano** |
| Assinatura | −R$ 720/km/ano |
| **Economia líquida** | **R$ 5.580/km/ano** |

Projetando para a malha:

| Escopo | Extensão | Economia líquida/ano |
|---|---:|---:|
| Fernão Dias | 569 km | R$ 3,17 milhões |
| Três rodovias do piloto | 1.454,8 km | R$ 8,12 milhões |
| Malha Motiva completa | ~3.000 km | R$ 16,74 milhões |

**Impacto não financeiro** — e é o que sustenta a renovação do contrato:

- Redução de acidentes por sinalização obstruída e por invasão de pista em trechos de
  visibilidade reduzida.
- Antecipação de erosão em talude: intervir com hidrossemeadura custa muito menos que
  remover material deslizado e reabrir a pista. *Referência real SICRO/DNIT (abr/2026,
  tabela SP): hidrossemeadura **R$ 7,05/m²** contra preenchimento de erosão em talude
  **R$ 505,28/m³**.*
- Histórico por trecho como evidência documental para o poder concedente.

## 6. Estimativa de custos operacionais

Operação enxuta, em regime de contrato piloto *(estimativas de custo empresa, base São Paulo)*:

| Item | Mensal | Anual |
|---|---:|---:|
| 2 desenvolvedores (custo empresa) | R$ 38.000 | R$ 456.000 |
| 1 analista de dados / geoprocessamento | R$ 16.000 | R$ 192.000 |
| 1 comercial / suporte ao cliente | R$ 13.000 | R$ 156.000 |
| Infraestrutura em nuvem e processamento de imagens | R$ 6.000 | R$ 72.000 |
| Ferramentas e licenças | R$ 2.000 | R$ 24.000 |
| Administrativo, contábil e jurídico | R$ 5.000 | R$ 60.000 |
| **Total** | **R$ 80.000** | **R$ 960.000** |

**Custo que não aparece na tabela — porque é zero:**

- **Imagens de satélite: gratuitas.** Sentinel-2 (óptico) e Sentinel-1 (radar) vêm do
  Copernicus Data Space Ecosystem, de acesso livre. *Referência real* — é a mesma fonte
  usada no protótipo de monitoramento do grupo.
- **Câmeras: já contratadas.** A Fernão Dias tem câmeras de detecção automática no
  pacote de investimento, com implantação prevista em até 24 meses. *Referência real.*
  O produto roda sobre essa infraestrutura, sem CAPEX de hardware.

**Ponto de equilíbrio:** R$ 960.000 ÷ R$ 720/km/ano ≈ **1.333 km monitorados**.
As três rodovias do piloto somam 1.454,8 km — o piloto paga a operação, e a margem
vem da expansão para o restante da malha e para outras concessionárias.

## 7. Diferenciais competitivos

1. **Não exige hardware novo.** O concorrente típico chega vendendo sensor ou drone. O
   produto usa satélite público e a câmera que a concessionária já vai instalar — o que
   derruba a barreira de entrada e encurta o ciclo de venda.
2. **O alvo de corte é contextual, não um número único.** Tratar 40 cm como limiar
   universal mascara risco: em curva de raio reduzido, 40 cm já obstrui. Um sistema que
   não faz essa distinção reporta "tudo estável" em trechos que não estão.
3. **Talude e acostamento com critérios invertidos.** São dois problemas opostos —
   vegetação demais e vegetação de menos — e a maioria das ferramentas de inspeção
   trata só o primeiro.
4. **Histórico por trecho, não por ordem de serviço.** Permite ver a trajetória de um
   ponto ao longo do tempo: quantas vezes voltou a criticar, o que funcionou ali.
5. **Funciona em campo.** Aplicativo Android instalável, com os dados disponíveis no
   dispositivo — a equipe não depende de sinal na beira da rodovia.

## 8. Principais riscos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| **Nuvem impede a leitura óptica** | Alta | Radar (Sentinel-1) atravessa nuvem e cobre a janela em que o óptico falha. No período verificado no protótipo, o óptico leu 20 de 30 janelas (67%) e o radar, 30 de 30 |
| **Limiares mal calibrados** geram alerta demais ou de menos | Alta | Calibração cobrada como serviço de implantação, por rodovia; limiares configuráveis por contexto de risco |
| **Equipe de campo não adota o app** | Média | Fluxo curto — o trecho já chega identificado; o app substitui a inspeção prévia, não adiciona etapa |
| **Integração com o sistema de manutenção legado** | Média | Produto opera de forma autônoma na v1; integração vendida como projeto à parte |
| **Dependência do programa Copernicus** | Baixa | Programa público da União Europeia, com continuidade contratada; há fontes alternativas (Landsat/NASA, também gratuita) |
| **Ciclo de venda longo** em concessionária | Alta | Entrada por piloto pago de escopo reduzido (um trecho), com métrica de economia acordada antes |
| **Concorrência de empresa de inspeção já contratada** | Média | Posicionar como complemento: o produto diz *onde* olhar, a inspeção confirma — reduz o custo dela |

## 9. Próximos passos

| Horizonte | Passo |
|---|---|
| Curto | Piloto pago em trecho reduzido da Fernão Dias, com economia medida contra o cronograma atual |
| Médio | Integração com o CCO e com o sistema de ordens de serviço; emissão automática de OS por previsão de chuva em talude com erosão sinalizada |
| Longo | Expansão para as demais concessionárias reguladas pela ANTT; o modelo por km replica sem mudança de produto |

---

*Documento elaborado para a Sprint 4 da disciplina de Desenvolvimento Mobile.
Os dados de geometria das rodovias e as referências de custo SICRO/DNIT são reais;
as estimativas de frequência de roçada, preço e custo operacional estão declaradas
como tal e devem ser calibradas com dados da concessionária.*
