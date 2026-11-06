import { useState } from 'react'
import CalendarGrid from './CalendarGrid'
import { Portrait } from './BirthdayList'
import { FESTIVALS, festivalDays, filterBirthdays } from '../utils/stardew'

function GameCalendar({ season, birthdays, taskApi, onOpenTask }) {
    const [selected, setSelected] = useState(null)

    const seasonBirthdays = filterBirthdays(birthdays, season)
    const festivals = FESTIVALS[season] || []
    const seasonTasks = taskApi.tasks.filter((t) => t.date && t.date.season === season)

    const dots = {}
    const addDot = (day, kind) => {
        dots[day] = [...(dots[day] || []), kind]
    }
    seasonBirthdays.forEach((b) => addDot(b.day, 'event'))
    festivals.forEach((f) => festivalDays(f).forEach((d) => addDot(d, 'event')))
    seasonTasks.filter((t) => !t.done).forEach((t) => addDot(t.date.day, 'task'))

    const dayBirthdays = seasonBirthdays.filter((b) => b.day === selected)
    const dayFestivals = festivals.filter((f) => festivalDays(f).includes(selected))
    const dayTasks = seasonTasks.filter((t) => t.date.day === selected)
    const empty = dayBirthdays.length + dayFestivals.length + dayTasks.length === 0

    return (
        <div className="cal-wrap">
            <CalendarGrid
                daysInMonth={28}
                dots={dots}
                selectedDay={selected}
                onSelect={setSelected}
            />

            <div className="cal-detail">
                {selected === null ? (
                    <p className="meta">Tap a day to see what's happening.</p>
                ) : (
                    <>
                        <h4>
                            {season} {selected}
                        </h4>
                        {empty && <p className="meta">Nothing planned for this day.</p>}
                        {dayFestivals.map((f) => (
                            <div key={f.name} className="cal-item">
                                <span className="tag">Festival</span>
                                <span>{f.name}</span>
                            </div>
                        ))}
                            {dayBirthdays.map((b) => (
                                <div key={b.name} className="cal-item cal-birthday">
                                    <Portrait name={b.name} src={b.portrait || b.icon} />
                                    <div className="cal-birthday-info">
                                        <span>{b.name}'s birthday</span>
                                        {b.loves && b.loves.length > 0 && (
                                            <div className="loves">
                                                <span className="loves-label">Loves:</span>
                                                {b.loves.map((g) => (
                                                    <span key={g.name} className="love-item">
                                                        {g.icon && <img src={g.icon} alt="" width="20" height="20" />}
                                                        {g.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {dayTasks.map((t) => (
                                <button key={t.id} className="cal-item cal-link" onClick={() => onOpenTask(t.id)}>
                                    <span className="tag">{t.done ? 'Done' : t.priority}</span>
                                    <span className={t.done ? 'cal-done' : ''}>{t.text}</span>
                                    <span className="cal-go">View in tasks →</span>
                                </button>
                            ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default GameCalendar