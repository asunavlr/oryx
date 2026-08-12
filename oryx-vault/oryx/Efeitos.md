---
tipo: catálogo
atualizado: 2026-08-11
---

# Efeitos

Todo movimento da página, com a razão de existir e o parâmetro que o governa.
A regra que atravessa tudo: **o movimento explica profundidade ou origem**.
Nada se move só para se mover.

Voltar ao [[Oryx Capital]] · ver [[Bug — o zoom que não funcionava]].

---

## 1. Hero em camadas — `LayerParallaxHero`

> [!important] O que faz o efeito funcionar
> O título **não fica na frente da foto — fica entre as camadas.** Existe algo
> atrás dele (o horizonte, lento) e algo na frente (a névoa, rápida) que
> **passa por cima do texto**. Sem essa passagem, é só uma imagem deslizando.

Velocidades. Quanto mais perto do observador, mais rápido sobe — é assim que o
olho lê distância:

| Camada | Velocidade | O que é |
|---|---|---|
| `céu` | 0.06 | gradiente, quase parado — o infinito |
| `horizonte` | 0.18 | foto da cidade ao anoitecer, mascarada na base |
| `brilho` | 0.30 | halos verdes desfocados |
| **`conteúdo`** | **0.55** | **logo, título, rodapé — o texto vive aqui** |
| `frente` | 0.92 | névoa escura que cruza na frente do título |
| `vinheta` | fixa | colada na tela |

O deslocamento total é `velocidade × 42%` da altura.

### Detalhes que não são opcionais

- **Cada camada é 12% maior que a tela** (`inset: -12%`). Sem isso o
  deslocamento expõe a borda do elemento no fim do percurso.
- **`ease: 'none'` com `scrub`.** O progresso *já é* o scroll; qualquer curva
  por cima faz a camada parecer atrasada em relação ao dedo.
- **A camada da frente NÃO é foto.** Já foi, e não funcionou: mesmo sendo a
  mesma imagem noutro recorte, o olho lia duas fotos coladas em vez de
  profundidade. Virou um gradiente escuro que sobe mais rápido que o fundo —
  continua passando na frente do título, sem competir com a fotografia.
  Ver [[Bugs — a rodada de correções]] §10.

### Parallax de mouse

```js
const x = gsap.quickTo('.lph__ceu', 'x', { duration: 0.9, ease: 'power3' });
```

> [!tip] `quickTo` e não `gsap.to` em `pointermove`
> O evento dispara dezenas de vezes por segundo. Um `gsap.to` por disparo cria e
> destrói um tween a cada vez; `quickTo` reusa o mesmo, e o custo por evento cai
> para quase zero.

O sinal é **invertido** (`px * -34 * velocidade`): a camada foge do cursor, como
se a cena tivesse volume e o observador andasse ao redor dela.

Ativado por `matchMedia('(hover: hover) and (pointer: fine)')` e não por largura
de tela: a query se reavalia sozinha, e aparelho de toque não tem cursor a seguir.

---

## 2. Imagem que abre — `ScrollExpand`

A foto começa como um retângulo de 38% × 54% com cantos de 26px e abre até
ocupar a tela inteira.

```js
clip-path: inset(A% L% A% L% round Rpx)   // moldura abrindo
transform: scale(1.3 → 1)                 // foto desamplia
```

> [!important] Por que as duas coisas ao mesmo tempo
> A moldura abre **e** a foto desamplia. Juntas, dão a sensação de a câmera
> recuar. Só abrir a moldura pareceria uma cortina; só desampliar pareceria um
> zoom-out comum.

Linha do tempo, em fração do percurso:

| Quando | O quê |
|---|---|
| 0 → 1 | moldura abre, `scale` cai, véu escurece até 0.5 |
| 0 → 0.12 | a dica "role para expandir" some |
| 0.40 → 0.88 | o título grande sobe, cresce 6% e desaparece |
| 0.68 → 1 | o texto de dentro aparece |

### A mudança estrutural

A versão anterior usava `position: sticky` mais um laço de `requestAnimationFrame`
próprio. **Não funcionava** — e a causa estava três níveis acima, no CSS global.
Ver [[Bug — o zoom que não funcionava]].

Agora o pino é do `ScrollTrigger` (`pin: '.se__palco'`), que não depende de
`sticky`: ele mede e aplica `position: fixed` por conta própria. Some a classe
inteira de bug, e o laço de quadro passa a ser o mesmo do resto do site.

`invalidateOnRefresh: true` é obrigatório: sem ele, os valores em px calculados
na criação ficam presos e o efeito sai do lugar quando a janela muda de tamanho.

---

## 3. Fechamento — `CtaFinal`

Substitui o rodapé antigo.

- **Foto de fundo respirando**: `scale 1.14 → 1` com `yPercent -4 → 4`, em
  `scrub`. Escala pequena de propósito — aqui o assunto é o texto, não a imagem.
- **Halo que segue o cursor**: um círculo de 620px com gradiente radial verde,
  arrastado por `quickTo`. Fica **atrás** do conteúdo (`z-index: 0` contra `1`)
  para iluminar sem lavar o texto.
- **Entrada escalonada** dos blocos, `stagger: 0.09`, `once: true`.

---

## 3.5. Menu em cortina — `MenuCortina`

