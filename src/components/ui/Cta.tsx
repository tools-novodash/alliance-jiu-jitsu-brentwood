import type { MouseEvent } from 'react'
import { CTA } from '../../data/site'
import { cn } from '../../lib/utils'
import { useBooking } from '../../nd'
import { Mark } from './Logo'

type Props = { label?: string; className?: string; audience?: 'kids' | 'adults'; size?: 'md' | 'sm' }

/** The booking button: a red block, the Alliance triangle white in a darker square, a square ring pulsing
 *  out of it, a fill that sweeps on hover. A link to #book (the kit opens its form); `audience` narrows it. */
export function Cta({ label = CTA, className, audience, size = 'md' }: Props) {
  const { open } = useBooking()
  const onClick = audience ? (e: MouseEvent) => { e.preventDefault(); open({ audience }) } : undefined
  return (
    <a href="#book" className={cn('cta', size === 'sm' && 'cta--sm', className)} onClick={onClick}>
      <span className="cta__t">{label}</span>
      <span className="cta__m" aria-hidden="true"><Mark /></span>
    </a>
  )
}


/** Eyebrow: condensed caps with the small triangle chip. */
export function Tag({ children, light }: { children: string; light?: boolean }) {
  return <p className={cn('tag', light && 'tag--l')}>{children}</p>
}
