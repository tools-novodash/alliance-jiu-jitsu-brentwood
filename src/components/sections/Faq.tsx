import { useRef } from 'react'
import { FAQ, SITE } from '../../data/site'
import { lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Accordion } from '../ui/Accordion'
import { Cta, Tag } from '../ui/Cta'

/** FAQ: the questions as a nervous beginner or parent would ask them, one open at a time. */
export function Faq() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    const el = root.current!
    lines(el.querySelector('h2')!)
    rise(el.querySelectorAll('.qa'), el.querySelector('.faq__list')!, { stagger: 0.06, y: 16 })
  }, { scope: root })
  return (
    <section className="sec faq" id="faq" ref={root} aria-labelledby="faq-h">
      <div className="shell faq__grid">
        <div className="faq__side">
          <Tag>Questions</Tag>
          <h2 id="faq-h" className="t t-1">Asked before <span className="hl">the first class.</span></h2>
          <p className="lead">Anything else, call the front desk at <a href={SITE.phone.tel}>{SITE.phone.display}</a> or write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
          <Cta />
        </div>
        <Accordion items={FAQ} />
      </div>
    </section>
  )
}
