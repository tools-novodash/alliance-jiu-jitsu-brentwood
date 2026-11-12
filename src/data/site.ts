import { img } from './img'

// Every fact on the page comes from the current site (reference/current-site/levantamento.md, 11/11/2026).
// Copy: copy/copy-lp.md. Visitor-facing text has no em dashes (house rule).

export const CTA = 'Book your free class'

export const SITE = {
  name: 'Alliance Jiu Jitsu Brentwood',
  short: 'Alliance Brentwood',
  phone: { display: '(925) 565-8211', tel: 'tel:+19255658211' },
  email: 'info@alliancejiujitsubrentwood.com',
  street: '6730 Lone Tree Way, Suite 8',
  city: 'Brentwood, CA 94513',
  maps: 'https://www.google.com/maps/search/?api=1&query=Alliance%20Jiu%20Jitsu%20Brentwood%2C%206730%20Lone%20Tree%20Way%20Suite%208%2C%20Brentwood%2C%20CA%2094513',
  // the redirect target of ?q=&output=embed (that one answers with X-Frame-Options and the map comes out blank)
  mapEmbed: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s6730+Lone+Tree+Way+Suite+8,+Brentwood,+CA+94513!6i15',
  instagram: 'https://www.instagram.com/alliancejjbrentwood',
  facebook: 'https://www.facebook.com/profile.php?id=61573567653217',
  hours: [
    ['Mon to Thu', '11 AM to 8 PM'],
    ['Friday', '11 AM to 7 PM'],
    ['Saturday', '9 AM to 12 PM'],
    ['Sunday', 'Closed'],
  ] as const,
}

export const NAV = [
  { href: '#programs', label: 'Programs' },
  { href: '#coaches', label: 'Coaches' },
  { href: '#schedule', label: 'Schedule' },
  { href: '#visit', label: 'Visit' },
]

/* ── hero: one still photo (the flipbook was dropped, Adryan 12/11) ── */
export const HERO = {
  h1a: 'Five years old or fifty.',
  h1b: 'The whole family trains here.',
  sub: 'Ricardo Barros opened this academy in 2007 because he wanted one room where everyone in a family could train. Kids from five, adults from fourteen, 38 classes a week.',
  micro: 'Adults get a private intro lesson. Kids join a normal class.',
  photo: img('kids8', 'An Eagle Youth class bowing to their coach on the mats at Alliance Jiu Jitsu Brentwood'),
  // phones only (Adryan 12/11: a more vertical photo there): a coach tying a kid's belt
  tall: img('ig_belt_kid', "A coach tying a young student's belt on the mats at Alliance Jiu Jitsu Brentwood"),
}

/* ── programs ── */
export type ProgramCard = { name: string; ages: string; per: number; text: string; photo: ReturnType<typeof img>; kind: 'kids' | 'adults' }
export const PROGRAMS: ProgramCard[] = [
  { kind: 'kids', name: 'Little Eagles', ages: 'Ages 5 to 7', per: 8, text: 'Forty-five minutes of games that happen to be jiu jitsu: balance, listening, and learning to fall without worrying about it.', photo: img('ig_frog_jumps', 'Little Eagles sitting along the wall while their coach shows a frog jump') },
  { kind: 'kids', name: 'Eagle Warrior', ages: 'Ages 8 to 10', per: 6, text: 'Real technique for kids old enough to work at it. Positions, escapes and controlled rolling, every weekday at 5 PM and Saturday morning.', photo: img('kids4', 'Two Eagle Warrior kids gripping up on the feet while a black belt coach walks the mat') },
  { kind: 'kids', name: 'Eagle Youth', ages: 'Ages 11 to 13', per: 5, text: 'The kids program that asks the most. Full classes with live rounds, two mornings, two evenings and Saturday.', photo: img('kids5', 'An Eagle Youth student holding a partner in side control during a live round') },
  { kind: 'adults', name: 'Fundamentals', ages: '14 and up, no experience', per: 7, text: 'Where everyone starts. Beginners only, no sparring, and never without a coach on the mat.', photo: img('fundamentals3', 'A student in a blue gi working from the top while his partner defends') },
  { kind: 'adults', name: 'Intermediate', ages: '14 and up, 2 stripes', per: 8, text: 'Finer detail and live sparring to test it. Most people keep training Fundamentals alongside it.', photo: img('training6', 'A student working an open guard against a standing partner') },
  { kind: 'adults', name: 'Comp Team', ages: 'Inside Intermediate', per: 3, text: 'Longer rounds, tournament rules and scoring. Nobody has to compete to train here, and most people do not.', photo: img('training7', 'Two students sparring, one working for control from the top') },
]

