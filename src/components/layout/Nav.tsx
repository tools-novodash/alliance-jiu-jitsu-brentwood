import { useEffect, useRef, useState } from 'react'
import { NAV, SITE } from '../../data/site'
import { Cta } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'

/**
 * A plain bar, no pill and no booking button (the OCJ answer to the "WordPress" nav): the triangle and
 * the name, four links, the phone. It takes the colour of what is under it (data-nav="dark" sections turn
 * it white), slides away while you scroll down and comes back when you scroll up.
 */
export function Nav() {
  const ref = useRef<HTMLElement>(null)
  const [dark, setDark] = useState(false)
  const [hide, setHide] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  // scroll: only scrollY is read (no layout), so the bar never forces a reflow inside a smooth-scroll frame
  useEffect(() => {
    let raf = 0, last = scrollY
    const read = () => {
      raf = 0
      const y = scrollY
      setSolid(y > 40)
      if (Math.abs(y - last) > 6) { setHide(y > last && y > 240); last = y }
    }
    const on = () => { raf ||= requestAnimationFrame(read) }
    read()
    addEventListener('scroll', on, { passive: true })
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [])
  // what is under the bar: an IntersectionObserver on a 1px line at the bar's middle, instead of hit-testing
  // the page on every scroll frame (Adryan 12/11: the scroll stuttered now and then)
  useEffect(() => {
    const nav = ref.current!
    const under = new Set<Element>()
    let io: IntersectionObserver | null = null
    const make = () => {
      io?.disconnect(); under.clear()
      const mid = Math.round(nav.querySelector('.nav__in')!.getBoundingClientRect().height / 2)
      io = new IntersectionObserver((es) => {
        es.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)))
        setDark(under.size > 0)
      }, { rootMargin: `-${mid}px 0px -${Math.max(0, innerHeight - mid - 1)}px 0px` })
      document.querySelectorAll('[data-nav="dark"]').forEach((el) => { if (!nav.contains(el)) io!.observe(el) })
    }
    make()
    let t = 0
    const size = () => { clearTimeout(t); t = window.setTimeout(make, 150) }
    addEventListener('resize', size)
    return () => { removeEventListener('resize', size); clearTimeout(t); io?.disconnect() }
  }, [])
  useEffect(() => { document.documentElement.classList.toggle('menu-open', open) }, [open])

  return (
    <header className={`nav${dark && !open ? ' is-dark' : ''}${hide && !open ? ' is-hid' : ''}${solid ? ' is-solid' : ''}${open ? ' is-open' : ''}`} ref={ref}>
      <div className="nav__in">
        <a className="nav__logo" href="#top" aria-label={`${SITE.name}, top of the page`}>
          <Logo className="nav__mk" />
          <span className="nav__wm"><b>Alliance Jiu Jitsu</b><span>Brentwood</span></span>
        </a>
        <nav className="nav__links" aria-label="Main">
          {NAV.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
        <a className="nav__tel" href={SITE.phone.tel} aria-label={`Call ${SITE.phone.display}`}><Icon name="phone" /><span>{SITE.phone.display}</span></a>
        <button type="button" className="nav__menu" aria-expanded={open} aria-controls="menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
      <div className="menu" id="menu" hidden={!open} data-nav="dark" onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setOpen(false) }}>
        <nav aria-label="Menu">
          {NAV.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          <a href="#faq">Questions</a>
        </nav>
        <Cta />
        <a className="call call--l" href={SITE.phone.tel}><Icon name="phone" />{SITE.phone.display}</a>
      </div>
    </header>
  )
}
