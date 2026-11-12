import { Accordion as Base } from '@base-ui/react/accordion'

type Item = { q: string; a: string }

/**
 * The FAQ on Base UI's unstyled primitive (aria-expanded, keyboard, height var):
 * white card, 1px border, radius 18; open = yellow, the + in a circle turns 45° (PRD 8.9).
 * One open at a time, the first open on arrival (Adryan 12/11); the height eases through --accordion-panel-height.
 */
export function Accordion({ items, className = 'faq__list' }: { items: Item[]; className?: string }) {
  return (
    <Base.Root className={className} multiple={false} defaultValue={items.length ? [items[0].q] : []}>
      {items.map((it) => (
        <Base.Item key={it.q} className="qa" value={it.q}>
          <Base.Header render={<h3 />}>
            <Base.Trigger className="qa__q">{it.q}<span className="pm" aria-hidden="true" /></Base.Trigger>
          </Base.Header>
          <Base.Panel className="qa__a"><p>{it.a}</p></Base.Panel>
        </Base.Item>
      ))}
    </Base.Root>
  )
}
