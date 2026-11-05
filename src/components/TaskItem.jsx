import { useState, useRef, useEffect } from 'react'
import { formatTaskDate, PRIORITIES, SEASONS } from '../utils/stardew'

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1)

function TaskItem({ task, world, focused, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(task.text)
  const [priority, setPriority] = useState(task.priority)
  const [realDate, setRealDate] = useState('')
  const [repeat, setRepeat] = useState(false)
  const [season, setSeason] = useState('')
  const [day, setDay] = useState(1)
  const ref = useRef(null)

  useEffect(() => {
    if (focused) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [focused])

  function startEdit() {
    setText(task.text)
    setPriority(task.priority)
    if (world === 'game') {
      setSeason(task.date ? task.date.season : '')
      setDay(task.date ? task.date.day : 1)
    } else {
      setRealDate(task.date || '')
      setRepeat(Boolean(task.repeat))
    }
    setEditing(true)
  }

  function save() {
    const trimmed = text.trim()
    if (!trimmed) {
      setEditing(false)
      return
    }
    const changes = { text: trimmed, priority }
    if (world === 'game') {
      changes.date = season ? { season, day: Number(day) } : null
    } else {
      changes.date = realDate || null
      changes.repeat = Boolean(realDate) && repeat
    }
    onUpdate(task.id, changes)
    setEditing(false)
  }

  const cls = [
    'task',
    task.done ? 'task-done' : `task-${task.priority.toLowerCase()}`,
    focused && 'task-focus',
  ]
    .filter(Boolean)
    .join(' ')
  const dateLabel = formatTaskDate(world, task.date)

  return (
    <div className={cls} ref={ref}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.text}" complete`}
      />
      {editing ? (
        <div className="task-edit">
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          {world === 'game' ? (
            <>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                aria-label="Season"
              >
                <option value="">No date</option>
                {SEASONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {season && (
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  aria-label="Day"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              )}
            </>
          ) : (
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
          )}

          <button className="task-btn" onClick={save}>Save</button>
          <button className="task-btn" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <div className="task-body">
            <p className="task-text">{task.text}</p>
            <p className="task-meta">
              {task.done ? 'Done' : task.priority}
              {dateLabel && ` · ${dateLabel}`}
              {task.repeat && ' · every year'}
            </p>
          </div>
          <div className="task-actions">
            <button className="task-btn" onClick={startEdit}>Edit</button>
            <button className="task-btn" onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  )
}

export default TaskItem