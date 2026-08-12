---
tipo: referência
atualizado: 2026-08-11
---

# Design system

O que a página realmente usa — levantado do CSS, não do que seria bonito ter.
Onde há inconsistência, ela está registrada como tal.

Voltar ao [[Oryx Capital]] · ver [[Componentes]] · [[Efeitos]].

---

## Cor

Só cinco tokens existem de verdade, em `:root`:

```css
--ink:   #06120f   /* fundo base */
--green: #6dffb3   /* acento — o único */
--mint:  #d8ffec   /* linhas da grade, quase branco */
--cream: #f2f0e8   /* texto e seções claras */
--line:  rgba(220,255,238,.17)
```

### Superfícies que aparecem no CSS mas não são token

| Hex | Onde | O que é |
|---|---|---|
| `#04100d` | hero, CTA, celular | o preto-verde real da página — **mais escuro que `--ink`** |
| `#071a15` | Wealth, Insights | seção escura alternativa |
| `#092019` | Insights (original) | |
| `#0c684a` | itálicos sobre creme | o verde escuro, para contraste no claro |
| `#eae8df` | galeria | creme mais fechado |

> [!warning] `--ink` está fora de uso
> O fundo do `body` é `--ink` (`#06120f`), mas hero, CTA e celular usam
> `#04100d` direto. São valores diferentes, e a emenda aparece quando uma
> seção encosta na outra.
>
> Correção: promover `#04100d` a `--ink` e conferir onde o antigo era proposital.

### A regra de uso

- **Verde-menta (`--green`)** — o que se clica, o itálico serifado e nada mais
- **`#0c684a`** — o mesmo papel do verde-menta, mas sobre fundo creme
- Nunca dois acentos na mesma tela disputando

---

## Tipografia

| Papel | Fonte |
|---|---|
| Interface e texto | **DM Sans** 300 · 400 · 500 · 600 |
| Ênfase | **Instrument Serif** itálico |

> [!important] O itálico serifado é a assinatura
> "espera." · "legado." · "perspectiva." · "o futuro?" — sempre a palavra que
> **fecha** o pensamento, nunca a frase inteira. Gastar em outro lugar dilui.

### A escala não existe

Foram encontrados **15 `clamp()` diferentes** para tamanho de fonte:

```
clamp(10px, 1vw, 12px)          clamp(46px, 7.2vw, 118px)
clamp(26px, min(5.2vw,7.6vh))   clamp(49px, 6vw, 90px)
clamp(27px, 3.4vw, 40px)        clamp(50px, 7vw, 104px)
clamp(32px, 4vw, 58px)          clamp(52px, 7vw, 104px)
clamp(40px, 4.6vw, 68px)        clamp(52px, 8vw, 130px)
clamp(42px, min(9vw,12.2vh))    clamp(58px, 8.4vw, 132px)
clamp(44px, 5.6vw, 86px)        clamp(68px, 12vw, 190px)
                                clamp(70px, 11vw, 170px)
```

Cada seção nasceu com o seu. `clamp(50px,7vw,104px)` e `clamp(52px,7vw,104px)`
são a mesma coisa escrita duas vezes.

> [!todo] Reduzir a quatro
> `--t-titulo` (hero) · `--t-secao` · `--t-cartao` · `--t-corpo`, mais o kicker.
> Não é cosmético: hoje mudar a escala do site exige caçar 15 lugares.

### O teto por altura

```css
font-size: clamp(42px, min(9vw, 12.2vh), 138px);
```

> [!important] Título de tela cheia precisa de `min(vw, vh)`
> Só `vw` estoura a altura em notebook — foi o que cortou o título do hero e,
> depois, fez "Contato" invadir o rodapé do menu. Ver
> [[Bugs — a rodada de correções]] §3.

Usado em: título do hero, itens do menu. **Deveria** ser usado em todo texto que
precisa caber numa tela.

---

## Movimento

### Easing — este sim é consistente

```css
cubic-bezier(0.22, 1, 0.36, 1)   /* 17 usos — sai rápido, freia longo */
cubic-bezier(0.76, 0, 0.24, 1)   /* 1 uso — a cortina do menu, entra e sai */
```

A primeira é a curva da casa. A segunda é simétrica de propósito: o painel do
menu acelera e desacelera igual, porque atravessa a tela inteira.

