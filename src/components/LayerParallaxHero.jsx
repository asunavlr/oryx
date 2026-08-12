import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LayerParallaxHero.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero em camadas com parallax.
 *
 * A ideia toda esta em UMA regra: o titulo nao fica na frente da foto, fica
 * ENTRE as camadas. Existe algo atras dele (o horizonte, lento) e algo na
 * frente (a cidade proxima, rapida). E o que da profundidade de verdade — sem
 * isso o efeito e so uma imagem que desliza.
 *
 * Cada camada tem uma velocidade. Quanto mais perto do observador, mais rapido
 * ela sobe: e assim que o olho le distancia.
 *
 *   ceu        0.06   quase parado, e o infinito
 *   horizonte  0.18
 *   brilho     0.30
 *   TITULO     0.55   ← o texto vive aqui dentro
 *   cidade     0.92   passa por cima do texto
 *   vinheta    1.00   colada na tela
 *   ACIMA      0.55   mesma velocidade do titulo, mas no topo da pilha
 *
 * A camada `acima` existe por um motivo so: a chamada e os botoes nao podem
 * ficar atras da nevoa. Ela anda exatamente junto do titulo (mesma velocidade,
 * mesmo sumico), entao o hero continua se lendo como um bloco unico — a unica
 * diferenca e que a nevoa passa por baixo dela, e nao por cima.
 */
const CAMADAS = [
  { classe: 'ceu', velocidade: 0.06 },
  { classe: 'horizonte', velocidade: 0.18 },
  { classe: 'brilho', velocidade: 0.3 },
  { classe: 'conteudo', velocidade: 0.55 },
  { classe: 'frente', velocidade: 0.92 },
  { classe: 'acima', velocidade: 0.55 },
];

export default function LayerParallaxHero({ children, rodape }) {
  const root = useRef(null);
  const camadaAcima = useRef(null);

  /**
   * O rodape saiu do fluxo do titulo, entao o titulo perderia o espaco que ele
   * ocupava e desceria por cima. Aqui a altura real do rodape vira uma variavel
   * de CSS e volta como padding — medida, nao chutada, porque o bloco muda de
   * altura conforme a fonte carrega e conforme a largura da tela.
   */
  useEffect(() => {
    const alvo = camadaAcima.current?.firstElementChild;
    if (!alvo) return;
    const ro = new ResizeObserver(([entrada]) => {
      root.current?.style.setProperty('--lph-rodape', `${entrada.contentRect.height}px`);
    });
    ro.observe(alvo);
    return () => ro.disconnect();
  }, [rodape]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (parado) return;

      // Parallax de scroll. `ease:'none'` e obrigatorio com scrub — qualquer
      // outra curva faz a camada descolar do dedo do usuario.
      CAMADAS.forEach(({ classe, velocidade }) => {
        gsap.to(`.lph__${classe}`, {
          yPercent: velocidade * 42,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      // O titulo tambem some, mas mais tarde que as camadas: some quando a
      // cidade da frente ja o cobriu, senao pisca no meio da passagem.
      gsap.to(['.lph__conteudo', '.lph__acima'], {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'center top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Entrada.
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('.lph__logo', { y: 26, opacity: 0, duration: 0.9 })
        .from('.lph__eyebrow', { y: 18, opacity: 0, duration: 0.6 }, '-=0.55')
        .from('.lph__linha span', { yPercent: 118, duration: 1, stagger: 0.08 }, '-=0.35')
        .from('.lph__rodape > *', { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.4')
        // `opacity` e `scale`, NUNCA `yPercent`: o parallax de scroll já é dono
        // do `yPercent` desta camada. Duas tweens na mesma propriedade brigam a
        // cada quadro, e o resultado é um salto no primeiro scroll.
        .from('.lph__frente', { opacity: 0, scale: 1.05, duration: 1.4 }, '-=1.1');

      /**
       * Parallax de mouse com `quickTo`.
       *
       * `pointermove` dispara dezenas de vezes por segundo. Um `gsap.to` por
       * evento criaria e destruiria um tween a cada disparo; `quickTo` reusa o
       * mesmo, entao o custo por evento vira quase zero.
       */
      const alvos = CAMADAS.map(({ classe, velocidade }) => ({
        x: gsap.quickTo(`.lph__${classe}`, 'x', { duration: 0.9, ease: 'power3' }),
        y: gsap.quickTo(`.lph__${classe}`, 'y', { duration: 0.9, ease: 'power3' }),
        v: velocidade,
      }));

      const mover = (e) => {
        const px = e.clientX / innerWidth - 0.5;
        const py = e.clientY / innerHeight - 0.5;
        // Sinal invertido: a camada foge do cursor, como se a cena tivesse
        // volume e o observador estivesse andando ao redor dela.
        alvos.forEach(({ x, y, v }) => {
          x(px * -34 * v);
          y(py * -18 * v);
        });
      };

      // `matchMedia` em vez de checar largura: a query se reavalia sozinha, e
      // aparelho de toque nao tem cursor para seguir.
      const mm = matchMedia('(hover: hover) and (pointer: fine)');
      const ligar = () => {
        if (mm.matches) addEventListener('pointermove', mover);
        else removeEventListener('pointermove', mover);
      };
      ligar();
      mm.addEventListener('change', ligar);

      return () => {
        removeEventListener('pointermove', mover);
        mm.removeEventListener('change', ligar);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="lph" id="inicio" ref={root}>
      <div className="lph__ceu" />
      <div className="lph__horizonte" />
      <div className="lph__brilho" />
      <div className="lph__grade" />

      <div className="lph__conteudo">{children}</div>

      {/* A camada da frente é uma faixa recortada, não uma foto inteira: ela
          precisa cobrir só a base do texto, deixando a cabeça dele à vista. */}
      <div className="lph__frente" aria-hidden />
      <div className="lph__vinheta" aria-hidden />

      {/* Última da pilha: a chamada e os botões ficam por cima da névoa. */}
      <div className="lph__acima" ref={camadaAcima}>
        {rodape}
      </div>
    </section>
  );
}
