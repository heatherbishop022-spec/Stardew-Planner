const DEFAULT_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function CalendarGrid({
    daysInMonth,
    startOffset = 0,
    weekdays = DEFAULT_WEEKDAYS,
    dots = {},
    selectedDay,
    todayDay,
    onSelect,
}) {
    const blanks = Array.from({ length: startOffset }, (_, i) => `blank-${i}`)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    return (
        <div className="cal-grid">
            {weekdays.map((w) => (
                <div key={w} className="cal-head">
                    {w}
                </div>
            ))}
            {blanks.map((k) => (
                <div key={k} />
            ))}
            {days.map((d) => {
                const kinds = dots[d] || []
                const cls = ['cal-day', d === selectedDay && 'selected', d === todayDay && 'today']
                    .filter(Boolean)
                    .join(' ')
                return (
                    <button
                        key={d}
                        className={cls}
                        onClick={() => onSelect(d)}
                        aria-pressed={d === selectedDay}
                        aria-label={`Day ${d}${kinds.length ? `, ${kinds.length} items` : ''}`}
                    >
                        <span>{d}</span>
                        <span className="cal-dots">
                            {kinds.slice(0, 3).map((k, i) => (
                                <span key={i} className={k === 'task' ? 'dot dot-task' : 'dot'} />
                            ))}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

export default CalendarGrid