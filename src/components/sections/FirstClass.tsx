import { useEffect, useRef, useState } from 'react'
import { STEPS } from '../../data/site'
import { lines, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta, Tag } from '../ui/Cta'

const N = STEPS.length
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Your first class in the CG North Lakeland belt style (Adryan, 12/11). A white belt runs across the
 * section, a little tilted, its black bar on the page column; each step of the first class tapes a stripe
 * on it. Desktop: the section holds for 1.5 screens of scroll, as CG does and the steps take turns in one spot,
 * the big number and the "x/4" count keeping up. Phones pin too (Adryan 12/11), the number and the count on
 * one line over the step. Reduced motion: no pin, the four stripes on and the steps as a plain list.
 */
export function FirstClass() {
  const root = useRef<HTMLElement>(null)
  const [k, setK] = useState(0) // steps reached (stripes on)
  const [still, setStill] = useState(false)

  // the section holds on every screen (Adryan 12/11: keep the 3 steps effect on phones too); reduced motion
  // gets the four stripes on and the plain list
  useEffect(() => {
    if (!motionOK()) { setStill(true); setK(N); return }
    const el = root.current!
    const st = ScrollTrigger.create({
      trigger: el.querySelector('.day__pin')!, start: 'top top', end: () => `+=${innerHeight * 1.5}`, pin: true,
      onUpdate: (s) => setK(Math.min(N, Math.floor(s.progress * N) + 1)),
      onLeaveBack: () => setK(0),
    })
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => st.kill()
  }, [])

  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })

  const on = Math.max(0, k - 1)

  return (
    <section className={`day${still ? ' is-still' : ''}`} id="first-class" ref={root} aria-labelledby="fc-h">
      <div className="day__pin">
        <div className="shell day__head">
          <div>
            <Tag>Your first class</Tag>
            <h2 id="fc-h" className="t t-1">Your first class is free. <span className="hl">Here is how it goes.</span></h2>
          </div>
          <div className="day__go"><Cta /></div>
        </div>

        <div className="belt day__belt" aria-hidden="true">
          <span className="belt__bar">
            {STEPS.map((s, i) => <i key={s.t} className="belt__deg" data-on={i < k || undefined} />)}
          </span>
        </div>

        <div className="shell">
          <div className="day__grid">
            <p className="day__num" data-n={pad(on + 1)} aria-hidden="true">{pad(on + 1)}</p>
            <ol className="day__stack" role="list">
              {STEPS.map((s, i) => (
                <li key={s.t} className={`day__step${i === on ? ' is-on' : ''}${i < on ? ' is-past' : ''}`}>
                  <h3>{s.t}</h3>
                  <p>{s.p}</p>
                </li>
              ))}
            </ol>
            <p className="day__meter"><b>{k}/{N}</b>stripes on day one</p>
          </div>
          <ol className="day__list" role="list">
            {STEPS.map((s, i) => (
              <li key={s.t}>
                <span className="day__n">Stripe {pad(i + 1)}</span>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
