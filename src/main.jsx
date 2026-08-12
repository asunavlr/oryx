import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, Menu, X, MoveRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.css';
import ScrollExpand from './components/ScrollExpand';
import AccordionGallery from './components/AccordionGallery';
import MaskedHeading from './components/MaskedHeading';
import { LiquidButton } from './components/ui/liquid-glass-button';
import { Component as LuminaInteractiveList } from './components/ui/lumina-interactive-list';

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  { n: '01', title: 'Wealth Management', text: 'Estratégias patrimoniais desenhadas em torno da sua história, com visão global e atenção radical aos detalhes.' },
  { n: '02', title: 'Asset Management', text: 'Gestão ativa, disciplina analítica e convicção para transformar complexidade em decisões claras.' },
  { n: '03', title: 'Investment Banking', text: 'Capital, estratégia e conexões para empresas que estão prontas para o próximo movimento.' },
  { n: '04', title: 'Corporate Solutions', text: 'Soluções financeiras sob medida para proteger valor, otimizar estruturas e abrir novas possibilidades.' },
];

function App() {
  const root = useRef(null); const [menu, setMenu] = useState(false);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults:{ ease:'power4.out' }});
      intro.from('.nav-inner',{y:-28,opacity:0,duration:.7}).from('.eyebrow',{y:20,opacity:0,duration:.55},'-=.3').from('.hero-line span',{yPercent:120,duration:.9,stagger:.08},'-=.35').from('.hero-foot > *',{y:16,opacity:0,duration:.55,stagger:.08},'-=.35');
      gsap.to('.hero-content',{yPercent:22,opacity:.1,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
      gsap.utils.toArray('.reveal').forEach(el => gsap.from(el,{y:70,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 82%'}}));
      gsap.utils.toArray('.solution').forEach((el,i) => gsap.from(el,{x:i%2?60:-60,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 84%'}}));
      gsap.to('.manifesto-track',{xPercent:-48,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1}});
    }, root);
    return () => ctx.revert();
  }, []);
  const go = id => { setMenu(false); document.querySelector(id)?.scrollIntoView({behavior:'smooth'}); };
  return <div ref={root} className="site-shell">
    <div className="noise"/><div className="glow glow-a"/><div className="glow glow-b"/>
    <nav><div className="nav-inner glass"><button className="brand" onClick={()=>go('#inicio')} aria-label="Início"><span className="brand-mark">O</span><span>ORYX</span></button><div className="desktop-links"><button onClick={()=>go('#visao')}>A Oryx</button><button onClick={()=>go('#solucoes')}>Soluções</button><button onClick={()=>go('#insights')}>Insights</button></div><LiquidButton size="default" onClick={()=>go('#contato')}>Fale conosco <ArrowUpRight size={16}/></LiquidButton><button className="menu-btn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div></nav>
    {menu && <div className="mobile-menu glass"><button onClick={()=>go('#visao')}>A Oryx</button><button onClick={()=>go('#solucoes')}>Soluções</button><button onClick={()=>go('#insights')}>Insights</button><button onClick={()=>go('#contato')}>Contato</button></div>}
    <main>
      <section className="hero" id="inicio"><div className="hero-photo"/><div className="hero-grid"/><div className="hero-content"><p className="eyebrow"><span/> CAPITAL EM MOVIMENTO</p><h1><span className="hero-line"><span>O futuro não se</span></span><span className="hero-line italic"><span>espera.</span></span><span className="hero-line"><span>Se constrói.</span></span></h1><div className="hero-foot"><p>Inteligência para atravessar ciclos.<br/>Estratégia para ir além.</p><button className="round-btn" onClick={()=>go('#visao')} aria-label="Descobrir"><ArrowDown/></button><p className="hero-index">Ribeirão Preto · São Paulo<br/>Brasil · <span>21°10' S</span></p></div></div></section>

      <ScrollExpand src="/images/city.jpg" alt="Vista aérea de São Paulo" title="Visão ampla. Decisões precisas." scrollHint="Role para expandir" useWindowScroll startWidth={38} startHeight={54} mediaZoom={1.28} scrollDistance={1.05} smoothing={0.06}>
        <p className="expand-kicker">A escala muda. A clareza permanece.</p><h2>Patrimônio pede<br/><em>perspectiva.</em></h2>
      </ScrollExpand>

      <section className="vision section" id="visao"><div className="section-kicker reveal">01 — Nossa visão</div><div className="vision-copy reveal"><p className="lead">Patrimônio é mais do que capital.</p><h2>É tempo, escolha<br/>e <em>legado.</em></h2><p className="body-copy">A Oryx nasceu para quem exige mais de uma relação financeira. Unimos profundidade analítica, proximidade e uma visão de longo prazo para criar estratégias que fazem sentido — hoje e em todos os amanhãs.</p></div><div className="stat-card glass reveal"><span>visão</span><strong>360°</strong><p>sobre o seu patrimônio</p></div></section>

      <section className="manifesto"><div className="manifesto-track">CLAREZA · CONVICÇÃO · MOVIMENTO · CLAREZA · CONVICÇÃO · MOVIMENTO ·</div></section>

      <section className="masked-section"><p className="section-kicker">IMAGENS QUE CARREGAM IDEIAS</p><MaskedHeading text="ALÉM DO ÓBVIO" src="/images/facade.jpg" /></section>

      <section className="solutions section" id="solucoes"><div className="solutions-head reveal"><div className="section-kicker">02 — O que fazemos</div><h2>Estratégias únicas para<br/><em>histórias únicas.</em></h2></div><div className="solution-list">{solutions.map((s,i)=><article className="solution" key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p><button aria-label={`Conhecer ${s.title}`}><ArrowUpRight/></button></article>)}</div></section>

      <section className="gallery-section section"><div className="gallery-title reveal"><div className="section-kicker">NOSSO CAMPO DE VISÃO</div><h2>Capital em todas<br/>as suas <em>dimensões.</em></h2></div><AccordionGallery items={[
        {image:'/images/hero.jpg',label:'Wealth',meta:'Patrimônio & legado'},
        {image:'/images/city.jpg',label:'Asset',meta:'Convicção & disciplina'},
        {image:'/images/tower.jpg',label:'Banking',meta:'Estratégia & capital'},
        {image:'/images/night.jpg',label:'Corporate',meta:'Estrutura & movimento'}
      ]} defaultIndex={1} expandRatio={.5} height={610}/></section>

      <LuminaInteractiveList />

      <section className="insights section" id="insights"><div className="insight-visual reveal"><div className="radar"><i/><i/><i/><b/></div><div className="insight-label glass">PERSPECTIVA ORYX<br/><span>AGO · 2026</span></div></div><div className="insight-copy reveal"><div className="section-kicker">03 — Inteligência que circula</div><h2>Ideias para enxergar<br/><em>além do óbvio.</em></h2><p>Análises, cenários e conversas que ajudam você a compreender o presente e antecipar os próximos movimentos.</p><a href="https://www.oryxcapital.com.br/" target="_blank" rel="noreferrer">Explorar nossos insights <MoveRight/></a></div></section>

      <section className="cta section" id="contato"><div className="cta-card glass reveal"><p>O próximo movimento começa aqui.</p><h2>Vamos construir<br/><em>o futuro?</em></h2><a href="https://api.whatsapp.com/send?phone=5516994491194&text=Gostaria%20de%20falar%20com%20um%20assessor." target="_blank" rel="noreferrer">Falar com um especialista <ArrowUpRight/></a></div></section>
    </main>
    <footer><div className="footer-brand"><span className="brand-mark">O</span> ORYX</div><p>Gestora de recursos autorizada pela CVM<br/>e aderente à ANBIMA.</p><div className="social"><a href="https://www.instagram.com/oryx.capital/" aria-label="Instagram">IG</a><a href="https://www.linkedin.com/company/oryx.capital/" aria-label="LinkedIn">IN</a></div><div className="legal">© 2026 Oryx Capital. Todos os direitos reservados. <span>Investimentos envolvem riscos.</span></div></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>);
