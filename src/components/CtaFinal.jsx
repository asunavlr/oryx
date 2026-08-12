import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import './CtaFinal.css';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP =
  'https://api.whatsapp.com/send?phone=5516994491194&text=Gostaria%20de%20falar%20com%20um%20assessor.';

/**
 * Fechamento da página.
 *
 * Substitui o rodapé antigo. O rodapé de três colunas com "IG / IN" e um aviso
 * legal em 10px era o único bloco da página que não tinha desenho nenhum — e
 * era a última coisa que a pessoa via. Aqui a informação obrigatória continua
 * (CVM, ANBIMA, aviso de risco, redes), mas dentro do fechamento, subordinada à
 * chamada, e não como um bloco solto e cinza no fim.
 */
export default function CtaFinal({ aoAbrirContato }) {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // A foto respira para dentro enquanto a seção passa. Escala pequena
      // (1.14 → 1) porque aqui o assunto é o texto, não a imagem.
      gsap.fromTo(
        '.cta__foto',
        { scale: 1.14, yPercent: -4 },
        {
          scale: 1,
          yPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      gsap.from('.cta__reveal', {
        y: 44,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: 'top 68%', once: true },
      });

      // O halo segue o cursor dentro do cartão. `quickTo` porque `pointermove`
      // dispara muito; criar um tween por evento seria desperdício.
      const cartao = root.current.querySelector('.cta__cartao');
      const halo = root.current.querySelector('.cta__halo');
      const paraX = gsap.quickTo(halo, 'x', { duration: 0.7, ease: 'power3' });
      const paraY = gsap.quickTo(halo, 'y', { duration: 0.7, ease: 'power3' });

      const mover = (e) => {
        const r = cartao.getBoundingClientRect();
        paraX(e.clientX - r.left - r.width / 2);
        paraY(e.clientY - r.top - r.height / 2);
      };
      const entrar = () => gsap.to(halo, { opacity: 1, duration: 0.4 });
      const sair = () => gsap.to(halo, { opacity: 0, duration: 0.5 });

      const mm = matchMedia('(hover: hover) and (pointer: fine)');
      if (mm.matches) {
        cartao.addEventListener('pointermove', mover);
        cartao.addEventListener('pointerenter', entrar);
        cartao.addEventListener('pointerleave', sair);
      }
      return () => {
        cartao.removeEventListener('pointermove', mover);
        cartao.removeEventListener('pointerenter', entrar);
        cartao.removeEventListener('pointerleave', sair);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cta" id="contato" ref={root}>
      <div className="cta__fundo" aria-hidden>
        <div className="cta__foto" />
        <div className="cta__veu" />
      </div>

      <div className="cta__cartao">
        <div className="cta__halo" aria-hidden />

        <p className="cta__kicker cta__reveal">
          <i />O próximo movimento começa aqui
        </p>

        <h2 className="cta__reveal">
          Vamos construir
          <br />
          <em>o futuro?</em>
        </h2>

        <p className="cta__linha cta__reveal">
          Uma conversa é o suficiente para entender se fazemos sentido para a sua
          história.
        </p>

        <div className="cta__acoes cta__reveal">
          {/* Abre o formulário em vez de jogar direto no WhatsApp: assim a
              conversa chega com nome, perfil e faixa já preenchidos. */}
          <button type="button" className="cta__botao" onClick={aoAbrirContato}>
            <span>Falar com um especialista</span>
            <ArrowUpRight size={18} />
          </button>
          <a className="cta__link" href={WHATSAPP} target="_blank" rel="noreferrer noopener">
            ou chamar direto no WhatsApp
          </a>
        </div>

        <div className="cta__base cta__reveal">
          <img className="cta__logo" src="/oryx-logo.png" alt="Oryx Capital" />

          <div className="cta__meta">
            <p>
              Gestora de recursos autorizada pela CVM e aderente à ANBIMA.
              <br />
              Ribeirão Preto · São Paulo · Brasil
            </p>
            <p className="cta__risco">
              Rentabilidade passada não representa garantia de resultado futuro.
              Investimentos envolvem riscos.
            </p>
          </div>

          <div className="cta__redes">
            <a
              href="https://www.instagram.com/oryx.capital/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/oryx.capital/"
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn
            </a>
            <span>© {new Date().getFullYear()} Oryx Capital</span>
          </div>
        </div>
      </div>
    </section>
  );
}
