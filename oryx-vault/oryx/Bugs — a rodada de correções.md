---
tipo: bug
atualizado: 2026-08-11
---

# Bugs — a rodada de correções

Nove defeitos achados olhando a página rodando. **Sete foram introduzidos por
mim** durante a reconstrução — estão marcados. Registrados porque cada um tem
uma causa que volta a morder.

Voltar ao [[Oryx Capital]] · ver [[Bug — o zoom que não funcionava]] · [[Efeitos]].

---

## 1. `overflow: hidden` mata `position: sticky`

Ver [[Bug — o zoom que não funcionava]]. É a raiz do zoom que não funcionava, e
a única que já existia antes.

---

## 2. Flex de coluna estica imagem 🔴 meu

A logo do hero, 2000×640, apareceu **na largura inteira da tela e achatada**.

```css
.lph__conteudo { display: flex; flex-direction: column; }
```

> [!danger] `align-items` padrão do flex é `stretch`
> Num flex de coluna, os filhos são esticados no eixo transversal — a largura.
> Elemento de bloco não sofre, porque `width: 100%` já é o normal dele.
> **Imagem sofre**, porque tem proporção: a largura vai a 100% e a altura fica
> onde você mandou.

```css
.lph__logo { align-self: flex-start; flex: 0 0 auto; }
```

Vale para qualquer filho com proporção própria: `img`, `svg`, `video`, `canvas`,
`iframe`.

---

## 3. Tipo que só escala por largura estoura a altura 🔴 meu

O título do hero era `clamp(62px, 9.4vw, 152px)`. Numa tela **larga e baixa**,
três linhas a 152px passam dos 100svh, e o `overflow: hidden` da seção corta a
primeira linha — some junto com a logo e a eyebrow.

```css
font-size: clamp(42px, min(9vw, 12.2vh), 138px);
```

> [!tip] `min(vw, vh)` em título de tela cheia
> Sempre que o texto precisa **caber numa tela**, o teto tem que olhar os dois
> eixos. Só `vw` quebra em notebook; só `vh` quebra em monitor vertical.

O mesmo bug apareceu depois nos itens do menu, e a correção foi a mesma.

---

## 4. Renomear classe deixa o CSS órfão 🔴 meu

Renomeei `.scroll-expand__*` para `.se__*` no componente, e o `styles.css`
global continuou apontando para o nome antigo. O `h2` do overlay perdeu todo o
estilo e caiu no tamanho padrão do navegador — ficou minúsculo.

> [!warning] Nenhuma ferramenta avisa
> CSS órfão não é erro: é uma regra que simplesmente não casa com nada. Ao
> renomear classe de componente, **procurar o nome antigo no projeto inteiro**,
> não só no arquivo do componente.

---

## 5. Regra antiga vence a nova por especificidade 🔴 meu

O botão "Falar com um especialista" ficava com texto creme sobre verde-menta —
ilegível — e sem padding lateral.

```css
.cta a       { color: var(--cream); padding: 18px 0 }  /* 0,1,1 — do CTA antigo */
.cta__botao  { color: #04100d; padding: 20px 30px }    /* 0,1,0 — o novo */
```

Eu havia removido o CTA antigo mas deixei essa regra para trás. `.cta a` casa
com qualquer `<a>` dentro de `.cta`, inclusive o novo botão — **e ganha**, por
ter um seletor de elemento a mais.

> [!tip] Ao apagar um bloco, apague as regras descendentes dele
> Seletor do tipo `.bloco a` sobrevive à remoção do bloco e emboscada o que
> vier depois. Se a regra é do componente, ela devia estar no CSS dele.

---

## 6. `background-clip: text` não alcança camada promovida 🔴 meu

O título "ALÉM DO ÓBVIO" ficou **invisível**.

```css
.masked-heading      { background-clip: text; color: transparent }
.masked-heading span { will-change: transform }   /* ← e o GSAP transformava */
```

> [!danger] O recorte tem que estar no elemento que tem o texto
> `will-change: transform` (ou um `transform` de verdade) promove o elemento a
> uma camada de composição própria. O recorte do pai **não entra** nessa camada.
> Sem glifo para recortar, nada é pintado — e como a cor é transparente, o
> título some por inteiro.

