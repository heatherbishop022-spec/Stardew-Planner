import { useState } from 'react'
import { SEASONS, PRIORITIES } from '../utils/stardew'

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1)

function TaskForm({ world, onAdd }) {
    const [text, setText] = useState('')
    const [priority, setPriority] = useState('Medium')
    const [realDate, setRealDate] = useState('')
    const [season, setSeason] = useState('')
    const [day, setDay] = useState(1)
    const [repeat, setRepeat] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        const trimmed = text.trim()
        if (!trimmed) return
        let date = null
        if (world === 'real') date = realDate || null
        else if (season) date = { season, day: Number(day) }
        onAdd({
            text: trimmed,
            priority,
            date,
            repeat: world === 'real' && Boolean(realDate) && repeat,
        })
        setText('')
        setRealDate('')
        setRepeat(false)
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={world === 'real' ? 'Add a real-life task...' : 'Add a game task...'}
                aria-label="Task description"
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
                {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                ))}
            </select>

            {world === 'real' ? (
                <>
                    <input
                        type="date"
                        value={realDate}
                        onChange={(e) => setRealDate(e.target.value)}
                        aria-label="Date"
                    />
                    {realDate && (
                        <label className="repeat-toggle">
                            <input
                                type="checkbox"
                                checked={repeat}
                                onChange={(e) => setRepeat(e.target.checked)}
                            />{' '}
                            Repeats every year
                        </label>
                    )}
                </>
            ) : (
                <>
            <select value={season} onChange={(e) => setSeason(e.target.value)} aria-label="Season">
                <option value="">No date</option>                    
                {SEASONS.map((s) => (
                     <option key={s}>{s}</option>
                 ))}
            </select>
                {season && (
                 <select value={day} onChange={(e) => setDay(e.target.value)} aria-label="Day">
                    {DAYS.map((d) => (
                        <option key={d} value={d}>
                            Day {d}
                            </option>
                    ))}
                  </select>
                )}
           </>
           )}
            <button type="submit" className="add-btn">
                Add
            </button>
        </form>
    )
}

export default TaskForm