/* ── starting as an adult ── */
export const START = {
  tag: 'Starting as an adult',
  h2a: 'You do not spar',
  h2b: 'until you have sixty classes behind you.',
  lead: 'Fundamentals is a sixty class curriculum, taught seven times a week. Around the end of it your second stripe lands, and only then does sparring start.',
  items: [
    { q: 'I have never done anything like this.', a: 'Nobody in Fundamentals has done much more. The class is beginners only.' },
    { q: 'I will look stupid in front of everyone.', a: 'Your first class is a private lesson: you and a coach, at your pace, every question answered on the spot.' },
    { q: 'I am not in shape.', a: 'There is no fitness requirement. The room has people in their twenties and people in their fifties.' },
    { q: 'I will get hurt.', a: 'No sparring in Fundamentals. You drill with a partner giving light resistance while a coach walks the room.' },
    { q: 'What do I need to buy?', a: 'Nothing for the first class. Shorts or leggings and a t-shirt. A gi only once you have decided to stay.' },
  ],
}

/* ── frame by frame: two kids sequences with the coach's pencil on them ── */
// Marks are in % of the frame (x across, y down), placed by eye on the frames (scripts: none).
export type Mk =
  | { k: 'ring'; x: number; y: number; rx: number; ry: number }
  | { k: 'arrow'; d: [number, number, number, number, number, number] } // from x,y via cx,cy to x,y
  | { k: 'note'; x: number; y: number; t: string; a?: 'l' | 'r' }
type Frame = { photo: ReturnType<typeof img>; label: string; marks: Mk[] }
export type Seq = { id: string; program: string; ages: string; move: string; ratio: number; frames: Frame[]; line: string }

const f = (name: string, label: string, marks: Mk[], alt = ''): Frame => ({ photo: img(name as 'takedown1', alt), label, marks })

export const SEQS: Seq[] = [
  {
    id: 'warrior', program: 'Eagle Warrior', ages: 'Ages 8 to 10', move: 'A takedown', ratio: 1600 / 1155,
    line: 'Real technique, taken all the way to the mat, with a black belt watching from two steps away.',
    frames: [
      f('takedown1', 'Face off', [{ k: 'ring', x: 27, y: 45, rx: 9, ry: 12 }, { k: 'note', x: 28, y: 22, t: 'hands up', a: 'l' }], 'Two Eagle Warrior kids, one in a black gi and one in blue, squaring up on the mats'),
      f('takedown2', 'Step in', [{ k: 'arrow', d: [26, 34, 34, 26, 41, 36] }]),
      f('takedown3', 'Change level', [{ k: 'arrow', d: [32, 50, 30, 60, 35, 70] }, { k: 'ring', x: 37, y: 85, rx: 6, ry: 5 }, { k: 'note', x: 16, y: 88, t: 'knee down', a: 'l' }]),
      f('takedown4', 'Drive through', [{ k: 'ring', x: 39, y: 67, rx: 7, ry: 9 }, { k: 'arrow', d: [26, 58, 33, 50, 44, 52] }]),
      f('takedown5', 'Lift and turn', [{ k: 'arrow', d: [62, 30, 70, 50, 60, 70] }]),
      f('takedown6', 'Down together', [{ k: 'ring', x: 50, y: 78, rx: 13, ry: 11 }]),
      f('takedown7', 'Land', [{ k: 'ring', x: 95, y: 55, rx: 6, ry: 30 }, { k: 'note', x: 86, y: 18, t: 'coach on the mat', a: 'r' }]),
    ],
  },
  {
    id: 'youth', program: 'Eagle Youth', ages: 'Ages 11 to 13', move: 'A hip throw', ratio: 1200 / 907,
    line: 'Breakfalls come first, and nobody throws anybody until both of them can land.',
    frames: [
      f('hipthrow1', 'Grip', [{ k: 'ring', x: 34, y: 46, rx: 10, ry: 9 }, { k: 'note', x: 50, y: 30, t: 'grips first', a: 'l' }], 'An Eagle Youth student in a white gi gripping a partner in blue before a hip throw'),
      f('hipthrow2', 'Turn in', [{ k: 'arrow', d: [52, 64, 48, 76, 36, 70] }]),
      f('hipthrow3', 'Hip under', [{ k: 'ring', x: 30, y: 66, rx: 9, ry: 10 }, { k: 'note', x: 44, y: 86, t: 'hip lower than his', a: 'l' }]),
      f('hipthrow4', 'Over the hip', [{ k: 'arrow', d: [10, 40, 32, 22, 54, 50] }]),
      f('hipthrow5', 'Land', [{ k: 'ring', x: 47, y: 74, rx: 6, ry: 8 }, { k: 'arrow', d: [64, 58, 58, 62, 53, 70] }, { k: 'note', x: 60, y: 52, t: 'she keeps the sleeve', a: 'l' }]),
    ],
  },
]

