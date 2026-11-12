import { useEffect, useRef, useState } from 'react'

/**
 * A horizontal rail you can swipe, drag with the mouse, or step with arrows (Adryan, 11/11: on a narrow
 * desktop window the cards would not move and there were no arrows). Returns the scroller ref, a `go`
 * that steps one card (+1 / -1), and where you are: `at` (the card at the start) and `count`. Pass `dep`
 * when the rail element is swapped (a tab that remounts its list).
 */
export function useRail<T extends HTMLElement>(dep?: unknown) {
  const ref = useRef<T>(null)
  const [at, setAt] = useState(0)
  const [count, setCount] = useState(0)
  useEffect(() => {
    const t = ref.current
    if (!t) return
    const step = () => { const c = t.firstElementChild as HTMLElement | null; return c ? c.offsetWidth + (parseFloat(getComputedStyle(t).columnGap) || 0) : 1 }
    const onScroll = () => setAt(Math.round(t.scrollLeft / step()))
    setCount(t.children.length)
    let down = false, sx = 0, sl = 0, moved = 0
    const pd = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = t.scrollLeft; moved = 0 }
    const pm = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); if (moved > 6) t.classList.add('is-drag'); t.scrollLeft = sl - dx }
    const pu = () => { if (!down) return; down = false; requestAnimationFrame(() => t.classList.remove('is-drag')) }
    // a drag is not a click: swallow the click that ends a drag
    const ck = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0 } }
    t.addEventListener('scroll', onScroll, { passive: true })
    t.addEventListener('pointerdown', pd); addEventListener('pointermove', pm); addEventListener('pointerup', pu)
    t.addEventListener('click', ck, true)
    return () => { t.removeEventListener('scroll', onScroll); t.removeEventListener('pointerdown', pd); removeEventListener('pointermove', pm); removeEventListener('pointerup', pu); t.removeEventListener('click', ck, true) }
  }, [dep])
  const go = (d: number) => { const t = ref.current; if (!t) return; const c = t.firstElementChild as HTMLElement | null; t.scrollBy({ left: d * (c ? c.offsetWidth + (parseFloat(getComputedStyle(t).columnGap) || 0) : 300), behavior: 'smooth' }) }
  return { ref, go, at, count }
}
