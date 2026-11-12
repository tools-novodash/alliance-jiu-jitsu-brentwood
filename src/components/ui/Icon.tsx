const P = {
  phone: 'M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z',
  pin: 'M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z',
  mail: 'M3 5h18v14H3zm1.6 1.5L12 12l7.4-5.5',
  menu: 'M3 7h18M3 12h18M3 17h18',
  close: 'M5 5l14 14M19 5L5 19',
  ig: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5h.01',
  fb: 'M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z',
  prev: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
} as const

const STROKE = new Set(['mail', 'menu', 'close', 'ig', 'prev', 'next', 'clock'])

export function Icon({ name }: { name: keyof typeof P }) {
  const s = STROKE.has(name)
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill={s ? 'none' : 'currentColor'} stroke={s ? 'currentColor' : 'none'} strokeWidth={s ? 2 : 0} strokeLinecap="square">
      <path d={P[name]} />
    </svg>
  )
}