A correção moveu o recorte para o próprio `<span>` e trocou o parallax de
`transform` do elemento por movimento da `background-position`. Ficou melhor:
a foto desliza **por dentro** das letras.

### E depois, o mesmo elemento de novo: `background-size`

Com o recorte funcionando, as letras apareceram num azul chapado. Era
`background-size: 118% auto` — `auto` na altura deixava a imagem gigante em
relação à altura do texto, e só um pedaço quase uniforme dela aparecia.
`130% 130%` faz a foto caber no bloco, com folga para o parallax.

---

## 7. Contêiner que rola não pode ser a moldura 🔴 meu

No modal, o textarea e o botão apareciam **fora do vidro**.

```css
.mc__painel { overflow-y: auto }              /* o painel rolava */
.mc__vidro  { position: absolute; inset: 0 }  /* o vidro cobria só o começo */
```

> [!warning] `inset: 0` num scroller cobre a área visível, não o conteúdo
> Um filho absoluto de um contêiner com rolagem se dimensiona pela caixa de
> padding — não pelo conteúdo rolável. Ao rolar, o conteúdo passa por baixo dele.

Separado: o painel virou moldura (sem rolagem) e a rolagem foi para um wrapper
interno. Também `focus({ preventScroll: true })` — o foco automático no primeiro
campo rolava o painel e cortava o título.

---

## 8. Escopo do `gsap.context` não inclui o próprio elemento 🔴 meu

O menu não abria.

```js
gsap.context(() => {
  tl.fromTo('.cortina', { yPercent: -100 }, { yPercent: 0 })  // ← sem alvo
}, cortina)   // cortina.current É o .cortina
```

> [!danger] O escopo busca entre os DESCENDENTES
> `gsap.context(fn, escopo)` resolve seletores com `escopo.querySelectorAll()`,
> que **não inclui o elemento de escopo**. Os filhos (`.cortina__item`)
> funcionavam; o pai, não. E não há erro: a tween simplesmente nasce sem alvo.

Para o próprio elemento, passar o nó: `tl.fromTo(cortina.current, ...)`.

### A lição maior

Mesmo depois de corrigido, o menu continuou sem abrir — e eu tentei adivinhar
mais duas vezes. Só andei quando **medi**: um `console.error` mostrou que a
timeline estava correta o tempo todo (ref presente, 6 itens, 4 tweens). O
problema não era o que eu vinha consertando.

> [!important] O que ficou dessa
> A abertura do painel passou a ser **CSS puro**, por classe. O GSAP anima só o
> conteúdo. A parte que não pode falhar não depende de JavaScript.
>
> E: duas tentativas erradas seguidas é o sinal para parar de editar e começar
> a medir.

---

## 9. Faces retas em caixa de canto arredondado 🔴 meu

No celular 3D, as laterais espetavam para fora nos quatro cantos.

A frente tem `border-radius: 46px`; as laterais são retângulos retos colados na
borda inteira. Nos cantos, onde a frente recua pela curva, a lateral continua
reta e aparece.

```css
.cel__lado--esq { top: var(--raio); bottom: var(--raio) }
```

Recuar cada lateral pelo raio do canto resolve — o canto fica coberto pela
própria curvatura.

---

## 10. A segunda foto no hero — erro de julgamento, não de código

Não era bug: o hero em camadas tinha uma faixa de foto na frente para criar
profundidade. Funciona na teoria e **não funcionou aos olhos**: mesmo sendo a
mesma imagem noutro recorte, o olho lia duas fotos coladas.

Trocada por uma névoa escura que sobe mais rápido que o fundo. Continua passando
na frente do título — que é o ponto do hero em camadas — sem competir com a
fotografia.

> [!note] Registrado porque o cliente apontou duas vezes
> Na primeira eu ajustei o recorte. Na segunda entendi que o problema não era o
> ajuste, era a ideia.

---

Relacionado: [[Efeitos]] · [[Imagens]] · [[Oryx Capital]]
