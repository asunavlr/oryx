import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import './MenuCortina.css';

const LINKS = [
  {
    n: '01',
    rotulo: 'Sobre Nós',
    alvo: '#sobre',
    nota: 'Quem somos e por que existimos',
    img: '/images/convergencia.jpg',
  },
  {
    n: '02',
    rotulo: 'Serviços',
    alvo: '#solucoes',
    nota: 'Wealth, Asset, Banking e Corporate',
    img: '/images/geometria.jpg',
  },
  {
    n: '03',
    rotulo: 'Wealth',
    alvo: '#wealth',
    nota: 'Patrimônio, sucessão e alocação global',
    img: '/images/vidro.jpg',
  },
  {
    n: '04',
    rotulo: 'Aplicativo',
    alvo: '#app',
    nota: 'Sua posição consolidada, a qualquer hora',
    img: '/images/rastros.jpg',
  },
  {
    n: '05',
    rotulo: 'Insights',
    alvo: '#insights',
    nota: 'Análises e cenários da mesa',
    img: '/images/aereo.jpg',
  },
  {
    n: '06',
    rotulo: 'Contato',
    alvo: '#contato',
    nota: 'Falar com um assessor',
    img: '/images/horizonte.jpg',
  },
];

/**
 * Navegação: só a logo e o botão. Os links vivem numa cortina de tela cheia.
 *
 * A barra flutuante de vidro que existia antes cortava o hero em dois e roubava
 * a primeira linha do título. Aqui o topo da página não tem nada além da marca —
 * que é o que uma capa deveria ter.
 */
export default function MenuCortina({ aoIr, aoAbrirContato }) {
  const [aberto, setAberto] = useState(false);
  const [sobre, setSobre] = useState(0);
  const cortina = useRef(null);
  const tl = useRef(null);
  const focoAnterior = useRef(null);

  // A timeline é criada UMA vez e depois só toca para frente ou para trás.
  // Recriar a cada toggle perderia o estado intermediário e travaria no meio.
  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power4.inOut' } })
        // `cortina.current` e nao '.cortina': o escopo do `gsap.context` busca
        // entre os DESCENDENTES do ref, e a cortina e o proprio ref. Com o
        // seletor, a timeline ficava sem alvo e o painel nunca descia.
        .fromTo(
          '.cortina__item',
          { y: 80, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.055, ease: 'power4.out' },
          0.18
        )
        .fromTo('.cortina__pe', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, 0.4);
    }, cortina);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (aberto) {
      focoAnterior.current = document.activeElement;
      tl.current?.play();
      // Trava a rolagem sem `overflow:hidden` no body: aqui isso quebraria os
      // pinos do ScrollTrigger na página inteira.
      document.documentElement.style.scrollbarGutter = 'stable';
      document.body.style.touchAction = 'none';
    } else {
      tl.current?.reverse();
      document.body.style.touchAction = '';
    }
  }, [aberto]);

  useEffect(() => {
    const tecla = (e) => {
      if (e.key === 'Escape' && aberto) setAberto(false);
    };
    addEventListener('keydown', tecla);
    return () => removeEventListener('keydown', tecla);
  }, [aberto]);

  const ir = (alvo) => {
    setAberto(false);
    // Espera a cortina subir antes de rolar, senão a pessoa vê a página se
    // mexendo por trás de um painel que ainda está fechando.
    setTimeout(() => aoIr(alvo), 420);
  };

  return (
    <>
      <header className="topo">
        <button className="topo__marca" onClick={() => aoIr('#inicio')} aria-label="Início">
          <img src="/oryx-logo.png" alt="Oryx Capital" />
        </button>

        <button
          className="topo__menu"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="cortina-menu"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        >
          <span>{aberto ? 'Fechar' : 'Menu'}</span>
          {aberto ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div
        className={`cortina ${aberto ? 'cortina--aberta' : ''}`}
        id="cortina-menu"
        ref={cortina}
        role="dialog"
        aria-modal="true"
        aria-label="Navegação"
        aria-hidden={!aberto}
        // `inert` tira a cortina fechada da ordem de Tab e do leitor de tela.
        // Sem isso, tabular na página cai dentro de um painel invisível.
        inert={!aberto}
      >
        <div className="cortina__corpo">
          <nav className="cortina__lista">
            {LINKS.map((l, i) => (
              <div className="cortina__slot" key={l.alvo}>
                <button
                  className={`cortina__item ${sobre === i ? 'esta-sobre' : ''}`}
                  onClick={() => ir(l.alvo)}
                  onMouseEnter={() => setSobre(i)}
                  onFocus={() => setSobre(i)}
                >
                  <span className="cortina__n">{l.n}</span>
                  <span className="cortina__rot">{l.rotulo}</span>
                  <span className="cortina__nota">{l.nota}</span>
                </button>
              </div>
            ))}
          </nav>

          {/* Prévia que troca com o item sob o cursor. Dá corpo ao painel e
              adianta o que a pessoa vai encontrar lá embaixo. */}
          <div className="cortina__previa" aria-hidden>
            {LINKS.map((l, i) => (
              <img
                key={l.alvo}
                src={l.img}
                alt=""
                className={sobre === i ? 'ativa' : ''}
              />
            ))}
            <span className="cortina__previaRot">{LINKS[sobre].rotulo}</span>
          </div>
        </div>

        <div className="cortina__pe">
          <div>
            <p className="cortina__label">Fale com a gente</p>
            <button
              className="cortina__cta"
              onClick={() => {
                setAberto(false);
                setTimeout(aoAbrirContato, 420);
              }}
            >
              Solicitar consulta
            </button>
          </div>
          <div className="cortina__contato">
            <a href="tel:+5516994491194">(16) 99449-1194</a>
            <a href="mailto:contato@oryxcapital.com.br">contato@oryxcapital.com.br</a>
            <p>Ribeirão Preto · São Paulo · Brasil</p>
          </div>
        </div>
      </div>
    </>
  );
}
