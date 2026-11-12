import { FAQ, HEAD, PROGRAMS, SITE, TEAM, WEEK } from './data/site'
import type { Route } from './routes'

declare const __SITE__: string
export const ORIGIN: string = typeof __SITE__ === 'string' ? __SITE__ : 'http://localhost:4173'

const HOURS = [
  { d: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], o: '11:00', c: '20:00' },
  { d: ['Friday'], o: '11:00', c: '19:00' },
  { d: ['Saturday'], o: '09:00', c: '12:00' },
]

/** JSON-LD: the academy, its head instructor, the FAQ. Only facts from the current site; no rating
 *  markup (there is no verified rating yet). */
export function jsonLd(_route: Route) {
  void _route
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SportsActivityLocation', '@id': `${ORIGIN}/#academy`, name: SITE.name, url: `${ORIGIN}/`,
        image: `${ORIGIN}/og-image.jpg`, logo: `${ORIGIN}/images/logo-light.svg`, telephone: '+19255658211', email: SITE.email,
        description: 'Alliance Jiu Jitsu academy on Lone Tree Way in Brentwood, CA: kids programs from age 5 (Little Eagles, Eagle Warrior, Eagle Youth) and adult classes from 14 (Fundamentals, Intermediate, Comp Team). Head instructor Ricardo Barros, black belt since 2003. First class free.',
        address: { '@type': 'PostalAddress', streetAddress: SITE.street, addressLocality: 'Brentwood', addressRegion: 'CA', postalCode: '94513', addressCountry: 'US' },
        areaServed: ['Brentwood, CA', 'Oakley, CA', 'Antioch, CA', 'Discovery Bay, CA'],
        sport: 'Brazilian Jiu-Jitsu', knowsAbout: PROGRAMS.map((p) => p.name), foundingDate: '2007-01',
        openingHoursSpecification: HOURS.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.d.map((d) => `https://schema.org/${d}`), opens: h.o, closes: h.c })),
        sameAs: [SITE.instagram, SITE.facebook],
        founder: { '@id': `${ORIGIN}/#ricardo` },
        employee: [{ '@id': `${ORIGIN}/#ricardo` }, ...TEAM.map((c) => ({ '@type': 'Person', name: c.name, jobTitle: `Instructor, ${c.belt.toLowerCase()}` }))],
        memberOf: { '@type': 'SportsOrganization', name: 'Alliance Jiu Jitsu' },
      },
      { '@type': 'Person', '@id': `${ORIGIN}/#ricardo`, name: HEAD.name, jobTitle: `${HEAD.role}, black belt`, description: 'Black belt from Ralph Gracie (2003); purple and brown belts from Ryan Gracie. Teaching on Lone Tree Way, Brentwood since January 2007.', worksFor: { '@id': `${ORIGIN}/#academy` } },
      { '@type': 'WebSite', '@id': `${ORIGIN}/#site`, url: `${ORIGIN}/`, name: SITE.name, publisher: { '@id': `${ORIGIN}/#academy` } },
      { '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  }
}

/** llms.txt: the academy in plain text for AI search. */
export function llms() {
  return `# ${SITE.name}

> Alliance Jiu Jitsu academy in Brentwood, California, open since January 2007. Kids classes from age 5 in three age groups, adult classes from age 14, 38 classes a week, Monday to Saturday. Head instructor Ricardo Barros, black belt from Ralph Gracie (2003). First class free: adults get a private intro lesson, kids join a normal class.

- Address: ${SITE.street}, ${SITE.city}
- Phone: ${SITE.phone.display}
- Email: ${SITE.email}
- Front desk: ${SITE.hours.map(([d, h]) => `${d} ${h}`).join('; ')}

## Programs
${PROGRAMS.map((p) => `- ${p.name} (${p.ages}): ${p.per} classes a week. ${p.text}`).join('\n')}

## Weekly schedule
${WEEK.map((w) => `- ${w.d}: ${w.slots.map((s) => `${s.t} ${s.p}`).join(', ')}`).join('\n')}

## Coaches
- ${HEAD.name}, head instructor, black belt since 2003
${TEAM.map((c) => `- ${c.name}, ${c.belt}`).join('\n')}

## FAQ
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}
`
}
