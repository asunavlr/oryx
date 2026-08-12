---
tipo: referência
atualizado: 2026-08-11
---

# Imagens

Onze fotos, todas em `public/images/`. Seis são novas — o pedido era "falta
imagens", e faltava mesmo: a página tinha cinco fotos para dez seções.

Voltar ao [[Oryx Capital]] · ver [[Efeitos]].

---

## O critério

A página é verde-escuro (`#04100d`) com acento menta. Foto que não fosse escura,
dessaturada e arquitetônica ia brigar com a paleta em vez de sustentá-la. Por
isso: **arquitetura de vidro, vista aérea noturna e geometria** — nada de gente,
nada de gráfico de bolsa, nada de aperto de mão.

## O acervo

| Arquivo | O que é | Onde entra |
|---|---|---|
| `horizonte.jpg` | cidade ao anoitecer, horizonte largo | camada de fundo do hero **e** o `ScrollExpand` |
| `rastros.jpg` | rastros de luz, azul profundo | camada da frente do hero · galeria |
| `convergencia.jpg` | vidro convergindo, simetria vertical | foto da seção Visão · fundo do fechamento |
| `vidro.jpg` | grade de vidro, clara | fundo de Insights · solução 01 |
| `aereo.jpg` | vista de cima, diurna | galeria · solução 02 |
| `geometria.jpg` | geometria repetida | faixa do manifesto · solução 04 |
| `hero.jpg` | átrio de vidro colorido | galeria (era o fundo do hero antigo) |
| `city.jpg` | aérea de São Paulo | reserva |
| `tower.jpg` · `night.jpg` · `facade.jpg` | do acervo original | galeria · título mascarado |

`horizonte.jpg` aparece **duas vezes** de propósito: é o fundo do hero e é o que
abre no `ScrollExpand` logo abaixo. Reencontrar a mesma imagem, agora inteira,
fecha o gesto do "além do horizonte".

## Procedência

As seis novas vêm do Unsplash, licença livre para uso comercial.

> [!warning] Cuidado que custou uma escolha
> Metade dos resultados da busca eram **Unsplash+** — pagas, e o arquivo baixado
> vem com marca d'água repetida por cima. A primeira noturna que escolhi era uma
> dessas, e só apareceu ao olhar o arquivo.
>
> O campo que denuncia é `plus: true` na API, ou `premium_photo` na URL. Vale
> checar antes de baixar, não depois.

```bash
curl -s "https://unsplash.com/napi/photos/<id>" | python3 -c "
import sys,json; d=json.load(sys.stdin)
print('PAGA' if d.get('plus') else 'livre')"
```

Também: a URL curta `images.unsplash.com/photo-<id>` **não resolve** — devolve
29 bytes de HTML. É preciso pegar `urls.raw` da API, que traz o token de
assinatura, e só então acrescentar `&w=3840&q=80`.

## Pendência de peso

> [!danger] 13 MB em imagens
> É demais para uma landing page, mesmo com só três carregando acima da dobra.
>
> O que falta fazer:
> - converter para **AVIF/WebP** com fallback (corta 60–70% sem perda visível)
> - servir tamanhos por `srcset`, em vez de mandar 3200px para um celular
> - `loading="lazy"` em tudo que não é hero, e `fetchpriority="high"` no hero
> - `preload` só de `horizonte.jpg`
>
> Foi deixado assim porque a prioridade era o visual funcionar. Mas isso vai
> aparecer no Lighthouse e no 4G do cliente.

---

Relacionado: [[Efeitos]] · [[Oryx Capital]]
