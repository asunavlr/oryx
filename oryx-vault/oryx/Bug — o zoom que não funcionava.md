---
tipo: bug
gravidade: alta
status: diagnosticado
atualizado: 2026-08-11
---

# Bug — o zoom que não funcionava

O `ScrollExpand` (a imagem da cidade que deveria abrir de um retângulo pequeno
até tela cheia enquanto se rola) não fazia nada. A imagem simplesmente passava.

Voltar ao [[Oryx Capital]].

---

## A causa

Não estava no componente. Estava a três níveis acima, no CSS global:

```css
.site-shell { position: relative; overflow: hidden }
body        { ...; overflow-x: hidden }
```

O `ScrollExpand` depende de `position: sticky` no palco:

```css
.scroll-expand__stage { position: sticky; top: 0 }
```

> [!danger] `overflow: hidden` em qualquer ancestral mata `position: sticky`
> Um elemento `sticky` gruda em relação ao **contêiner de rolagem mais próximo**.
> `overflow: hidden` (assim como `auto` e `scroll`) **cria** um contêiner de
> rolagem. Como esse contêiner nunca rola — quem rola é a página — o `sticky`
> passa a se comportar como `static`: fica parado no fluxo e sobe junto.
>
> E é silencioso. Nenhum aviso, nenhum erro. O CSS está lá, aplicado, sem efeito.

`overflow-x: hidden` também conta: **não existe** esconder só um eixo. Definir
`overflow-x: hidden` faz o navegador computar `overflow-y` como `auto`, e pronto
— virou contêiner de rolagem.

## Por que estava lá

A intenção era legítima: impedir barra horizontal, porque a faixa do manifesto
(`.manifesto-track`) é mais larga que a tela e o parallax a empurra para os
lados. `overflow: hidden` resolve isso — e quebra outra coisa.

## A correção

```css
.site-shell { position: relative; overflow-x: clip }
body        { ...; overflow-x: clip }
```

`clip` corta exatamente igual ao `hidden`, mas **não cria contêiner de rolagem**
— então não há nada de onde rolar, e o `sticky` volta a olhar para a página.

| Valor | Corta o transbordo | Cria contêiner de rolagem | Quebra `sticky` |
|---|---|---|---|
| `visible` | não | não | não |
| `hidden` | sim | **sim** | **sim** |
| `clip` | sim | não | não |
| `auto` / `scroll` | sim | sim | sim |

## A lição

> [!tip] Quando um `sticky` não gruda, o problema quase nunca está nele
> Suba a árvore procurando `overflow` diferente de `visible`. É a primeira coisa
> a checar, antes de mexer em `top`, `z-index` ou na altura do pai.
>
> A segunda causa mais comum é o pai do `sticky` ter altura menor ou igual à do
> próprio elemento: aí não sobra distância para grudar.

Vale também para o inverso: se você **precisa** de `overflow: hidden` num
ancestral, então o efeito de rolagem tem de ser feito com pino de verdade —
`ScrollTrigger` com `pin: true` — e não com `sticky`. Foi o caminho escolhido na
reconstrução, por ser imune a esse tipo de interferência: ver [[Efeitos]].

---

Relacionado: [[Efeitos]] · [[Oryx Capital]]
