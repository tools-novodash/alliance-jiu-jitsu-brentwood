import type { Mk } from '../../data/site'

// The coach's marks on a frame, redrawn 12/11 (Adryan: the ring and the fat arrow looked cheap).
// A "ring" is now a square focus frame, four corner brackets like a camera locking on (the section is
// frame by frame, and the brand is square); an arrow is a thin curve with an open chevron head and a small
// square where it starts. Coordinates are % of the frame; the SVG keeps the frame's own ratio. Each stroke
// draws itself on mount (CSS: .pen), so a new frame redraws its marks.

const f2 = (n: number) => n.toFixed(2)

/** Four corner brackets around (cx, cy), half-sizes rx / ry, arms a third of the shorter side. */
function brackets(cx: number, cy: number, rx: number, ry: number) {
  const x0 = cx - rx, x1 = cx + rx, y0 = cy - ry, y1 = cy + ry
  const a = Math.min(rx, ry) * 0.62
  return [
    `M${f2(x0)} ${f2(y0 + a)} L${f2(x0)} ${f2(y0)} L${f2(x0 + a)} ${f2(y0)}`,
    `M${f2(x1 - a)} ${f2(y0)} L${f2(x1)} ${f2(y0)} L${f2(x1)} ${f2(y0 + a)}`,
    `M${f2(x1)} ${f2(y1 - a)} L${f2(x1)} ${f2(y1)} L${f2(x1 - a)} ${f2(y1)}`,
    `M${f2(x0 + a)} ${f2(y1)} L${f2(x0)} ${f2(y1)} L${f2(x0)} ${f2(y1 - a)}`,
  ]
}

/** A quadratic curve; the head is an open chevron along the last tangent. */
function arrow([x1, y1, cx, cy, x2, y2]: number[]) {
  const a = Math.atan2(y2 - cy, x2 - cx), L = 2.2, spread = 0.6
  const p = (d: number) => `${f2(x2 - Math.cos(a + d) * L)} ${f2(y2 - Math.sin(a + d) * L)}`
  return { body: `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, head: `M${p(spread)} L${x2} ${y2} L${p(-spread)}`, tail: { x: x1, y: y1 } }
}

export function Pencil({ marks, ratio }: { marks: Mk[]; ratio: number }) {
  const H = 100 / ratio
  const sy = H / 100
  let k = 0
  return (
    <div className="pen" aria-hidden="true">
      <svg viewBox={`0 0 100 ${f2(H)}`} preserveAspectRatio="none">
        {marks.map((m, i) => {
          if (m.k === 'ring') {
            const d = k++ * 0.18
            return (
              <g key={i} className="pen__focus" style={{ ['--d' as string]: `${d.toFixed(2)}s` }}>
                {brackets(m.x, m.y * sy, m.rx * 0.92, m.ry * sy * 0.92).map((p, j) => <path key={j} className="pen__br" pathLength={1} d={p} />)}
              </g>
            )
          }
          if (m.k === 'arrow') {
            const [x1, y1, cx, cy, x2, y2] = m.d
            const a = arrow([x1, y1 * sy, cx, cy * sy, x2, y2 * sy])
            const d = k++ * 0.18
            return (
              <g key={i}>
                <rect className="pen__dot" x={a.tail.x - 0.45} y={a.tail.y - 0.45} width={0.9} height={0.9} style={{ ['--d' as string]: `${d.toFixed(2)}s` }} />
                <path className="pen__line" pathLength={1} style={{ ['--d' as string]: `${(d + 0.05).toFixed(2)}s` }} d={a.body} />
                <path className="pen__head" pathLength={1} style={{ ['--d' as string]: `${(d + 0.6).toFixed(2)}s` }} d={a.head} />
              </g>
            )
          }
          return null
        })}
      </svg>
      {marks.map((m, i) => m.k === 'note' ? (
        <span key={i} className={`pen__note pen__note--${m.a ?? 'l'}`} style={{ left: `${m.x}%`, top: `${m.y}%`, ['--d' as string]: `${0.35 + i * 0.08}s` }}>{m.t}</span>
      ) : null)}
    </div>
  )
}