/* ── parents ── */
export const PARENTS = {
  tag: 'For parents',
  h2a: 'What shows up',
  h2b: 'at home first.',
  lead: 'Three kids programs, five to thirteen. The technique stays on the mat; this is what comes home.',
  // the progress card (Adryan 12/11): each habit and, in a few words, where it starts on the mat (the current site)
  rows: [
    { t: 'Listening the first time.', note: 'Little Eagles: forty-five minutes, mostly framed as games.' },
    { t: 'Waiting their turn.', note: 'Eagle Warrior: the class has a shape and they hold it.' },
    { t: 'Shaking a hand and looking at the person.', note: 'Every class: none of it can be done alone.' },
    { t: 'Coming back the week after a\nclass that did not go their way.', note: 'Every class: they lose rounds, and come back.' },
  ],
  stamp: 'Parents can watch any class',
}

/* ── coaches ── */
export const HEAD = {
  name: 'Ricardo Barros',
  role: 'Head instructor',
  belt: 'Black belt since 2003',
  photo: img('ricardo_barros', 'Ricardo Barros, head instructor of Alliance Jiu Jitsu Brentwood, in a white gi'),
  story: [
    'Judo from five in São Paulo, a brown belt by fifteen. He found jiu jitsu at eighteen and paid for it by cleaning the academy, the mats and the bathrooms, every day for a year.',
    'Vale tudo in Brazil, Greco-Roman wrestling for the national team in 2003. He ran the Ralph Gracie academy in Antioch until 2006 and opened his own room on Lone Tree Way in January 2007.',
  ],
  facts: [
    ['Purple and brown', 'from Ryan Gracie'],
    ['Black belt', 'from Ralph Gracie, 2003'],
    ['On Lone Tree Way', 'since January 2007'],
  ] as const,
}
export const TEAM = [
  { name: 'Connor Ohai', belt: 'Black belt, 2022', from: 'from Ricardo', photo: img('connor_ohai', 'Connor Ohai, black belt instructor'), text: 'Started at twelve, was helping teach by thirteen. A shy kid who was bullied, and jiu jitsu is what got him out of both.' },
  { name: 'Eric Rubio', belt: 'Black belt, 2023', from: 'from Ricardo', photo: img('eric_rubio', 'Eric Rubio, black belt instructor'), text: 'Training since 2010. His favorite students are beginners, the ones who walk in sure they are about to embarrass themselves.' },
  { name: 'Abigail Gordon', belt: 'Brown belt', from: 'under Ricardo since 2005', photo: img('abigail_gordon', 'Abigail Gordon, brown belt instructor'), text: 'A special education teacher who adapts what she teaches to the student in front of her, and wants girls to feel the mat is theirs too.' },
]

