import { useRef } from 'react'
import { HERO } from '../../data/site'
import { gsap, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { Photo } from '../ui/Photo'

/**
 * The hero: a black card on the white page, the copy on the left, one still photo on the right (a coach
 * with a kid and adults under the Alliance eagle on the wall). No pin and no flipbook (Adryan, 12/11:
 * the flipbook idea did not work in practice). The photo settles in from a slight zoom as the copy rises.
 * Phones: the photo is a band on top, the text below, the button on the first screen.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    const el = root.current!
    gsap.fromTo(el.querySelector('.hero__film img'), { scale: 1.08 }, { scale: 1, duration: 1.8, ease: 'power3.out' })
    gsap.fromTo(el.querySelectorAll('.hero__in > *'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.1 })
  }, { scope: root })

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-h">
      <div className="hero__card" data-nav="dark">
        <div className="hero__film">
          <picture>
            <source media="(max-width: 899px)" srcSet={`${HERO.tall.src.replace(/\.webp$/, '-sm.webp')} ${HERO.tall.sm}w, ${HERO.tall.src} ${HERO.tall.w}w`} sizes="100vw" width={HERO.tall.w} height={HERO.tall.h} />
            <Photo photo={HERO.photo} eager sizes="100vw" />
          </picture>
        </div>
        <div className="hero__copy">
          <div className="hero__in">
            <h1 id="hero-h" className="t t-hero"><span className="hero__y">{HERO.h1a}</span> {HERO.h1b}</h1>
            <p className="hero__sub">{HERO.sub}</p>
            <div className="hero__acts">
              <Cta />
            </div>
            <p className="hero__micro">{HERO.micro}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