> [!note] Escrita de duas formas
> `cubic-bezier(0.22, 1, 0.36, 1)` e `cubic-bezier(.22,1,.36,1)` convivem — é a
> mesma curva. Deveria ser uma variável.

### Durações observadas

| Faixa | Onde |
|---|---|
| 120–250ms | hover, foco, troca de estado pequeno |
| 300–500ms | entrada de bloco, halo, item de lista |
| 700–900ms | parallax de mouse (`quickTo`), prévia do menu |
| 1.1–1.4s | revelação por scroll, máscara do título |

### `prefers-reduced-motion`

Respeitado em **todos** os componentes novos. O padrão é desligar o `transform`
e mostrar o estado final — não simplesmente esconder.

---

## Forma

### Raio de canto — 13 valores diferentes

`4 · 14 · 16 · 18 · 22 · 24 · 26 · 28 · 30 · 32 · 34 · 44 · 100px`

> [!todo] Reduzir a cinco
> `pequeno 14` · `médio 26` · `grande 34` · `enorme 44` · `pílula 100`.
> O 100px (botões e chips) é o único que já é usado com consistência.

### Sombra

Não há token. Os padrões que se repetem:

```css
/* cartão sobre escuro */
0 40px 90px rgba(0,0,0,.5)
/* botão de acento — a sombra é da própria cor */
0 12px 34px -12px #6dffb3
/* vidro */
inset 1px 1px 1px rgba(255,255,255,.38), inset -1px -1px 1px rgba(0,0,0,.22)
```

> [!important] A sombra do botão verde usa a cor do botão
> `0 12px 34px -12px #6dffb3` e não preto. É o que faz o botão parecer emitir
> luz em vez de flutuar sobre um buraco.

---

## Vidro

Três receitas, e elas não são intercambiáveis:

| Onde | Receita |
|---|---|
| `.glass` (herdado) | `blur(24px) saturate(150%)` + borda `#fff2` |
| Botão do menu | `blur(18px) saturate(140%)` |
| Modal | `blur(28px) saturate(165%)` + turbulência SVG na moldura |

> [!danger] O `backdrop-filter` não pode ficar no elemento que tem o texto
> Ele cria contexto de empilhamento, e o conteúdo herda parte do borrão. Em
> todos os três casos o vidro é uma **camada irmã**, atrás, com `inset: 0`.
>
> E a distorção líquida (`filter: url(#...)`) vive só na moldura interna de 1px:
> aplicada no painel inteiro, deforma o texto.

---

## Breakpoints — cinco, sem critério

`640px · 800px · 860px · 900px` mais larguras de conteúdo (`530 · 600 · 620 ·
1180 · 1500px`).

> [!todo] Dois bastam
> `900px` (empilha as grades de duas colunas) e `640px` (celular).
> Os quatro atuais fazem a página quebrar em pontos diferentes conforme a seção,
> e é por isso que alguns blocos empilham antes de outros sem motivo aparente.

---

## Espaçamento

Não existe escala. As seções usam `padding: 130px 6vw` ou `150px 6vw` ou
`clamp(...)` conforme quem escreveu.

O que **é** consistente: **`6vw` de margem lateral** em quase tudo, e `22px` no
celular. Isso vale manter.

---

## O resumo honesto

| Camada | Estado |
|---|---|
| Cor | 5 tokens + 5 valores soltos que deveriam ser token |
| Tipografia | fontes certas, **escala inexistente** |
| Easing | consistente ✅ |
| Raio | 13 valores |
| Sombra | sem token, mas padrões reconhecíveis |
| Vidro | 3 receitas, cada uma com razão |
| Breakpoint | 5, sem critério |
| Margem lateral | `6vw` ✅ |

> [!warning] Isto descreve o que existe, não o que foi projetado
> A LP foi construída seção a seção, e o sistema é o que emergiu disso. Está
> registrado assim de propósito: escrever uma escala bonita que o código não
> segue seria pior que não ter nota nenhuma.
>
> Se a página crescer, os quatro `[!todo]` acima são a ordem de trabalho.

---

Relacionado: [[Componentes]] · [[Efeitos]] · [[Imagens]] · [[Oryx Capital]]