/* ── schedule (the current site, checked program page by program page) ── */
export type Slot = { t: string; p: string; ages: string; kids?: boolean }
const LE = { p: 'Little Eagles', ages: '5 to 7', kids: true }
const EW = { p: 'Eagle Warrior', ages: '8 to 10', kids: true }
const EY = { p: 'Eagle Youth', ages: '11 to 13', kids: true }
const FU = { p: 'Fundamentals', ages: '14+, beginners' }
const IN = { p: 'Intermediate', ages: '14+, 2 stripes' }
const CT = { p: 'Comp Team', ages: '14+' }
const NG = { p: 'No Gi', ages: '14+' }
export const WEEK: { d: string; short: string; slots: Slot[] }[] = [
  { d: 'Monday', short: 'Mon', slots: [{ t: '10:00 AM', ...LE }, { t: '11:00 AM', ...IN }, { t: '4:15 PM', ...LE }, { t: '5:00 PM', ...EW }, { t: '6:00 PM', ...FU }, { t: '6:00 PM', ...CT }, { t: '7:00 PM', ...IN }] },
  { d: 'Tuesday', short: 'Tue', slots: [{ t: '6:00 AM', ...IN }, { t: '10:00 AM', ...EY }, { t: '11:00 AM', ...FU }, { t: '4:15 PM', ...LE }, { t: '5:00 PM', ...EW }, { t: '6:00 PM', ...EY }, { t: '7:00 PM', ...FU }, { t: '7:00 PM', ...IN }] },
  { d: 'Wednesday', short: 'Wed', slots: [{ t: '6:00 AM', ...IN }, { t: '10:00 AM', ...LE }, { t: '11:00 AM', ...IN }, { t: '4:15 PM', ...LE }, { t: '5:00 PM', ...EW }, { t: '6:00 PM', ...FU }, { t: '6:00 PM', ...CT }, { t: '7:00 PM', ...NG }] },
  { d: 'Thursday', short: 'Thu', slots: [{ t: '10:00 AM', ...EY }, { t: '11:00 AM', ...FU }, { t: '4:15 PM', ...LE }, { t: '5:00 PM', ...EW }, { t: '6:00 PM', ...EY }, { t: '7:00 PM', ...FU }, { t: '7:00 PM', ...IN }] },
  { d: 'Friday', short: 'Fri', slots: [{ t: '11:00 AM', ...IN }, { t: '4:15 PM', ...LE }, { t: '5:00 PM', ...EW }, { t: '6:00 PM', ...CT }] },
  { d: 'Saturday', short: 'Sat', slots: [{ t: '9:00 AM', ...LE }, { t: '9:00 AM', ...EW }, { t: '10:00 AM', ...EY }, { t: '11:00 AM', ...FU }] },
]

/* ── first class: one general path in four steps (Adryan 12/11: no tabs per audience) ── */
export const STEPS = [
  { t: 'Get in touch', p: 'Fill in the form or call. Tell us who is training, an adult or a child, and roughly when in the week you are free.' },
  { t: 'Wear something you can move in', p: 'Shorts or leggings and a t-shirt. There is nothing to buy before you come.' },
  { t: 'Your first class', p: 'Adults get a private lesson with a coach, at their own pace. Kids go straight into a normal class with kids their age.' },
  { t: 'Then keep going', p: 'Adults move on to Fundamentals: beginners only, no sparring. Kids keep their class, and parents can watch any of them. A gi only once you have decided to stay.' },
]

/* ── FAQ: the questions in the voice of the fear ── */
export const FAQ = [
  { q: 'I have never trained. Is this the wrong place to start?', a: 'It is where everyone starts. Fundamentals is beginners only, runs seven times a week, and your first class is a private lesson with a coach.' },
  { q: 'Will I have to spar?', a: 'Not in Fundamentals. Sparring starts in Intermediate, after the sixty classes that earn your second stripe.' },
  { q: 'Am I too old for this?', a: 'The adult room has people in their twenties and people in their fifties, people who did a martial art twenty years ago and people who have never done anything.' },
  { q: 'My child is five. Is that too young?', a: 'Five is where Little Eagles starts: forty-five minutes, built around how long a six year old can hold their attention.' },
  { q: 'Can I stay and watch my kid?', a: 'Yes. Parents are welcome to sit and watch any class.' },
  { q: 'Do I have to compete?', a: 'No. Comp Team is there if you want it, three evenings a week. Most people here never compete.' },
  { q: 'Who teaches the classes?', a: 'Ricardo Barros and the coaches he trained: two black belts who earned the belt from him and a brown belt who has trained with him since 2005. At least one coach is on the mat for every class, most have two or three.' },
]
