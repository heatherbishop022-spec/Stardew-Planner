import { useState, useEffect } from 'react'

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

export function useTasks(storageKey) {
  const [tasks, setTasks] = useState(() => load(storageKey))

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks))
    } catch {
      // storage can be blocked; the list still works for this visit
    }
  }, [storageKey, tasks])

  function addTask({ text, priority, date, repeat = false }) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setTasks((prev) => [
      ...prev,
      { id, text, priority, date, repeat, done: false, completedAt: null },
    ])
  }

  function updateTask(id, changes) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, completedAt: t.done ? null : Date.now() }
          : t
      )
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return { tasks, addTask, updateTask, toggleTask, deleteTask }
}