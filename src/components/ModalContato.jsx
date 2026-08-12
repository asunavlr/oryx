import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Check, X } from 'lucide-react';
import './ModalContato.css';

const PERFIS = ['Pessoa física', 'Empresa', 'Representante'];
const FAIXAS = ['Até R$ 500 mil', 'R$ 500 mil a R$ 2 mi', 'R$ 2 mi a R$ 10 mi', 'Acima de R$ 10 mi'];

const vazio = { nome: '', email: '', telefone: '', perfil: '', faixa: '', mensagem: '' };

/**
 * Modal de contato em vidro.
 *
 * O formulário não envia para lugar nenhum ainda — não existe backend. Em vez
 * de fingir um "enviado com sucesso" que não aconteceu, ele monta a mensagem e
 * abre o WhatsApp da Oryx com tudo preenchido. É o mesmo canal que o site atual
 * usa, e a pessoa vê exatamente o que está mandando.
 */
export default function ModalContato({ aberto, aoFechar }) {
  const [dados, setDados] = useState(vazio);
  const [erros, setErros] = useState({});
  const [enviado, setEnviado] = useState(false);
  const painel = useRef(null);
  const raiz = useRef(null);
  const focoAnterior = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power4.out' } })
        .fromTo('.mc__veu', { opacity: 0 }, { opacity: 1, duration: 0.35 })
        .fromTo(
          '.mc__painel',
          { opacity: 0, y: 34, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 },
          '-=0.22'
        )
        .fromTo(
          '.mc__campo, .mc__acoes',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.035 },
          '-=0.3'
        );
    }, raiz);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!tl.current) return;
    if (aberto) {
      focoAnterior.current = document.activeElement;
      tl.current.play();
      const t = setTimeout(() => painel.current?.querySelector('input')?.focus({ preventScroll: true }), 380);
      return () => clearTimeout(t);
    }
    tl.current.reverse();
    focoAnterior.current?.focus?.();
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const tecla = (e) => {
      if (e.key === 'Escape') aoFechar();
      if (e.key !== 'Tab') return;
      // Trava de foco: sem isto o Tab sai do modal e vai passear pela página
      // que está atrás, o que confunde teclado e leitor de tela.
      const focaveis = painel.current.querySelectorAll(
        'input, select, textarea, button, a[href]'
      );
      if (!focaveis.length) return;
      const primeiroEl = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiroEl) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiroEl.focus();
      }
    };
    addEventListener('keydown', tecla);
    return () => removeEventListener('keydown', tecla);
  }, [aberto, aoFechar]);

  const setar = (campo) => (e) => {
    setDados((d) => ({ ...d, [campo]: e.target.value }));
    setErros((x) => ({ ...x, [campo]: undefined }));
  };

  function validar() {
    const e = {};
    if (dados.nome.trim().length < 2) e.nome = 'Diga seu nome';
    // Validação deliberadamente frouxa: o objetivo é pegar erro de digitação,
    // não policiar o que é um e-mail válido — essa regra completa é enorme e
    // rejeita endereços legítimos.
    if (!/^\S+@\S+\.\S{2,}$/.test(dados.email)) e.email = 'E-mail inválido';
    const digitos = dados.telefone.replace(/\D/g, '');
    if (digitos && (digitos.length < 10 || digitos.length > 13)) e.telefone = 'Telefone incompleto';
    return e;
  }

  function enviar(ev) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length) {
      // Leva o foco ao primeiro campo com erro: rolar atrás do erro é trabalho
      // do sistema, não do usuário.
      painel.current
        .querySelector(`[name="${Object.keys(e)[0]}"]`)
        ?.focus({ preventScroll: true });
      return;
    }

    const linhas = [
      'Olá, vim pelo site da Oryx.',
      '',
      `Nome: ${dados.nome}`,
      `E-mail: ${dados.email}`,
      dados.telefone && `Telefone: ${dados.telefone}`,
      dados.perfil && `Perfil: ${dados.perfil}`,
      dados.faixa && `Patrimônio: ${dados.faixa}`,
      dados.mensagem && `\n${dados.mensagem}`,
    ].filter(Boolean);

    setEnviado(true);
    window.open(
      `https://api.whatsapp.com/send?phone=5516994491194&text=${encodeURIComponent(
        linhas.join('\n')
      )}`,
      '_blank',
      'noopener'
    );
  }

  function fechar() {
    aoFechar();
    // Só limpa depois da animação de saída, senão o formulário se esvazia na
    // frente da pessoa enquanto o painel ainda está visível.
    setTimeout(() => {
      setEnviado(false);
      setDados(vazio);
      setErros({});
    }, 500);
  }

  return (
    <div
      ref={raiz}
      className={`mc ${aberto ? 'mc--aberto' : ''}`}
      aria-hidden={!aberto}
      inert={!aberto}
    >
      <div className="mc__veu" onClick={fechar} />

      <div
        className="mc__painel"
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mc-titulo"
      >
        {/* O filtro de vidro é o mesmo da LiquidButton: turbulência deslocando
            o que está atrás. É o que dá a distorção líquida na borda. */}
        <svg className="mc__filtro" aria-hidden>
          <defs>
            <filter id="mc-glass" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="2" seed="7" result="ruido" />
              <feGaussianBlur in="ruido" stdDeviation="3" result="ruidoSuave" />
              <feDisplacementMap in="SourceGraphic" in2="ruidoSuave" scale="42" xChannelSelector="R" yChannelSelector="B" />
            </filter>
          </defs>
        </svg>
        <span className="mc__vidro" aria-hidden />
        <span className="mc__brilho" aria-hidden />

        <button className="mc__fechar" onClick={fechar} aria-label="Fechar">
          <X size={18} />
        </button>

        {/* O que rola é este wrapper, não o painel. Com o painel rolando, o
            vidro (`position:absolute; inset:0`) cobria só a altura inicial e o
            conteúdo escapava por baixo dele. */}
        <div className="mc__conteudo">
        {enviado ? (
          <div className="mc__ok">
            <span className="mc__okIcone">
              <Check size={26} />
            </span>
            <h3>Abrimos o WhatsApp para você</h3>
            <p>
              Sua mensagem já foi montada com os dados preenchidos. Se a janela não
              abriu, o bloqueador de pop-up pode ter barrado —{' '}
              <a
                href="https://api.whatsapp.com/send?phone=5516994491194"
                target="_blank"
                rel="noreferrer noopener"
              >
                abrir manualmente
              </a>
              .
            </p>
            <button className="mc__voltar" onClick={fechar}>
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate>
            <p className="mc__kicker">
              <i />
              Solicitar consulta
            </p>
            <h3 id="mc-titulo">
              Vamos falar sobre
              <br />
              <em>o seu patrimônio.</em>
            </h3>
            <p className="mc__sub">
              Um assessor entra em contato. Sem compromisso e sem script pronto.
            </p>

            <div className="mc__grade">
              <Campo
                nome="nome"
                rotulo="Nome completo"
                valor={dados.nome}
                aoMudar={setar('nome')}
                erro={erros.nome}
                autoComplete="name"
              />
              <Campo
                nome="email"
                tipo="email"
                rotulo="E-mail"
                valor={dados.email}
                aoMudar={setar('email')}
                erro={erros.email}
                autoComplete="email"
              />
              <Campo
                nome="telefone"
                tipo="tel"
                rotulo="Telefone"
                valor={dados.telefone}
                aoMudar={setar('telefone')}
                erro={erros.telefone}
                autoComplete="tel"
                opcional
              />

              <label className="mc__campo">
                <span className="mc__rotulo">Perfil</span>
                <select value={dados.perfil} onChange={setar('perfil')} name="perfil">
                  <option value="">Selecione</option>
                  {PERFIS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mc__campo mc__campo--largo">
                <span className="mc__rotulo">Patrimônio investido</span>
                <select value={dados.faixa} onChange={setar('faixa')} name="faixa">
                  <option value="">Prefiro não informar</option>
                  {FAIXAS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mc__campo mc__campo--largo">
                <span className="mc__rotulo">
                  Mensagem <em>opcional</em>
                </span>
                <textarea
                  rows={3}
                  name="mensagem"
                  value={dados.mensagem}
                  onChange={setar('mensagem')}
                  placeholder="O que você gostaria de resolver?"
                />
              </label>
            </div>

            <div className="mc__acoes">
              <button type="submit" className="mc__enviar">
                <span>Continuar no WhatsApp</span>
                <ArrowUpRight size={18} />
              </button>
              <p className="mc__aviso">
                Ao continuar você concorda com nossa política de privacidade. Não
                enviamos comunicação sem o seu aceite.
              </p>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}

function Campo({ nome, rotulo, valor, aoMudar, erro, tipo = 'text', opcional, ...resto }) {
  return (
    <label className={`mc__campo ${erro ? 'mc__campo--erro' : ''}`}>
      <span className="mc__rotulo">
        {rotulo} {opcional && <em>opcional</em>}
      </span>
      <input
        type={tipo}
        name={nome}
        value={valor}
        onChange={aoMudar}
        aria-invalid={!!erro}
        aria-describedby={erro ? `${nome}-erro` : undefined}
        {...resto}
      />
      {erro && (
        <span className="mc__erro" id={`${nome}-erro`} role="alert">
          {erro}
        </span>
      )}
    </label>
  );
}
