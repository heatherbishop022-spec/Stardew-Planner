import { useState } from 'react'
import { formatTaskDate, PRIORITIES } from '../utils/stardew'

function TaskItem({ task, world, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(task.text)
  const [priority, setPriority] = useState(task.priority)

  function startEdit() {
    setText(task.text)
    setPriority(task.priority)
    setEditing(true)
  }

  function save() {
    const trimmed = text.trim()
    if (trimmed) onUpdate(task.id, { text: trimmed, priority })
    setEditing(false)
  }

  const cls = task.done ? 'task task-done' : `task task-${task.priority.toLowerCase()}`
  const dateLabel = formatTaskDate(world, task.date)

  return (
    <div className={cls}>
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