import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, MoveRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.css';
import LayerParallaxHero from './components/LayerParallaxHero';
import MenuCortina from './components/MenuCortina';
import ModalContato from './components/ModalContato';
import ScrollExpand from './components/ScrollExpand';
import AccordionGallery from './components/AccordionGallery';
import MaskedHeading from './components/MaskedHeading';
import CtaFinal from './components/CtaFinal';
import CelularTresD from './components/CelularTresD';
import { Component as LuminaInteractiveList } from './components/ui/lumina-interactive-list';

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    n: '01',
    title: 'Wealth Management',
    text: 'Estratégias patrimoniais desenhadas em torno da sua história, com visão global e atenção radical aos detalhes.',
    img: '/images/vidro.jpg',
  },
  {
    n: '02',
    title: 'Asset Management',
    text: 'Gestão ativa, disciplina analítica e convicção para transformar complexidade em decisões claras.',
    img: '/images/aereo.jpg',
  },
  {
    n: '03',
    title: 'Investment Banking',
    text: 'Capital, estratégia e conexões para empresas que estão prontas para o próximo movimento.',
    img: '/images/tower.jpg',
  },
  {
    n: '04',
    title: 'Corporate Solutions',
    text: 'Soluções financeiras sob medida para proteger valor, otimizar estruturas e abrir novas possibilidades.',
    img: '/images/geometria.jpg',
  },
];

const insights = [
  {
    tema: 'Macro',
    data: 'AGO · 2026',
    titulo: 'Juro alto por mais tempo: o que muda na carteira',
    resumo:
      'Quando o ciclo se alonga, prazo deixa de ser detalhe e vira decisão. O que revisar antes do próximo trimestre.',
    img: '/images/aereo.jpg',
  },
  {
    tema: 'Câmbio',
    data: 'JUL · 2026',
    titulo: 'Dólar na carteira não é aposta, é estrutura',
    resumo:
      'A diferença entre proteger patrimônio e tentar acertar o câmbio — e por que só a primeira se sustenta no tempo.',
    img: '/images/geometria.jpg',
  },
  {
    tema: 'Sucessão',
    data: 'JUL · 2026',
    titulo: 'O custo de adiar o planejamento sucessório',
    resumo:
      'Inventário, tributo e tempo. Três números que costumam surpreender quem deixou a conversa para depois.',
    img: '/images/convergencia.jpg',
  },
];

