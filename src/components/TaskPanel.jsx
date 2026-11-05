import { useState } from 'react'
import Dropdown from './Dropdown'
import TaskForm from './TaskForm'
import TaskItem from './TaskItem'
import { sortTasks, SORT_OPTIONS } from '../utils/stardew'

function TaskPanel({ world, taskApi, focusTaskId }) {
  const { tasks, addTask, updateTask, toggleTask, deleteTask } = taskApi
  const [sortBy, setSortBy] = useState('Order added')
  const sorted = sortTasks(tasks, sortBy)

  return (
    <div className="tasks-wrap">
      <TaskForm world={world} onAdd={addTask} />
      <div className="task-toolbar">
        <Dropdown label="Sort by" options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
      </div>
      <div className="task-list">
        {sorted.length === 0 && <p className="meta">No tasks yet. Add one above.</p>}
        {sorted.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            world={world}
            focused={t.id === focusTaskId}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskPanel