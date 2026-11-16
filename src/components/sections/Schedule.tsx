import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { shortName, timeLabel, useBooking, useSchedule, type ScheduleEntry } from '../../nd'
import { Cta, Tag } from '../ui/Cta'

type Filter = 'all' | 'kids' | 'adults'
const FILTERS: { k: Filter; label: string }[] = [{ k: 'all', label: 'All classes' }, { k: 'kids', label: 'Kids and teens' }, { k: 'adults', label: 'Adults' }]
const SKELETON_ROWS = 6

const short = (name: string) => name.slice(0, 3)
// the age travels in the class name the app sends, "Kids BJJ (Ages 5-7)"; shortName drops it, the hint shows it
const age = (e: ScheduleEntry) => e.program.name.match(/\(([^)]*\d[^)]*)\)/)?.[1] ?? null
const hint = (e: ScheduleEntry) => [age(e), e.to ? `until ${timeLabel(e.to)}` : null].filter(Boolean).join(' · ')

/**
 * The schedule in the house pattern (Lobo, Cristyan): the week as a wall board on desktop (times down,
 * days across, a day with no class hatched, today tagged in Brentwood time), day tabs and a list on phones.
 * Filters for kids and adults. Every class is live from the Novo Dash app through the kit (useSchedule, the
 * same list as the booking form): nothing here is written by hand, and a class opens the form on itself.
 */
export function Schedule() {
  const root = useRef<HTMLElement>(null)
  const { open } = useBooking()
  const { status, days } = useSchedule()
  const [filter, setFilter] = useState<Filter>('all')
  const [today, setToday] = useState<string | null>(null)
  const [day, setDay] = useState<string | null>(null)
  useEffect(() => {
    try { setToday(new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'America/Los_Angeles' }).format(new Date())) } catch { /* no time zones: no Today tag */ }
  }, [])
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })

  const shown = (e: ScheduleEntry) => filter === 'all' || e.program.audience === filter
  const book = (e: ScheduleEntry) => open({ calendarId: e.program.calendar_id })
  const rows = [...new Set(days.flatMap((d) => d.entries.map((e) => e.from)))].sort()
  const tabs = days.filter((d) => d.entries.length)
  const cur = tabs.find((d) => d.name === day) ?? tabs.find((d) => d.name === today) ?? tabs[0]
  const list = cur ? cur.entries.filter(shown) : []
  const onKey = (e: KeyboardEvent) => {
    const i = tabs.findIndex((d) => d === cur), n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!n || i < 0) return
    e.preventDefault()
    const next = tabs[(i + n + tabs.length) % tabs.length]
    setDay(next.name)
    root.current?.querySelector<HTMLElement>(`#sc-tab-${short(next.name)}`)?.focus()
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
          {status !== 'error' ? (
            <div className="filters" role="group" aria-label="Filter classes">
              {FILTERS.map((f) => <button key={f.k} type="button" aria-pressed={filter === f.k} onClick={() => setFilter(f.k)}>{f.label}</button>)}
            </div>
          ) : null}
        </div>

        {status === 'error' ? (
          <div className="sch__err">
            <Cta label="See class times and book your free class" />
          </div>
        ) : (
          <div className="sch__live" aria-busy={status === 'loading'}>
            <div className="board">
              <table>
                <caption className="sr">Weekly class schedule, Monday to Sunday</caption>
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    {(status === 'ready' ? days : NAMES).map((d) => {
                      const name = typeof d === 'string' ? d : d.name
                      return (
                        <th scope="col" key={name} className={name === today ? 'today' : undefined} aria-label={name}>
                          <b>{short(name)}</b>{name === today ? <small>Today</small> : null}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {status === 'ready' ? rows.map((t, r) => (
                    <tr key={t}>
                      <th scope="row">{timeLabel(t)}</th>
                      {days.map((d) => {
                        if (!d.entries.length) return r ? null : <td key={d.name} className="none" rowSpan={rows.length}><span>No classes</span></td>
                        return (
                          <td key={d.name} className={d.name === today ? 'today' : undefined}>
                            {d.entries.filter((e) => e.from === t).map((e) => (
                              <button key={e.program.calendar_id} type="button" className={`cls${shown(e) ? '' : ' dim'}`} data-k={e.program.audience} tabIndex={shown(e) ? undefined : -1} aria-hidden={shown(e) ? undefined : true} onClick={() => book(e)}>
                                <b>{shortName(e.program)}</b><small>{hint(e)}</small>
                              </button>
                            ))}
                          </td>
                        )
                      })}
                    </tr>
                  )) : Array.from({ length: SKELETON_ROWS }, (_, r) => (
                    <tr key={r} className="sk">
                      <th scope="row"><i /></th>
                      {NAMES.map((n) => <td key={n}><i /></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              {status === 'loading' ? <p className="sch__loading">Loading schedule…</p> : null}
            </div>

            <div className="daytabs" role="tablist" aria-label="Day of the week" onKeyDown={onKey}>
              {(status === 'ready' ? tabs.map((d) => d.name) : NAMES.slice(0, 6)).map((name) => (
                <button key={name} id={`sc-tab-${short(name)}`} type="button" role="tab" aria-selected={name === cur?.name} aria-controls="sc-day" tabIndex={name === cur?.name ? 0 : -1} className={name === today ? 'today' : undefined} onClick={() => setDay(name)} disabled={status !== 'ready'}>{short(name)}</button>
              ))}
            </div>
            <div role="tabpanel" id="sc-day" aria-labelledby={cur ? `sc-tab-${short(cur.name)}` : undefined}>
              <ul className="dayslots" role="list">
                {status !== 'ready' ? Array.from({ length: 4 }, (_, i) => <li key={i} className="sk"><i /></li>)
                  : list.length ? list.map((e) => (
                    <li key={e.from + e.program.calendar_id}>
                      <button type="button" data-k={e.program.audience} onClick={() => book(e)}>
                        <time>{timeLabel(e.from)}</time>
                        <span><b>{shortName(e.program)}</b><small>{hint(e)}</small></span>
                        <span className="go">Book</span>
                      </button>
                    </li>
                  )) : <li className="dayslots__none">No {filter === 'kids' ? 'kids ' : filter === 'adults' ? 'adult ' : ''}class on {cur?.name ?? 'this day'}.</li>}
              </ul>
            </div>
          </div>
        )}

        {status !== 'error' ? (
          <div className="sch__foot">
            <span>Kids and adult classes in the same building, so one drive can cover the whole family.</span>
            <Cta size="sm" />
          </div>
        ) : null}
      </div>
    </section>
  )
}

const NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