function App() {
  const root = useRef(null);
  const [contato, setContato] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!parado) {
        gsap.utils.toArray('.reveal').forEach((el) =>
          gsap.from(el, {
            y: 70,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
          })
        );

        gsap.utils.toArray('.solution').forEach((el, i) =>
          gsap.from(el, {
            x: i % 2 ? 60 : -60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 84%', once: true },
          })
        );

        gsap.to('.manifesto-track', {
          xPercent: -48,
          ease: 'none',
          scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });

        // Parallax das fotos de seção: a imagem anda mais devagar que o bloco,
        // então o recorte parece uma janela e não um adesivo.
        gsap.utils.toArray('.foto-parallax').forEach((el) =>
          gsap.fromTo(
            el,
            { yPercent: -9 },
            {
              yPercent: 9,
              ease: 'none',
              scrollTrigger: {
                trigger: el.closest('.tem-foto') || el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        );
      }

      /**
       * Rede de segurança contra a armadilha número um do ScrollTrigger: ele
       * pré-calcula start/end uma vez, por performance. Fonte que carrega
       * depois, imagem que chega e muda a altura — nada disso o avisa.
       *
       * Sem isso, o sintoma clássico: funciona no primeiro load e erra depois.
       */
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      const refresh = () => ScrollTrigger.refresh();
      addEventListener('load', refresh);
      return () => removeEventListener('load', refresh);
    }, root);

    return () => ctx.revert();
  }, []);

  const go = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div ref={root} className="site-shell">
      <div className="noise" />
      <div className="glow glow-a" />
      <div className="glow glow-b" />

      <MenuCortina aoIr={go} aoAbrirContato={() => setContato(true)} />

      <main>
        <LayerParallaxHero>
          <p className="lph__eyebrow">
            <i />
            CAPITAL EM MOVIMENTO
          </p>
          <h1>
            <span className="lph__linha">
              <span>O futuro não se</span>
            </span>
            <span className="lph__linha italic">
              <span>espera.</span>
            </span>
            <span className="lph__linha">
              <span>Se constrói.</span>
            </span>
          </h1>
          <div className="lph__rodape">
            <p>
              Inteligência para atravessar ciclos.
              <br />
              Estratégia para ir além.
            </p>
            <button className="round-btn" onClick={() => go('#sobre')} aria-label="Descobrir">
              <ArrowDown />
            </button>
            <p className="lph__indice">
              Ribeirão Preto · São Paulo
              <br />
              Brasil · <span>21°10&#39; S</span>
            </p>
          </div>
        </LayerParallaxHero>

        <ScrollExpand
          src="/images/horizonte.jpg"
          alt="Cidade ao anoitecer, vista do alto"
          title="Além do horizonte."
          scrollHint="Role para expandir"
          larguraInicial={38}
          alturaInicial={54}
          zoomInicial={1.3}
          distancia={1.15}
        >
          <p className="expand-kicker">A escala muda. A clareza permanece.</p>
          <h2>
            Patrimônio pede
            <br />
            <em>perspectiva.</em>
          </h2>
        </ScrollExpand>

        <section className="vision section tem-foto" id="sobre">
          <div className="section-kicker reveal">01 — Nossa visão</div>
          <div className="vision-copy reveal">
            <p className="lead">Patrimônio é mais do que capital.</p>
            <h2>
              É tempo, escolha
              <br />e <em>legado.</em>
            </h2>
            <p className="body-copy">
              A Oryx nasceu para quem exige mais de uma relação financeira. Unimos
              profundidade analítica, proximidade e uma visão de longo prazo para criar
              estratégias que fazem sentido — hoje e em todos os amanhãs.
            </p>
          </div>
          <div className="vision-lado">
            <div className="vision-foto reveal">
              <img className="foto-parallax" src="/images/convergencia.jpg" alt="" aria-hidden />
            </div>
            <div className="stat-card glass reveal">
              <span>visão</span>
              <strong>360°</strong>
              <p>sobre o seu patrimônio</p>
            </div>
          </div>
        </section>

        <section className="manifesto">
          <div className="manifesto-track">
            CLAREZA · CONVICÇÃO · MOVIMENTO · CLAREZA · CONVICÇÃO · MOVIMENTO ·
          </div>
        </section>

        <section className="masked-section">
          <p className="section-kicker">IMAGENS QUE CARREGAM IDEIAS</p>
          <MaskedHeading text="ALÉM DO ÓBVIO" src="/images/facade.jpg" />

          {/* A seção era só o título recortado e um kicker — muito ar para
              pouca coisa. Estes três números dão a ela o que dizer. */}
          <div className="numeros">
            <div className="numero reveal">
              <strong>2016</strong>
              <p>ano em que a Oryx começou, em Ribeirão Preto</p>
            </div>
            <div className="numero reveal">
              <strong>4</strong>
              <p>frentes: Wealth, Asset, Investment Banking e Corporate</p>
            </div>
            <div className="numero reveal">
              <strong>CVM</strong>
              <p>gestora autorizada e aderente à ANBIMA</p>
            </div>
          </div>
        </section>

        {/* ---------- Wealth ---------- */}
        <section className="wealth section tem-foto" id="wealth">
          <div className="wealth-foto reveal">
            <img className="foto-parallax" src="/images/vidro.jpg" alt="" aria-hidden />
          </div>
          <div className="wealth-copy reveal">
            <div className="section-kicker">03 — Wealth</div>
            <h2>
              Um assessor que
              <br />
              <em>conhece a sua história.</em>
            </h2>
            <p>
              Não vendemos produto de prateleira. A carteira nasce de uma conversa
              sobre o que você quer proteger, o que quer construir e em quanto tempo.
            </p>
            <ul className="wealth-lista">
              <li>Planejamento patrimonial e sucessório</li>
              <li>Alocação global, com moeda forte</li>
              <li>Relatórios claros, sem letra miúda</li>
              <li>Um interlocutor só, do começo ao fim</li>
            </ul>
            <button className="link-seta" onClick={() => setContato(true)}>
              Falar sobre a minha carteira <ArrowUpRight size={16} />
            </button>
          </div>
        </section>

        {/* ---------- Aplicativo ---------- */}
        <section className="app section" id="app">
          <div className="app-copy reveal">
            <div className="section-kicker">04 — Aplicativo</div>
            <h2>
              O seu patrimônio
              <br />
              <em>na palma da mão.</em>
            </h2>
            <p>
              Posição consolidada, rentabilidade real e os documentos onde você
              precisa que estejam: com você, a qualquer hora.
            </p>
            <div className="app-itens">
              <div>
                <strong>Consolidado</strong>
                <span>Tudo em uma tela, sem planilha</span>
              </div>
              <div>
                <strong>Rentabilidade</strong>
                <span>Comparada ao índice que importa</span>
              </div>
              <div>
                <strong>Documentos</strong>
                <span>Informe de rendimentos e extratos</span>
              </div>
            </div>
          </div>
          <div className="app-visual reveal">
            <CelularTresD />
          </div>
        </section>

        <section className="solutions section" id="solucoes">
          <div className="solutions-head reveal">
            <div className="section-kicker">02 — O que fazemos</div>
            <h2>
              Estratégias únicas para
              <br />
              <em>histórias únicas.</em>
            </h2>
          </div>
          <div className="solution-list">
            {solutions.map((s) => (
              <article className="solution" key={s.n}>
                {/* A foto só aparece no hover, dentro da própria linha: dá corpo
                    à lista sem transformá-la numa grade de cartões. */}
                <span className="solution-foto" style={{ backgroundImage: `url(${s.img})` }} />
                <span className="solution-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <button aria-label={`Conhecer ${s.title}`}>
                  <ArrowUpRight />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section section">
          <div className="gallery-title reveal">
            <div className="section-kicker">NOSSO CAMPO DE VISÃO</div>
            <h2>
              Capital em todas
              <br />
              as suas <em>dimensões.</em>
            </h2>
          </div>
          <AccordionGallery
            items={[
              { image: '/images/hero.jpg', label: 'Wealth', meta: 'Patrimônio & legado' },
              { image: '/images/rastros.jpg', label: 'Asset', meta: 'Convicção & disciplina' },
              { image: '/images/tower.jpg', label: 'Banking', meta: 'Estratégia & capital' },
              { image: '/images/aereo.jpg', label: 'Corporate', meta: 'Estrutura & movimento' },
              { image: '/images/night.jpg', label: 'Global', meta: 'Alcance & conexão' },
            ]}
            defaultIndex={1}
            expandRatio={0.5}
            height={610}
          />
        </section>

        <LuminaInteractiveList />

        <section className="insights section" id="insights">
          <div className="insights-head reveal">
            <div className="section-kicker">05 — Inteligência que circula</div>
            <h2>
              Ideias para enxergar
              <br />
              <em>além do óbvio.</em>
            </h2>
            <a href="https://www.oryxcapital.com.br/" target="_blank" rel="noreferrer noopener">
              Ver todas <MoveRight size={16} />
            </a>
          </div>

          <div className="insight-grade">
            {insights.map((i) => (
              <article className="insight-card reveal" key={i.titulo}>
                <div className="insight-foto">
                  <img src={i.img} alt="" aria-hidden />
                </div>
                <div className="insight-meta">
                  <span className="insight-tema">{i.tema}</span>
                  <span className="insight-data">{i.data}</span>
                </div>
                <h3>{i.titulo}</h3>
                <p>{i.resumo}</p>
                <span className="insight-ler">
                  Ler <ArrowUpRight size={14} />
                </span>
              </article>
            ))}
          </div>
        </section>

        <CtaFinal aoAbrirContato={() => setContato(true)} />
      </main>

      <ModalContato aberto={contato} aoFechar={() => setContato(false)} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
