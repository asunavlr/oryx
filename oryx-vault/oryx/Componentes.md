---
tipo: referência
atualizado: 2026-08-11
---

# Componentes

Os dez componentes da página, com a interface de cada um e o que esperar dele.
O **como o efeito funciona** está em [[Efeitos]]; aqui é a interface.

Voltar ao [[Oryx Capital]] · ver [[Design system]].

---

## A ordem na página

```
MenuCortina          ← fixo, por cima de tudo
LayerParallaxHero    #inicio
ScrollExpand         a imagem que abre
vision               #sobre
manifesto            faixa que corre
MaskedHeading        + os três números
solutions            #solucoes
AccordionGallery     a galeria
LuminaInteractiveList
wealth               #wealth
app                  #app  → CelularTresD
insights             #insights  → três cartões
CtaFinal             #contato
ModalContato         ← fixo, por cima de tudo
```

---

## Escritos nesta reconstrução

### `LayerParallaxHero`
```jsx
<LayerParallaxHero>{children}</LayerParallaxHero>
```
Seis camadas com velocidades diferentes. **Os filhos viram a camada de conteúdo**
— eles não ficam sobre a foto, ficam *entre* as camadas, e a névoa da frente
passa por cima deles.

> [!warning] O conteúdo é um flex de coluna
> Filho com proporção própria (`img`, `svg`, `video`) precisa de
> `align-self: flex-start`, senão é esticado na largura.
> Ver [[Bugs — a rodada de correções]] §2.

### `MenuCortina`
```jsx
<MenuCortina aoIr={fn} aoAbrirContato={fn} />
```
Logo, botão e cortina de tela cheia. Os seis links são **constantes no arquivo**
(`LINKS`) — mudar a navegação é editar lá.

`aoIr(alvo)` recebe o seletor (`'#sobre'`). O componente espera 420ms antes de
chamar, para a cortina subir antes da página rolar.

### `ModalContato`
```jsx
<ModalContato aberto={bool} aoFechar={fn} />
```
Formulário em vidro. **Não envia**: monta a mensagem e abre o WhatsApp.
Trava de foco, `Escape`, `inert` quando fechado.

Para trocar o destino, `enviar()` no arquivo — é onde o número está.

### `CelularTresD`
```jsx
<CelularTresD />
```
Sem props. Os dados da tela são **fixos no componente** e ilustrativos
(R$ 12.480.900, +8,4%, a alocação).

> [!danger] Números inventados
> Se a peça for para produção, ou viram dado real ou precisam de rótulo
> dizendo que são ilustrativos.

Variáveis de ajuste no CSS: `--larg`, `--esp` (espessura), `--raio`.

### `CtaFinal`
```jsx
<CtaFinal aoAbrirContato={fn} />
```
Fechamento da página. Substituiu o rodapé; carrega CVM, ANBIMA, aviso de risco
e as redes na base.

---

## Reescritos

### `ScrollExpand`
```jsx
<ScrollExpand
  src alt title scrollHint
  larguraInicial={38} alturaInicial={54}
  raioInicial={26} raioFinal={0}
  zoomInicial={1.3} distancia={1.1} scrimFinal={0.5}
>{children}</ScrollExpand>
```
`distancia` é em **telas de rolagem** — `1.1` consome 110% da altura da janela.

> [!note] Props renomeadas do original
> `startWidth → larguraInicial`, `mediaZoom → zoomInicial`,
> `scrollDistance → distancia`. E as classes CSS foram de `.scroll-expand__*`
> para `.se__*` — foi o que deixou um seletor órfão no CSS global
> ([[Bugs — a rodada de correções]] §4).

### `MaskedHeading`
```jsx
<MaskedHeading text="ALÉM DO ÓBVIO" src="/images/facade.jpg" trigger="view" />
```
Texto recortado em foto. `trigger`: `'view'` (ao entrar na tela) ou `'mount'`.

> [!danger] O recorte tem que ficar no elemento que tem o texto
> Foi a causa do título invisível. E `background-size` precisa dos **dois
> eixos** — com `auto` na altura a foto fica gigante e só aparece um pedaço
> liso dela. Ver [[Bugs — a rodada de correções]] §6.

---

## Herdados, não revisados

### `AccordionGallery`
```jsx
<AccordionGallery
  items={[{image, label, meta, link?, alt?}]}
  defaultIndex={1} expandRatio={.5} height={610}
  gap={10} radius={18} duration={.6} trigger="hover"
/>
```
Painéis que expandem no hover. `expandRatio` é a fração da largura que o painel
ativo ocupa. Funciona com qualquer número de itens — hoje são 5.

> [!todo] Não foi revisado
> Não tem tratamento de `prefers-reduced-motion`, e o `<a href="#">` de cada
> painel não leva a lugar nenhum.

### `LuminaInteractiveList`
```jsx
<LuminaInteractiveList />
```
Sem props. Os quatro slides são **constantes no arquivo**.

Nesta rodada só a navegação foi corrigida: era 12px a 45% de opacidade sobre
foto, com o número colado no rótulo ("01Visão Global"). Agora número e rótulo
em linhas separadas, tipo maior, faixa escura atrás.

> [!todo] Não foi revisado
> O resto do componente ficou como estava.

### `liquid-glass-button`
```jsx
import { Button, LiquidButton, MetalButton } from './ui/liquid-glass-button'
```
Três botões com `class-variance-authority`. **`LiquidButton` deixou de ser
usado** quando a barra de navegação saiu — o filtro SVG de turbulência dele
virou a base do vidro do [[Componentes#`ModalContato`|modal]].

> [!todo] Código morto
> `Button`, `MetalButton` e `buttonVariants` nunca foram usados. `LiquidButton`
> também não é mais. São ~4 kB e uma dependência (`@radix-ui/react-slot`,
> `class-variance-authority`) que podem sair.

---

## O que não é componente

`src/lib/utils.ts` — só o `cn()` (merge de classes Tailwind).

---

## Dependências

| Pacote | Para quê | Ainda necessário? |
|---|---|---|
| `gsap` | todo o movimento | sim |
| `lucide-react` | ícones | sim |
| `react` · `react-dom` | — | sim |
| `tailwindcss` + `@tailwindcss/vite` | preflight e utilitários | **pouco** — quase todo CSS é escrito à mão |
| `class-variance-authority` · `clsx` · `tailwind-merge` | só o `liquid-glass-button` | **não**, se ele sair |
| `@radix-ui/react-slot` | idem | **não**, se ele sair |

---

Relacionado: [[Design system]] · [[Efeitos]] · [[Bugs — a rodada de correções]] · [[Oryx Capital]]
