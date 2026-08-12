import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollExpand.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Imagem que abre de um retângulo pequeno até a tela inteira conforme se rola.
 *
 * A versão anterior usava `position: sticky` mais um laço de rAF próprio. Não
 * funcionava — e não por culpa dela: `overflow:hidden` num ancestral transforma
 * aquele ancestral em contêiner de rolagem, e o `sticky` passa a grudar num
 * contêiner que nunca rola. Silencioso e difícil de achar.
 *
 * Aqui o pino é do `ScrollTrigger`, que não depende de `sticky`: ele mede a
 * posição e aplica `position:fixed` por conta própria. Some a classe inteira de
 * bug, e de quebra o laço de quadro passa a ser o mesmo do resto do site.
 *
 * O movimento é um `clip-path: inset()` que vai fechando, e um `scale` que vai
 * a 1: a foto começa ampliada e *desamplia* enquanto a moldura abre. As duas
 * coisas juntas dão a sensação de recuar a câmera.
 */
export default function ScrollExpand({
  src = '',
  alt = '',
  title = '',
  scrollHint = '',
  larguraInicial = 38,
  alturaInicial = 54,
  raioInicial = 26,
  raioFinal = 0,
  zoomInicial = 1.3,
  /** quantas telas de rolagem o efeito consome */
  distancia = 1.1,
  scrimFinal = 0.5,
  children,
  className = '',
}) {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const quadro = root.current.querySelector('.se__quadro');
      const media = root.current.querySelector('.se__media');
      const scrim = root.current.querySelector('.se__scrim');
      const titulo = root.current.querySelector('.se__titulo');
      const dica = root.current.querySelector('.se__dica');
      const overlay = root.current.querySelector('.se__overlay');

      const recorte = (p) => {
        const l = larguraInicial + (100 - larguraInicial) * p;
        const a = alturaInicial + (100 - alturaInicial) * p;
        const r = raioInicial + (raioFinal - raioInicial) * p;
        return `inset(${(100 - a) / 2}% ${(100 - l) / 2}% ${(100 - a) / 2}% ${
          (100 - l) / 2
        }% round ${r}px)`;
      };

      gsap.set(quadro, { clipPath: recorte(0) });
      gsap.set(media, { scale: zoomInicial });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${innerHeight * distancia}`,
          scrub: 0.6,
          pin: '.se__palco',
          pinSpacing: true,
          anticipatePin: 1,
          // Sem isso, valores em px calculados na criação ficam presos e o
          // efeito sai do lugar quando a janela muda de tamanho.
          invalidateOnRefresh: true,
        },
      });

      // `ease:'none'` em tudo que tem scrub: o progresso já é o scroll, e uma
      // curva por cima faria a imagem parecer atrasada em relação ao dedo.
      tl.fromTo(
        quadro,
        { clipPath: recorte(0) },
        { clipPath: recorte(1), ease: 'none', duration: 1 },
        0
      )
        .to(media, { scale: 1, ease: 'none', duration: 1 }, 0)
        .to(scrim, { opacity: scrimFinal, ease: 'none', duration: 1 }, 0);

      if (titulo) {
        tl.to(titulo, { opacity: 0, y: -30, scale: 1.06, ease: 'none', duration: 0.48 }, 0.4);
      }
      if (dica) tl.to(dica, { opacity: 0, ease: 'none', duration: 0.12 }, 0);
      if (overlay) {
        tl.fromTo(
          overlay,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.32 },
          0.68
        );
      }
    }, root);

    return () => ctx.revert();
  }, [larguraInicial, alturaInicial, raioInicial, raioFinal, zoomInicial, distancia, scrimFinal]);

  return (
    <section ref={root} className={`se ${className}`}>
      <div className="se__palco">
        <div className="se__quadro">
          <img className="se__media" src={src} alt={alt} />
          <div className="se__scrim" />
          <div className="se__overlay">{children}</div>
        </div>
        {title && <div className="se__titulo">{title}</div>}
        {scrollHint && <div className="se__dica">{scrollHint}</div>}
      </div>
    </section>
  );
}
