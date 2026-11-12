import { useRef } from 'react'
import { HEAD, TEAM } from '../../data/site'
import { gsap, lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { useRail } from '../../lib/useRail'
import { Cta, Tag } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Mark } from '../ui/Logo'
import { Photo } from '../ui/Photo'

/**
 * Coaches, on ink (Fight Sports): Ricardo first and big, his photo standing on the bottom edge of the
 * block, his story on one side and the belts on the other (the Lobo professor layout). Under him,
 * the three coaches, cards of one width; phones swipe them.
 */
export function Coaches() {
  const root = useRef<HTMLElement>(null)
  const { ref, go, at, count } = useRail<HTMLUListElement>()
  useGSAP(() => {
    if (!motionOK()) return
    const el = root.current!
    lines(el.querySelector('h2')!)
    rise(el.querySelectorAll('.co__side > *'), el.querySelector('.co__head')!, { stagger: 0.08 })
    gsap.fromTo(el.querySelector('.co__ph img'), { yPercent: 8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el.querySelector('.co__head'), start: 'top bottom', end: 'bottom 60%', scrub: true } })
    rise(el.querySelectorAll('.cc'), el.querySelector('.co__team')!, { stagger: 0.1, y: 36 })
  }, { scope: root })

  return (
    <section className="sec co" id="coaches" ref={root} data-nav="dark" aria-labelledby="co-h">
      <div className="shell">
        <div className="head head--row">
          <div>
            <Tag light>Coaches</Tag>
            <h2 id="co-h" className="t t-1">Four coaches. <span className="hl">Two black belts <span className="t-ol">he made himself.</span></span></h2>
          </div>
          <p className="lead lead--l">At least one coach is on the mat for every class, and most classes have two or three. The beginners class never runs without one.</p>
        </div>

        <article className="co__head" aria-label={`${HEAD.name}, ${HEAD.role}`}>
          <Mark className="co__mk co__mk--a" />
          <Mark className="co__mk co__mk--b" />
          <div className="co__side co__story">
            <p className="co__role">{HEAD.role}</p>
            <h3 className="t co__name">{HEAD.name}</h3>
            {HEAD.story.map((p) => <p key={p.slice(0, 16)}>{p}</p>)}
          </div>
          <div className="co__ph"><Mark className="co__logo" /><Photo photo={HEAD.photo} sizes="(min-width: 900px) 30vw, 80vw" /></div>
          <div className="co__side co__facts">
            <p className="co__belt"><i aria-hidden="true" />{HEAD.belt}</p>
            <dl>
              {HEAD.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <Cta label={`Train with ${HEAD.name.split(' ')[0]}`} size="sm" />
          </div>
        </article>

        <div className="co__team">
          <ul className="co__cards rail" role="list" ref={ref}>
            {TEAM.map((c) => (
              <li key={c.name} className="cc">
                <div className="cc__ph"><Photo photo={c.photo} sizes="(min-width: 900px) 26vw, 74vw" /></div>
                <div className="cc__b">
                  <h3 className="t cc__n">{c.name}</h3>
                  <p className="cc__belt"><i data-b={c.belt.startsWith('Brown') ? 'brown' : 'black'} aria-hidden="true" />{c.belt}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="rail-btns rail-btns--l">
            <button type="button" className="sq sq--l" aria-label="Previous coach" onClick={() => go(-1)} disabled={at <= 0}><Icon name="prev" /></button>
            <button type="button" className="sq sq--l" aria-label="Next coach" onClick={() => go(1)} disabled={at >= count - 1}><Icon name="next" /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
