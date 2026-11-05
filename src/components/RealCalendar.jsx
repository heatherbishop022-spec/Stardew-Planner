import { useState } from 'react'
import CalendarGrid from './CalendarGrid'
import { useHolidays } from '../hooks/useHolidays'
import { daysIn, startWeekday, taskOnDay, toISO } from '../utils/dates'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function RealCalendar({ taskApi, onOpenTask }) {
    const now = new Date()
    const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })
    const [selected, setSelected] = useState(now.getDate())
    const { holidays, error } = useHolidays(view.year)

    const { year, month } = view
    const total = daysIn(year, month)
    const isThisMonth = year === now.getFullYear() && month === now.getMonth()
    const monthPrefix = toISO(year, month, 1).slice(0, 8)
    const monthHolidays = holidays.filter((h) => h.date.startsWith(monthPrefix))

    const dots = {}
    const addDot = (day, kind) => {
        dots[day] = [...(dots[day] || []), kind]
    }
    monthHolidays.forEach((h) => addDot(Number(h.date.slice(8)), 'event'))
    taskApi.tasks
        .filter((t) => !t.done)
        .forEach((t) => {
            for (let d = 1; d <= total; d++) {
                if (taskOnDay(t, year, month, d)) addDot(d, 'task')
            }
        })

    const selectedISO = selected ? toISO(year, month, selected) : null
    const dayHolidays = monthHolidays.filter((h) => h.date === selectedISO)
    const dayTasks = selected
        ? taskApi.tasks.filter((t) => taskOnDay(t, year, month, selected))
        : []
    const empty = dayHolidays.length + dayTasks.length === 0

    const title = new Date(year, month, 1).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
    })

    function shift(delta) {
        const d = new Date(year, month + delta, 1)
        setView({ year: d.getFullYear(), month: d.getMonth() })
        setSelected(null)
    }

    function goToday() {
        setView({ year: now.getFullYear(), month: now.getMonth() })
        setSelected(now.getDate())
    }

    return (
        <div className="cal-wrap">
            <div className="cal-nav">
                <button className="task-btn" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
                <strong>{title}</strong>
                <button className="task-btn" onClick={() => shift(1)} aria-label="Next month">›</button>
                <button className="task-btn" onClick={goToday}>Today</button>
            </div>

            {error && <p className="error">Holidays unavailable: {error}</p>}

            <CalendarGrid
                daysInMonth={total}
                startOffset={startWeekday(year, month)}
                weekdays={WEEKDAYS}
                dots={dots}
                selectedDay={selected}
                todayDay={isThisMonth ? now.getDate() : null}
                onSelect={setSelected}
            />

            <div className="cal-detail">
                {selected === null ? (
                    <p className="meta">Tap a day to see what's on it.</p>
                ) : (
                    <>
                        <h4>
                            {new Date(year, month, selected).toLocaleDateString(undefined, {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </h4>
                        {empty && <p className="meta">Nothing planned for this day.</p>}
                        {dayHolidays.map((h) => (
                            <div key={h.date + h.name} className="cal-item">
                                <span className="tag">Holiday</span>
                                <span>{h.name}</span>
                            </div>
                        ))}
                        {dayTasks.map((t) => (
                            <button key={t.id} className="cal-item cal-link" onClick={() => onOpenTask(t.id)}>
                                <span className="tag">{t.done ? 'Done' : t.priority}</span>
                                <span className={t.done ? 'cal-done' : ''}>
                                    {t.text}
                                    {t.repeat && ' (every year)'}
                                </span>
                                <span className="cal-go">View in tasks →</span>
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default RealCalendar