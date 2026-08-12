import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CelularTresD.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Celular em 3D.
 *
 * Sem WebGL: é CSS `transform-style: preserve-3d` com faces reais. Um aparelho
 * inteiro em three.js custaria centenas de kB e um modelo para carregar, e aqui
 * o objeto é uma caixa arredondada — geometria que o CSS dá de graça.
 *
 * A rotação vem de duas fontes que se somam:
 *   scroll  — gira devagar enquanto a seção passa, para o objeto ter vida
 *   mouse   — a pessoa "pega" o aparelho e olha em volta dele
 */
export default function CelularTresD() {
  const palco = useRef(null);
  const corpo = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (parado) return;

      // Giro de scroll: entra virado e vai se endireitando.
      gsap.fromTo(
        corpo.current,
        { rotateY: -32, rotateX: 14, y: 40 },
        {
          rotateY: 16,
          rotateX: -6,
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: palco.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      // O mouse mexe num wrapper separado do scroll, senão as duas fontes
      // brigariam pela mesma propriedade e o objeto tremeria.
      const rx = gsap.quickTo(palco.current, '--rx', { duration: 0.9, ease: 'power3' });
      const ry = gsap.quickTo(palco.current, '--ry', { duration: 0.9, ease: 'power3' });

      const mover = (e) => {
        const r = palco.current.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 34 + 'deg');
        rx(((e.clientY - r.top) / r.height - 0.5) * -22 + 'deg');
      };
      const sair = () => {
        rx('0deg');
        ry('0deg');
      };

      palco.current.addEventListener('pointermove', mover);
      palco.current.addEventListener('pointerleave', sair);
      return () => {
        palco.current?.removeEventListener('pointermove', mover);
        palco.current?.removeEventListener('pointerleave', sair);
      };
    }, palco);

    return () => ctx.revert();
  }, []);

  return (
    <div className="cel" ref={palco}>
      <div className="cel__corpo" ref={corpo}>
        {/* Faces laterais: é o que dá espessura ao aparelho. Sem elas, girar
            revelaria um retângulo de papel. */}
        <span className="cel__lado cel__lado--esq" aria-hidden />
        <span className="cel__lado cel__lado--dir" aria-hidden />
        <span className="cel__lado cel__lado--topo" aria-hidden />
        <span className="cel__lado cel__lado--base" aria-hidden />

        <div className="cel__tras" aria-hidden />

        <div className="cel__frente">
          <img className="cel__papel" src="/images/rastros.jpg" alt="" aria-hidden />
          <div className="cel__ilha" aria-hidden />

          <div className="cel__ui">
            <p className="cel__label">PATRIMÔNIO CONSOLIDADO</p>
            <strong className="cel__valor">R$ 12.480.900</strong>
            <p className="cel__delta">+8,4% no ano</p>

            <div className="cel__barras" aria-hidden>
              {[38, 52, 44, 66, 58, 80, 72].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
            </div>

            <div className="cel__linhas" aria-hidden>
              <div>
                <span>Renda fixa</span>
                <b>42%</b>
              </div>
              <div>
                <span>Ações</span>
                <b>28%</b>
              </div>
              <div>
                <span>Global</span>
                <b>30%</b>
              </div>
            </div>
          </div>

          {/* Reflexo de vidro varrendo a tela: é o detalhe que faz a peça
              parecer um objeto e não um print. */}
          <span className="cel__reflexo" aria-hidden />
        </div>
      </div>

      <div className="cel__sombra" aria-hidden />
    </div>
  );
}
