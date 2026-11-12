import { useEffect, useRef, useState } from 'react'
import { SEQS } from '../../data/site'
import { lines, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { scrollToTarget } from '../../lib/lenis'
import { motionOK } from '../../lib/motion'
import { useRail } from '../../lib/useRail'
import { Tag } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Mark } from '../ui/Logo'
import { Photo } from '../ui/Photo'
import { Pencil } from '../ui/Pencil'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The signature: frame by frame. Alliance's case is "a curriculum, taught in the same order at every
 * academy", so the page shows two kids' techniques shot in this room, one frame at a time, with the
 * coach's marks on each (the grip ringed, the hip arrowed: the detail that gets corrected early).
 * Desktop (Adryan, 12/11): one screen high, the frame is the section's background (full height, bleeding
 * right, fading into the ink where the copy sits), the marks drawn on it, and the timeline of the frames
 * along the bottom. The section holds for about one screen of scroll while it walks ONE sequence (Adryan,
 * 12/11: both in a row was too long); the tabs swap the program in place, the scroll stays where it is.
 * Phones: no pin; a tab per program and a rail of frames to swipe, each with its marks.
 */
export function Frames() {
  const root = useRef<HTMLElement>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const [pos, setPos] = useState({ si: 0, fi: 0 })
  const si = useRef(0) // the program on screen, read by the scroll
  const [tab, setTab] = useState(0) // phones
  const { ref: railRef, go, at, count } = useRail<HTMLOListElement>(tab)

  useGSAP(() => {
    const el = root.current!
    if (!motionOK()) return
    lines(el.querySelector('h2')!)
    const mq = matchMedia('(min-width: 900px)')
    const make = () => {
      st.current?.kill(); st.current = null
      if (!mq.matches) return
      st.current = ScrollTrigger.create({
        trigger: el.querySelector('.fr__stage')!, start: 'top top', end: () => `+=${innerHeight * 1.2}`, pin: true, scrub: true,
        onUpdate: (s) => {
          const n = SEQS[si.current].frames.length
          const fi = Math.min(n - 1, Math.floor(s.progress * n))
          setPos((p) => (p.si === si.current && p.fi === fi ? p : { si: si.current, fi }))
        },
      })
    }
    make()
    mq.addEventListener('change', make)
    return () => { mq.removeEventListener('change', make); st.current?.kill() }
  }, { scope: root })

  // warm every frame before the section arrives, so no frame flashes empty while the scroll walks them
  useEffect(() => {
    const el = root.current
    if (!el || !matchMedia('(min-width: 900px)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      SEQS.forEach((s) => s.frames.forEach((f) => { const i = new Image(); i.src = f.photo.src }))
    }, { rootMargin: '1500px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // a tab swaps the program in place and starts it from its first frame (Adryan 12/11: opening Eagle Youth
  // on its last frame skipped the whole move): the scroll goes back to the top of the hold in one jump,
  // the stage stays still on screen because it is pinned; a timeline frame scrolls to it
  const pick = (next: number) => {
    si.current = next
    setPos({ si: next, fi: 0 })
    const s = st.current
    if (!s || !s.isActive) return
    const y = s.start + 1
    const l = window.__lenis
    if (l) l.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo({ top: y, behavior: 'instant' })
  }
  const jump = (fi: number) => {
    const s = st.current
    if (!s || !s.isActive) { setPos((p) => ({ ...p, fi })); return }
    const n = SEQS[si.current].frames.length
    scrollToTarget(s.start + (s.end - s.start) * ((fi + 0.5) / n))
  }

  const seq = SEQS[pos.si]
  const fr = seq.frames[pos.fi]
  const mseq = SEQS[tab]
  const fill = seq.frames.length > 1 ? pos.fi / (seq.frames.length - 1) : 1

  return (
    <section className="fr" id="in-order" ref={root} data-nav="dark" aria-labelledby="fr-h">
      <div className="fr__stage">
        {/* desktop background: the frame at full height, the coach's marks on it */}
        <div className="fr__bgs" aria-hidden="true">
          {SEQS.map((s, si) => (
            <div key={s.id} className="fr__bg" data-on={si === pos.si || undefined} style={{ ['--r' as string]: s.ratio }}>
              {s.frames.map((f, fi) => (
                <div key={f.photo.src} className="fr__img" data-on={(si === pos.si && fi === pos.fi) || undefined}>
                  <Photo photo={f.photo} sizes="(min-width: 900px) 90vw, 1px" alt="" />
                </div>
              ))}
              {si === pos.si ? <Pencil key={`${pos.si}-${pos.fi}`} marks={fr.marks} ratio={s.ratio} /> : null}
            </div>
          ))}
          <span className="fr__shade" />
        </div>

        <div className="shell fr__ui">
          <div className="fr__copy">
            <Tag light>The Alliance curriculum</Tag>
            <h2 id="fr-h" className="t t-1">Taught in order. <span className="hl">The same order in 300 academies.</span></h2>
            <p className="fr__body">Alliance was founded in Rio de Janeiro in 1993 and has won 16 IBJJF world team titles. What reaches Brentwood is the curriculum: modules ordered by belt, taught in the same sequence at every academy on the list.</p>
            <dl className="fr__facts">
              <div><dt>1993</dt><dd>founded in Rio</dd></div>
              <div><dt>16</dt><dd>IBJJF world team titles</dd></div>
              <div><dt>300+</dt><dd>academies</dd></div>
            </dl>
          </div>

          <div className="fr__tabs fr__tabs--d" role="group" aria-label="Choose a program">
            {SEQS.map((s, i) => (
              <button key={s.id} type="button" className="fr__tab" aria-pressed={pos.si === i} onClick={() => pick(i)}>
                <span className="fr__tmk" aria-hidden="true"><Mark /></span><span className="fr__ttx"><b>{s.program}</b><span>{s.ages}</span></span>
              </button>
            ))}
          </div>

          <div className="fr__row">
          <div className="fr__now" aria-live="polite">
            <p className="fr__num"><b key={`${pos.si}-${pos.fi}`}>{pad(pos.fi + 1)}</b><span>/ {pad(seq.frames.length)}</span></p>
            <p className="fr__label" key={fr.label}>{fr.label}</p>
            <p className="fr__line"><b>{seq.program}, {seq.ages.toLowerCase()}.</b> {seq.line}</p>
          </div>

          <ol className="fr__tl" role="list" aria-label={`${seq.move}, ${seq.frames.length} frames`} style={{ ['--fill' as string]: fill, ['--n' as string]: seq.frames.length }}>
            {seq.frames.map((f, fi) => (
              <li key={f.photo.src} data-on={fi === pos.fi || undefined} data-past={fi < pos.fi || undefined}>
                <button type="button" onClick={() => jump(fi)} aria-label={`Frame ${fi + 1}: ${f.label}`}>
                  <span className="fr__tn"><Photo photo={f.photo} sizes="140px" alt="" /></span>
                  <span className="fr__tt"><i>{pad(fi + 1)}</i>{f.label}</span>
                </button>
              </li>
            ))}
          </ol>
          </div>

          {/* phones: tabs and a rail of frames, no pin */}
          <div className="fr__m">
            <div className="fr__tabs" role="tablist" aria-label="Choose a program">
              {SEQS.map((s, i) => (
                <button key={s.id} type="button" role="tab" className="fr__tab" aria-selected={tab === i} onClick={() => setTab(i)}>
                  <span className="fr__tmk" aria-hidden="true"><Mark /></span><span className="fr__ttx"><b>{s.program}</b><span>{s.ages}</span></span>
                </button>
              ))}
            </div>
            <p className="fr__line"><b>{mseq.move}, frame by frame.</b> {mseq.line}</p>
            <ol className="fr__rail rail" role="list" ref={railRef} key={mseq.id}>
              {mseq.frames.map((f, fi) => (
                <li key={f.photo.src} className="fr__card">
                  <div className="fr__frame" style={{ aspectRatio: String(mseq.ratio) }}>
                    <div className="fr__img" data-on><Photo photo={f.photo} sizes="82vw" alt={fi === 0 ? f.photo.alt : ''} /></div>
                    <Pencil marks={f.marks} ratio={mseq.ratio} />
                  </div>
                  <p className="fr__cap"><span>{pad(fi + 1)} / {pad(mseq.frames.length)}</span> {f.label}</p>
                </li>
              ))}
            </ol>
            <div className="rail-btns rail-btns--l">
              <button type="button" className="sq sq--l" aria-label="Previous frame" onClick={() => go(-1)} disabled={at <= 0}><Icon name="prev" /></button>
              <button type="button" className="sq sq--l" aria-label="Next frame" onClick={() => go(1)} disabled={at >= count - 1}><Icon name="next" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
