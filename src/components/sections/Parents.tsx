import { useEffect, useRef } from 'react'
import { PARENTS } from '../../data/site'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta, Tag } from '../ui/Cta'
import { Mark } from '../ui/Logo'

// Adryan's cutout (12/11): Connor with a Little Eagle, both in Alliance gis
const COACH_KID = { src: '/images/coach-kid.webp', w: 1122, h: 1402 }

/**
 * For parents: a kids' progress card (Adryan, 12/11: more kids, another font, livelier). The card sits a
 * little crooked like a real one on the fridge; when it comes into view it straightens, each box ticks with
 * a spring and a small burst of rays, and a red rubber stamp thuds on: parents can watch any class (Adryan 12/11: a stamp).
 * Beside it, the cutout of a coach with a kid, standing on the section's bottom edge as if coming out of it
 * (Adryan, 12/11: not floating). The lettering is Bungee (square signage, fits the brand, reads kid).
 */
export function Parents() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const parts = el.querySelectorAll<HTMLElement>('.rc, .pa__kid')
    if (!motionOK()) { parts.forEach((p) => p.classList.add('is-on')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-on'); io.unobserve(e.target) } }), { threshold: 0.4 })
    parts.forEach((p) => io.observe(p))
    return () => io.disconnect()
  }, [])
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })

  return (
    <section className="sec pa" id="parents" ref={root} aria-labelledby="pa-h">
      <div className="shell">
        <div className="head head--row">
          <div>
            <Tag>{PARENTS.tag}</Tag>
            <h2 id="pa-h" className="t t-1">{PARENTS.h2a} <span className="hl">{PARENTS.h2b}</span></h2>
          </div>
          <div className="head__side">
            <p className="lead">{PARENTS.lead}</p>
            <Cta label="Book a free kids class" audience="kids" />
          </div>
        </div>

        <div className="pa__grid">
          <article className="rc" aria-label="Progress card">
            <header className="rc__top">
              <Mark className="rc__mk" />
              <p className="rc__name">Alliance Brentwood</p>
              <p className="rc__kind">Kids</p>
            </header>
            <div className="rc__title">
              <h3>Progress card</h3>
              <p className="rc__meta"><span>Name</span><i aria-hidden="true" /><span>Ages</span><b>5 to 13</b></p>
            </div>
            <ol className="rc__list" role="list">
              {PARENTS.rows.map((r, i) => (
                <li key={r.t} className="rc__row" style={{ ['--i' as string]: i }}>
                  <span className="rc__box" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path pathLength={1} d="M5 12.5l4.5 4.5L19 7" /></svg>
                    <span className="rc__burst">{Array.from({ length: 8 }, (_, k) => <i key={k} style={{ ['--a' as string]: `${k * 45}deg` }} />)}</span>
                  </span>
                  <div>
                    <p className="rc__t">{r.t.split('\n').map((part, k) => (k ? [<br key={k} />, part] : part))}</p>
                    <p className="rc__note"><b>On the mat</b>{r.note}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="rc__stamp"><span>Parents can watch</span><b>Any class</b></p>
          </article>

          <figure className="pa__kid">
            <span className="pa__fig">
              <Mark className="pa__logo" />
              <img src={COACH_KID.src} width={COACH_KID.w} height={COACH_KID.h} alt="Coach Connor Ohai with a young student, both in Alliance gis" loading="lazy" decoding="async" />
            </span>
          </figure>
        </div>
      </div>
    </section>
  )
}