Substitui a barra flutuante de vidro, que cortava o hero em dois e roubava a
primeira linha do título.

| Peça | Como |
|---|---|
| Painel | **CSS puro**: `translateY(-100% → 0)` por classe, 0.72s `cubic-bezier(.76,0,.24,1)` |
| Itens | GSAP, `y: 80 → 0` com `autoAlpha`, `stagger: 0.055` |
| Prévia | pilha de `<img>`; só a ativa tem `opacity: 1` |

> [!important] O painel abre sem JavaScript
> Ele dependia da timeline do GSAP, e enquanto ela não funcionou o menu ficou
> **inacessível**. A parte que não pode falhar não pode depender de JS. O GSAP
> anima só o conteúdo. Ver [[Bugs — a rodada de correções]] §8.

**Prévia em pilha, não `src` trocado**: mudar o `src` de um único `<img>` dá um
flash branco a cada troca, porque o navegador descarta o quadro anterior antes
de decodificar o novo.

**Número, rótulo e nota na mesma linha.** A nota já morou numa segunda linha da
grade — com seis itens, aquela linha extra fazia "Contato" invadir o rodapé, e
como ela só existia no item sob o cursor, cada item tinha altura diferente e os
números pareciam desalinhados.

---

## 3.6. Celular 3D — `CelularTresD`

CSS `transform-style: preserve-3d` com as **seis faces** de verdade: frente,
traseira e quatro laterais de 24px. Ele tem espessura, e girar revela o lado.

Sem WebGL de propósito: um aparelho em three.js custaria centenas de kB mais um
modelo para carregar, e o objeto aqui é uma caixa arredondada — geometria que o
CSS dá de graça.

A rotação soma duas fontes, em elementos diferentes para não brigarem pela mesma
propriedade:

| Fonte | Onde | O quê |
|---|---|---|
| scroll | `.cel__corpo` | `rotateY -32° → 16°`, `rotateX 14° → -6°`, `scrub: 1` |
| mouse | `.cel` (palco) | `--rx` / `--ry` por `quickTo` |

Detalhes que fazem parecer objeto e não print:

- **Perspectiva no palco, não no corpo** — assim as duas rotações compartilham o
  mesmo ponto de fuga.
- **A sombra fica FORA do `preserve-3d`** — dentro, giraria junto e entregaria
  que é um plano.
- **Reflexo diagonal em `mix-blend-mode: screen`** — clareia sem lavar o conteúdo.
- **As laterais recuam pelo raio do canto** — ver [[Bugs — a rodada de correções]] §9.

---

## 3.7. Modal de contato — `ModalContato`

Vidro com o mesmo filtro de turbulência do `LiquidButton`, mas a distorção vive
**só na moldura interna de 1px**: aplicada no painel inteiro, deformaria o texto
e o formulário ficaria ilegível.

> [!warning] O formulário não envia para lugar nenhum
> Não existe backend. Em vez de fingir um "enviado com sucesso" que não
> aconteceu, ele monta a mensagem e abre o WhatsApp da Oryx com tudo preenchido —
> o mesmo canal que o site atual usa, e a pessoa vê o que está mandando.

Acessibilidade: `role="dialog"`, `aria-modal`, trava de foco no `Tab`, `Escape`
fecha, foco volta ao gatilho, `inert` quando fechado.

---

## 4. Efeitos herdados, mantidos

| Efeito | Onde | Como |
|---|---|---|
| Faixa do manifesto | `.manifesto-track` | `xPercent: -48` com `scrub: 1` |
| Título mascarado | `MaskedHeading` | `clip-path: inset(0 100% 0 0)` abrindo em `power4.inOut`, mais deslocamento por `pointermove` |
| Revelação por scroll | `.reveal` | `y: 70 → 0`, `power3.out`, `once: true` |
| Soluções alternando lado | `.solution` | `x: ±60` conforme o índice é par ou ímpar |
| Foto no hover da solução | `.solution-foto` | `opacity 0 → .5` e `scale .94 → 1`, só CSS |

---

## 5. A rede de segurança do ScrollTrigger

```js
document.fonts?.ready.then(() => ScrollTrigger.refresh());
addEventListener('load', () => ScrollTrigger.refresh());
```

> [!warning] A armadilha número um do ScrollTrigger
> Ele **pré-calcula** `start`/`end` uma vez, por performance, e só refaz sozinho
> no `resize`. Fonte que carrega depois, imagem que chega e muda a altura da
> página — nada disso o avisa.
>
> Sintoma clássico: **funciona no primeiro load e erra depois**. Nesta página o
> risco é real, porque são 11 fotos grandes e duas fontes do Google.

---

## O que eu não consegui verificar

> [!failure] As referências do 21st.dev não abriram
> As duas páginas mandadas — o hero da `reuno-ui` e o `layer-parallax-hero` do
> `erikvalencia1` — são renderizadas por JavaScript. O que volta na requisição é
> só o índice de categorias; o código-fonte do componente não vem.
>
> Então **o hero em camadas acima foi construído a partir do padrão que o nome
> descreve**, não copiado da referência. Se o que você viu lá tem alguma
> característica específica que não está aqui, me diga qual e eu ajusto —
> ou mande um print.

---

Relacionado: [[Bug — o zoom que não funcionava]] · [[Imagens]] · [[Oryx Capital]]
