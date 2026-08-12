import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './lumina-interactive-list.css'

const slides = [
  { title: 'Visão Global', description: 'Perspectiva para encontrar oportunidades onde outros veem ruído.', media: '/images/city.jpg' },
  { title: 'Clareza', description: 'Complexidade transformada em escolhas objetivas e conscientes.', media: '/images/facade.jpg' },
  { title: 'Convicção', description: 'Pesquisa profunda para sustentar cada movimento de capital.', media: '/images/tower.jpg' },
  { title: 'Movimento', description: 'Agilidade para atravessar ciclos sem perder o horizonte.', media: '/images/night.jpg' },
]

export function Component() {
  const [active, setActive] = useState(0)
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    imageRefs.current.forEach((image, index) => image && gsap.to(image, { opacity: index === active ? 1 : 0, scale: index === active ? 1 : 1.06, duration: 1.1, ease: 'power3.inOut' }))
    if (titleRef.current) gsap.fromTo(titleRef.current.children, { y: 45, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: .8, stagger: .035, ease: 'power4.out' })
    if (descRef.current) gsap.fromTo(descRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .7, delay: .2 })
  }, [active])

  return <section className="lumina">
    <div className="lumina__media">{slides.map((slide, i) => <img key={slide.media} ref={el => { imageRefs.current[i] = el }} src={slide.media} alt="" style={{ opacity: i === 0 ? 1 : 0 }} />)}<div className="lumina__wash" /></div>
    <div className="lumina__counter"><b>0{active + 1}</b><span>/</span><span>0{slides.length}</span></div>
    <div className="lumina__copy"><p>ORYX / PERSPECTIVAS</p><h2 ref={titleRef}>{slides[active].title.split('').map((char, i) => <span key={`${char}-${i}`}>{char === ' ' ? '\u00a0' : char}</span>)}</h2><p ref={descRef}>{slides[active].description}</p></div>
    <nav className="lumina__nav" aria-label="Perspectivas">{slides.map((slide, i) => <button key={slide.title} className={i === active ? 'active' : ''} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}><i><em /></i><span>0{i + 1}</span>{slide.title}</button>)}</nav>
  </section>
}
