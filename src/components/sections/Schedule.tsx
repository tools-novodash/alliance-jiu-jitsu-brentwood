import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { WEEK, type Slot } from '../../data/site'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { useBooking } from '../../nd'
import { Cta, Tag } from '../ui/Cta'

type Filter = 'all' | 'kids' | 'adults'
const FILTERS: { k: Filter; label: string }[] = [{ k: 'all', label: 'All classes' }, { k: 'kids', label: 'Kids and teens' }, { k: 'adults', label: 'Adults, 14+' }]
const DAYS = [...WEEK.map((w) => w.short), 'Sun'] as const
const LONG: Record<string, string> = Object.fromEntries([...WEEK.map((w) => [w.short, w.d]), ['Sun', 'Sunday']])

const mins = (t: string) => { const [h, rest] = t.split(':'); const m = parseInt(rest); const pm = rest.includes('PM'); return ((parseInt(h) % 12) + (pm ? 12 : 0)) * 60 + m }
const fmt = (m: number) => { const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }
// Little Eagles runs 45 minutes on weekdays; every other class an hour (the current site)
const until = (s: Slot, day: string) => fmt(mins(s.t) + (s.p === 'Little Eagles' && day !== 'Sat' ? 45 : 60))
const ROWS = [...new Set(WEEK.flatMap((w) => w.slots.map((s) => s.t)))].sort((a, b) => mins(a) - mins(b))
const on = (day: string) => WEEK.find((w) => w.short === day)?.slots ?? []

/**
 * The schedule in the house pattern (Lobo, Cristyan): the week as a wall board on desktop (times down,
 * days across, Sunday hatched, today tagged in Brentwood time), day tabs and a list on phones. Filters for
 * kids and adults. Every class is a button that opens the booking form on that audience.
 */
export function Schedule() {
  const root = useRef<HTMLElement>(null)
  const { open } = useBooking()
  const [filter, setFilter] = useState<Filter>('all')
  const [today, setToday] = useState<string | null>(null)
  const [day, setDay] = useState('Mon')
  useEffect(() => {
    try {
      const d = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/Los_Angeles' }).format(new Date())
      setToday(d); setDay(d === 'Sun' ? 'Mon' : d)
    } catch { /* no time zones: no Today tag */ }
  }, [])
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })

  const kind = (s: Slot) => (s.kids ? 'kids' : 'adults')
  const shown = (s: Slot) => filter === 'all' || kind(s) === filter
  const book = (s: Slot) => open({ audience: kind(s) })
  const list = on(day).filter(shown)
  const tabs = DAYS.filter((d) => d !== 'Sun')
  const onKey = (e: KeyboardEvent) => {
    const i = tabs.indexOf(day as typeof tabs[number]), n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!n) return
    e.preventDefault()
    const next = tabs[(i + n + tabs.length) % tabs.length]
    setDay(next)
    root.current?.querySelector<HTMLElement>(`#sc-tab-${next}`)?.focus()
  }

  return (
    <section className="sec sc" id="schedule" ref={root} aria-labelledby="sc-h">
      <div className="shell">
        <div className="sch__head">
          <div>
            <Tag>Schedule</Tag>
            <h2 id="sc-h" className="t t-1">Six days a week. <span className="hl">One drive for the whole family.</span></h2>
            <p className="lead sch__note">Brentwood time. Tap any class to book your free first class in it.</p>
          </div>
          <div className="filters" role="group" aria-label="Filter classes">
            {FILTERS.map((f) => <button key={f.k} type="button" aria-pressed={filter === f.k} onClick={() => setFilter(f.k)}>{f.label}</button>)}
          </div>
        </div>

        <div className="board">
          <table>
            <caption className="sr">Weekly class schedule, Monday to Saturday</caption>
            <thead>
              <tr>
                <th scope="col">Time</th>
                {DAYS.map((d) => (
                  <th scope="col" key={d} className={d === today ? 'today' : undefined} aria-label={LONG[d]}>
                    <b>{d}</b>{d === today ? <small>Today</small> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((t, r) => (
                <tr key={t}>
                  <th scope="row">{t}</th>
                  {DAYS.map((d) => {
                    if (d === 'Sun') return r ? null : <td key={d} className="none" rowSpan={ROWS.length}><span>No classes</span></td>
                    return (
                      <td key={d} className={d === today ? 'today' : undefined}>
                        {on(d).filter((s) => s.t === t).map((s) => (
                          <button key={s.p} type="button" className={`cls${shown(s) ? '' : ' dim'}`} data-k={kind(s)} tabIndex={shown(s) ? undefined : -1} aria-hidden={shown(s) ? undefined : true} onClick={() => book(s)}>
                            <b>{s.p}</b><small>{s.ages} · until {until(s, d)}</small>
                          </button>
                        ))}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="daytabs" role="tablist" aria-label="Day of the week" onKeyDown={onKey}>
          {tabs.map((d) => (
            <button key={d} id={`sc-tab-${d}`} type="button" role="tab" aria-selected={d === day} aria-controls="sc-day" tabIndex={d === day ? 0 : -1} className={d === today ? 'today' : undefined} onClick={() => setDay(d)}>{d}</button>
          ))}
        </div>
        <div role="tabpanel" id="sc-day" aria-labelledby={`sc-tab-${day}`}>
          <ul className="dayslots" role="list">
            {list.length ? list.map((s) => (
              <li key={s.t + s.p}>
                <button type="button" data-k={kind(s)} onClick={() => book(s)}>
                  <time>{s.t}</time>
                  <span><b>{s.p}</b><small>{s.ages} · until {until(s, day)}</small></span>
                  <span className="go">Book</span>
                </button>
              </li>
            )) : <li className="dayslots__none">No {filter === 'kids' ? 'kids ' : filter === 'adults' ? 'adult ' : ''}class on {LONG[day]}.</li>}
          </ul>
        </div>

        <div className="sch__foot">
          <span><b>Same drive, both classes:</b> Eagle Warrior at 5 PM then Fundamentals at 6 on Mon and Wed, Eagle Youth at 6 then Fundamentals at 7 on Tue and Thu, and 9, 10, 11 on Saturday.</span>
          <Cta size="sm" />
        </div>
      </div>
    </section>
  )
}
