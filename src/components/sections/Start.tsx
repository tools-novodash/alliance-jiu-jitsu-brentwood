import { useEffect, useRef, useState } from 'react'
import { START } from '../../data/site'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta, Tag } from '../ui/Cta'
import { Mark } from '../ui/Logo'

// each worry is three beats: the worry lands, the academy types, the answer lands
const AFTER = [0.45, 0.6, 0.55] // seconds after: the worry, typing on, the answer
const BEATS = START.items.length * 3

function Person() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.2-4 4.2-6 7.5-6s6.3 2 7.5 6" />
    </svg>
  )
}

/**
 * Starting as an adult, as a conversation (Adryan, 12/11: the CG North Lakeland messages, without the pin).
 * The title on top; under it the beginner's five worries land on the left, the academy types for a beat
 * and answers on the right, one after the other, once the chat comes into view. Square bubbles (the
 * brand is square), the Alliance mark as the academy's avatar. Every message is in the DOM from the start
 * (screen readers get the whole exchange); reduced motion shows it all at once.
 */
export function Start() {
  const root = useRef<HTMLElement>(null)
  const chat = useRef<HTMLDivElement>(null)
  const [beat, setBeat] = useState(0)

  // which worries the reader has reached: a worry counts once its top is 15% above the bottom of the screen.
  // Read from the scroll (not a one-off timer), so a fast scroll down never leaves messages behind; the pairs'
  // offsets are measured once (the chat never changes height: the typing dots sit over the answer's slot).
  const [want, setWant] = useState(0)
  useEffect(() => {
    const el = chat.current
    if (!el) return
    if (!motionOK()) { setBeat(BEATS); return }
    const pairs = [...el.querySelectorAll<HTMLElement>('.st__pair')]
    let offs: number[] = []
    let raf = 0, veil = -1
    const measure = () => { const t = el.getBoundingClientRect().top; offs = pairs.map((p) => p.getBoundingClientRect().top - t) }
    const read = () => {
      raf = 0
      const top = el.getBoundingClientRect().top
      const v = Math.min(1, Math.max(0, -top / 120))
      if (v !== veil) { veil = v; el.style.setProperty('--veil', String(v)) } // the veil at the top of the chat
      const line = innerHeight * 0.85
      let n = 0
      while (n < offs.length && top + offs[n] < line) n++
      setWant((w) => Math.max(w, n))
    }
    const on = () => { raf ||= requestAnimationFrame(read) }
    const size = () => { measure(); on() }
    measure(); read()
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', size)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', size); cancelAnimationFrame(raf) }
  }, [])
  // the beats follow the reader: the normal rhythm while they read, a quick catch-up when they scrolled ahead
  useEffect(() => {
    const target = want * 3
    if (beat >= target) return
    const behind = target - beat > 3
    const wait = behind ? 90 : beat === 0 ? 0 : AFTER[(beat - 1) % 3] * 1000
    const id = window.setTimeout(() => setBeat((b) => b + 1), wait)
    return () => clearTimeout(id)
  }, [beat, want])
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })

  const asked = (i: number) => beat > i * 3
  const typing = (i: number) => beat === i * 3 + 2
  const answered = (i: number) => beat > i * 3 + 2

  return (
    <section className="sec st" id="adults" ref={root} aria-labelledby="st-h">
      <div className="shell">
        <div className="st__copy">
          <Tag>{START.tag}</Tag>
          <h2 id="st-h" className="t t-1">{START.h2a} <span className="hl">{START.h2b}</span></h2>
          <p className="lead st__lead">{START.lead}</p>
        </div>

        <div className="st__chat" ref={chat}>
          <div className="st__veil" aria-hidden="true" />
          {START.items.map((it, i) => (
            <div key={it.q} className="st__pair">
              <div className={`cb${asked(i) ? ' is-in' : ''}`} role="group" aria-label="A beginner asks">
                <div className="cb__row">
                  <span className="cb__av" aria-hidden="true"><Person /></span>
                  <p className="cb__b">{it.q}</p>
                </div>
              </div>
              <div className={`cb cb--us${answered(i) ? ' is-in' : ''}${typing(i) ? ' is-typing' : ''}`} role="group" aria-label="Alliance Brentwood answers">
                <div className="cb__row">
                  <span className="cb__av" aria-hidden="true"><Mark /></span>
                  <p className="cb__b">{it.a}</p>
                </div>
                <div className="cb__row cb__typing" aria-hidden="true">
                  <span className="cb__av"><Mark /></span>
                  <p className="cb__b"><span className="cb__dots"><i /><i /><i /></span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="st__foot"><Cta label="Book your private intro" audience="adults" /></div>
      </div>
    </section>
  )
}
