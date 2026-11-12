import { useEffect, useRef, useState } from 'react'
import { img } from '../../data/img'
import { CTA, NAV, PROGRAMS, SITE } from '../../data/site'
import { Icon } from '../ui/Icon'
import { Logo, Mark } from '../ui/Logo'
import { Photo } from '../ui/Photo'

const PLACE = img('training5', 'Pairs training on the mats under the Jiu Jitsu Brentwood lettering on the wall')

/**
 * The footer in the Cristyan pattern (Adryan, 12/11): on top, "Find us", the title centred, the real map
 * as the background rising from the ink and falling into the footer, the pin on the academy; on the map the
 * photo of the room on the left and the visit card on the right. Below, the brand, the links, the contacts.
 * The map loads only near the screen.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '700px' })
    io.observe(root.current!)
    return () => io.disconnect()
  }, [])
  return (
    <footer className="foot" data-nav="dark" ref={root}>
      <section className="find" id="visit" aria-labelledby="find-h">
        <div className="find__map" aria-hidden="true">
          {near && <iframe title={`Map: ${SITE.name}, ${SITE.street}`} src={SITE.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} />}
          <span className="find__shade" />
          <span className="find__pin"><i /><i /><Mark /></span>
        </div>
        <div className="shell find__in">
          <div className="find__head">
            <p className="tag tag--l">Visit the academy</p>
            <h2 className="t t-1" id="find-h">Find us on <span className="hl">Lone Tree Way.</span></h2>
            <p>A few minutes from anywhere in Brentwood, and an easy drive from Oakley, Antioch and Discovery Bay.</p>
          </div>
          <div className="find__grid">
            <figure className="find__ph"><Photo photo={PLACE} sizes="(max-width: 899px) 92vw, 380px" /><figcaption>The mats on Lone Tree Way</figcaption></figure>
            <div className="find__card">
              <b>{SITE.street}</b>
              <p>{SITE.city}</p>
              <div className="find__btns">
                <a className="cta cta--sm" href="#book"><span className="cta__t">{CTA}</span><span className="cta__m" aria-hidden="true"><Mark /></span></a>
                <a className="chip chip--l" href={SITE.maps} target="_blank" rel="noopener"><Icon name="pin" />Get directions</a>
              </div>
              <ul className="find__list" role="list">
                <li><a href={SITE.phone.tel}><Icon name="phone" /><span>{SITE.phone.display}<small>Front desk</small></span></a></li>
                <li><a href={`mailto:${SITE.email}`}><Icon name="mail" /><span>{SITE.email}</span></a></li>
                <li><a href={SITE.instagram} target="_blank" rel="noopener"><Icon name="ig" /><span>@alliancejjbrentwood</span></a></li>
                <li><span className="find__hours"><Icon name="clock" /><span>Mon to Thu 11 AM to 8 PM, Fri 11 AM to 7 PM<small>Saturday 9 AM to 12 PM, Sunday closed</small></span></span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="shell foot__grid">
        <div className="foot__brand">
          <a href="#top" className="foot__logo" aria-label={`${SITE.name}, back to top`}>
            <Logo className="foot__mk" />
            <span><b>Alliance Jiu Jitsu</b><span>Brentwood</span></span>
          </a>
          <p>Kids from five, adults from fourteen. On Lone Tree Way since 2007.</p>
          <div className="foot__social">
            <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Icon name="ig" /></a>
            <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Icon name="fb" /></a>
          </div>
        </div>
        <nav className="foot__col" aria-label="Programs">
          <p className="foot__h">Programs</p>
          {PROGRAMS.map((p) => <a key={p.name} href="#programs">{p.name}</a>)}
        </nav>
        <nav className="foot__col" aria-label="On this page">
          <p className="foot__h">The academy</p>
          {NAV.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          <a href="#faq">Questions</a>
          <a href="/book">Book a free class</a>
        </nav>
        <div className="foot__col">
          <p className="foot__h">Contact</p>
          <a href={SITE.phone.tel}><Icon name="phone" />{SITE.phone.display}</a>
          <a href={`mailto:${SITE.email}`}><Icon name="mail" />{SITE.email}</a>
          <a href={SITE.maps} target="_blank" rel="noopener"><Icon name="pin" />{SITE.street}, {SITE.city}</a>
        </div>
      </div>
      <div className="shell foot__base">
        <p>© 2026 {SITE.name}. All rights reserved.</p>
        <p>Website by <a href="https://novodash.com" target="_blank" rel="noopener">Novo Dash</a></p>
      </div>
    </footer>
  )
}
