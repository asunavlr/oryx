---
tipo: hub
atualizado: 2026-08-11
---

# Oryx Capital

Landing page da **Oryx Capital** — gestora de recursos de Ribeirão Preto,
autorizada pela CVM e aderente à ANBIMA. Quatro frentes: Wealth, Asset,
Investment Banking e Corporate Solutions.

Repositório: `asunavlr/oryx` · Vite + React + GSAP + Tailwind 4.

---

## Por onde começar

| Nota | O que tem |
|---|---|
| [[Efeitos]] | Todo movimento da página, com o parâmetro que o governa |
| [[Bug — o zoom que não funcionava]] | O `overflow:hidden` que matava o `sticky` |
| [[Imagens]] | As 11 fotos, o critério de escolha e a pendência de peso |
| [[Bugs — a rodada de correções]] | Dez defeitos, sete deles meus, com a causa de cada um |
| [[Design system]] | Cor, tipo, forma e movimento — o que existe de verdade |
| [[Componentes]] | Os dez componentes, a interface de cada um |

---

## A identidade

| | |
|---|---|
| Fundo | `#04100d` — verde quase preto |
| Acento | `#6dffb3` — menta |
| Creme | `#f2f0e8` — as seções claras |
| Texto | **DM Sans** 300–600 |
| Destaque | **Instrument Serif** itálico — só nas palavras que carregam a ideia |

> [!important] O itálico serifado é a assinatura
> "espera." · "legado." · "perspectiva." · "o futuro?" — sempre a palavra que
> fecha o pensamento, nunca a frase inteira. É o que dá voz à página. Não gastar
> em outro lugar.

Isto é o resumo. O sistema completo — tokens, escala, raio, sombra, vidro,
breakpoints — está em [[Design system]], **com as inconsistências marcadas**.

---

## O que mudou nesta reconstrução

### Hero
Era uma foto chapada com gradiente por cima. Virou **hero em camadas**, com o
título vivendo entre o fundo e a frente. Ver [[Efeitos]] §1.

### Zoom
Não funcionava. A causa não estava no componente. Ver
[[Bug — o zoom que não funcionava]].

### Rodapé
Removido. Era o único bloco da página sem desenho nenhum — três colunas, "IG" e
"IN" dentro de círculos, e um aviso legal em 10px a 40% de opacidade. E era a
última coisa que a pessoa via.

> [!note] O que era obrigatório continuou
> CVM, ANBIMA, aviso de risco, Instagram, LinkedIn e o ano. Nada disso sumiu —
> passou para a base do bloco de fechamento, subordinado à chamada em vez de
> solto num rodapé cinza.

### Marca
O "O" desenhado em CSS saiu; entrou a **logo oficial**
(`oryxcapital.com.br/oryx-logo.png`, 2000×640, branca sobre transparente — já
nasce certa no tema escuro). Aparece na nav, no hero e no fechamento.

### Navegação
A barra flutuante de vidro saiu. Virou **logo + botão**, com os links numa
cortina de tela cheia — seis itens, cada um com nota e prévia que troca no hover.

### Seções novas
As abas do site real foram extraídas do bundle deles (`/sobre-nos`, `/Servicos`,
`/wealth`, `/aplicativo`, `/contato`) e viraram seções na mesma página. **Wealth**
e **Aplicativo** foram criadas do zero — esta última com um celular 3D em CSS.

### Insights
O radar abstrato saiu. Entraram três cartões de análise com tema, data e resumo,
que é o que uma gestora mostra ali.

### Contato
Modal em vidro com formulário. Ver [[Efeitos]] §3.7.

### Imagens
De 5 para 11. Ver [[Imagens]].

---

## Pendências

- [ ] **Peso das imagens** — 13 MB. AVIF/WebP e `srcset`. Ver [[Imagens]]
- [ ] O `AccordionGallery` e a `LuminaInteractiveList` não foram revisados — ver [[Componentes]]
- [ ] `liquid-glass-button` virou código morto; sair dele tira 3 dependências
- [ ] Escala de tipo, raio e breakpoint sem critério — ver os `[!todo]` em [[Design system]]
- [ ] Sem `<meta og:*>` — o link compartilhado não mostra prévia
- [ ] A logo é servida como PNG de 41 KB; um SVG seria menor e nítido em qualquer tamanho
- [ ] As referências do 21st.dev não puderam ser lidas — ver a ressalva no fim de [[Efeitos]]

> [!danger] Texto escrito por mim, não pela Oryx
> O conteúdo de **Wealth**, **Aplicativo**, dos **três cartões de insight** e dos
> **números** (2016, 4 frentes, CVM) foi redigido para dar corpo às seções. Não
> veio do site nem de material da empresa.
>
> O ano de 2016 em particular é **suposição** — não achei a data de fundação em
> lugar nenhum. Tem que ser conferido ou removido antes de publicar.
>
> Os valores do celular (R$ 12.480.900, +8,4%, a alocação) são ilustrativos e
> precisam ficar claramente marcados como tal, ou virar dados reais.
