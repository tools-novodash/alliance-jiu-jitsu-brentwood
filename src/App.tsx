import { useEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { Nav } from './components/layout/Nav'
import { ScrollTrigger } from './lib/gsap'
import { scrollToTarget, startLenis } from './lib/lenis'
import { motionOK } from './lib/motion'
import { useBooking } from './nd'
import type { Route } from './routes'

/** The shell: skip link, nav, the page, footer. Lenis on fine pointers; in-page anchors go through it;
 *  it holds still while the booking form is open. */
export default function App({ route }: { route: Route }) {
  const { isOpen } = useBooking()
  useEffect(() => {
    const stopLenis = motionOK() && matchMedia('(pointer: fine)').matches ? startLenis() : () => {}
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      const id = a?.getAttribute('href')
      if (!a || !id || id === '#' || id === '#book' || id === '#start') return
      if (id === '#top') { e.preventDefault(); scrollToTarget(0, !motionOK()); return }
      const target = document.querySelector<HTMLElement>(id)
      if (!target) return
      e.preventDefault()
      scrollToTarget(target, !motionOK())
    }
    document.addEventListener('click', onClick)
    const refresh = () => ScrollTrigger.refresh()
    void document.fonts?.ready.then(refresh)
    addEventListener('load', refresh)
    // the page keeps growing after load (lazy images, titles split near the screen, the chat): when its
    // height changes, the pins (Frames, the belt) re-measure, or the belt pins too early, over the schedule
    let h = 0, t = 0
    const ro = new ResizeObserver(() => {
      const nh = document.documentElement.scrollHeight
      if (Math.abs(nh - h) < 2) return
      h = nh; clearTimeout(t); t = window.setTimeout(settle, 200)
    })
    // never re-measure while a section is held on screen (the belt, the frames): a refresh then makes the
    // held section jump; wait until the pin lets go
    const settle = () => {
      if (ScrollTrigger.getAll().some((s) => s.pin && s.isActive)) { t = window.setTimeout(settle, 250); return }
      refresh()
    }
    ro.observe(document.getElementById('main')!)
    return () => { stopLenis(); ro.disconnect(); clearTimeout(t); document.removeEventListener('click', onClick); removeEventListener('load', refresh) }
  }, [])
  useEffect(() => { const l = window.__lenis; if (!l) return; if (isOpen) l.stop(); else l.start() }, [isOpen])
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">{route.page()}</main>
      <Footer />
    </>
  )
}
