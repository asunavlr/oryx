import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './MaskedHeading.css';

/**
 * Título recortado em foto: as letras são a janela por onde a imagem aparece.
 *
 * A versão anterior ficava invisível. O motivo: o `background-clip: text` estava
 * no <h2>, mas o texto morava num <span> com `will-change: transform` que o GSAP
 * ainda transformava a cada movimento do mouse. Isso promove o span a uma camada
 * de composição própria — e o recorte do pai não alcança dentro dela. Sem
 * glifos para recortar, nada é pintado, e como a cor é transparente, o título
 * simplesmente some.
 *
 * Agora o recorte vive no MESMO elemento que tem o texto, e o parallax move a
 * `background-position` em vez do elemento. Além de não quebrar, o efeito fica
 * melhor: a foto desliza POR DENTRO das letras, que é a graça da coisa.
 */
export default function MaskedHeading({ text, src, className = '', trigger = 'view' }) {
  const root = useRef(null);
  const letras = useRef(null);

  // Entrada: a máscara abre da esquerda para a direita.
  useEffect(() => {
    const el = root.current;
    const entrar = () =>
      gsap.fromTo(
        el,
        { clipPath: 'inset(0 100% 0 0)', y: 35 },
        { clipPath: 'inset(0 0% 0 0)', y: 0, duration: 1.35, ease: 'power4.inOut' }
      );

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (trigger === 'mount') return void entrar();

    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          entrar();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

  // Parallax da foto dentro das letras.
  useEffect(() => {
    const el = root.current;
    const alvo = letras.current;
    if (!el || !alvo) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    // Anima variáveis CSS: é o que permite mexer na `background-position` sem
    // recalcular estilo composto a cada quadro.
    const px = gsap.quickTo(alvo, '--bx', { duration: 0.8, ease: 'power3' });
    const py = gsap.quickTo(alvo, '--by', { duration: 0.8, ease: 'power3' });

    const mover = (e) => {
      const r = el.getBoundingClientRect();
      px(((e.clientX - r.left) / r.width - 0.5) * -46 + 'px');
      py(((e.clientY - r.top) / r.height - 0.5) * -26 + 'px');
    };
    el.addEventListener('pointermove', mover);
    return () => el.removeEventListener('pointermove', mover);
  }, []);

  return (
    <h2 ref={root} className={`masked-heading ${className}`}>
      <span ref={letras} style={{ '--foto': `url(${src})` }}>
        {text}
      </span>
    </h2>
  );
}
