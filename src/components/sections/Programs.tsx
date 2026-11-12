import { useEffect, useRef, useState } from 'react'
import { PROGRAMS } from '../../data/site'
import { lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { useRail } from '../../lib/useRail'
import { Cta, Tag } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Mark } from '../ui/Logo'
import { Photo } from '../ui/Photo'

const pad = (n: number) => String(n).padStart(2, '0')

/** All six programs on one track (Adryan, 12/11: carousel in one row, like Cristyan's, but the white
 *  card stays). Exactly three in view on desktop (Adryan 12/11: no half card at the edge), the next one peeking on phones; arrows, drag, swipe, and a bar
 *  that fills as you go. Kids first, then adults, the age on every card. */
export function Programs() {
  const root = useRef<HTMLElement>(null)
  const { ref, go, at, count } = useRail<HTMLUListElement>()
  const [prog, setProg] = useState(0)
  useEffect(() => {
    const t = ref.current
    if (!t) return
    const on = () => { const max = t.scrollWidth - t.clientWidth; setProg(max > 0 ? t.scrollLeft / max : 1) }
    on()
    t.addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { t.removeEventListener('scroll', on); removeEventListener('resize', on) }
  }, [ref])
  useGSAP(() => {
    if (!motionOK()) return
    const el = root.current!
    lines(el.querySelector('h2')!)
    rise(el.querySelectorAll('.pc'), el.querySelector('.pg__track')!, { stagger: 0.08, y: 40 })
  }, { scope: root })
  const shown = Math.min(PROGRAMS.length, 1 + Math.round(prog * (PROGRAMS.length - 1)))

  return (
    <section className="sec pg" id="programs" ref={root} aria-labelledby="pg-h">
      <div className="shell">
        <div className="head head--row">
          <div>
            <Tag>Programs</Tag>
            <h2 id="pg-h" className="t t-1"><span className="pg__h t-ol t-ol--2">Six programs.</span> <span className="pg__h hl">One for every age.</span></h2>
          </div>
          <div className="head__side">
            <p className="lead">Kids train with kids their age, in three groups. At fourteen they move up to the adult classes, and by then the move is not a shock.</p>
            <div className="pg__ctl">
              <Cta />
              <div className="pg__nav">
                <button type="button" className="sq" aria-label="Previous program" onClick={() => go(-1)} disabled={at <= 0}><Icon name="prev" /></button>
                <button type="button" className="sq" aria-label="Next program" onClick={() => go(1)} disabled={prog >= 0.99 || at >= count - 1}><Icon name="next" /></button>
              </div>
            </div>
          </div>
        </div>
        <ul className="pg__track" role="list" ref={ref}>
          {PROGRAMS.map((p) => (
            <li key={p.name} className="pc">
              <div className="pc__ph"><Photo photo={p.photo} sizes="(min-width: 900px) 30vw, 80vw" /></div>
              <div className="pc__b">
                <Mark className="pc__mk" />
                <div className="pc__tags">
                  <p className="pc__kind">{p.kind === 'kids' ? 'Kids and teens' : 'Adults'}</p>
                  <p className="pc__ages">{p.ages}</p>
                </div>
                <h3 className="pc__n">{p.name}</h3>
                <p className="pc__t">{p.text}</p>
                <div className="pc__per">
                  <span className="pc__ticks" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} data-on={i < p.per || undefined} />)}</span>
                  <span><b>{p.per}</b> classes a week</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="pg__bar" aria-hidden="true">
          <span>{pad(shown)} / {pad(PROGRAMS.length)}</span>
          <i><b style={{ transform: `scaleX(${Math.max(prog, 1 / PROGRAMS.length)})` }} /></i>
        </div>
      </div>
    </section>
  )
}
