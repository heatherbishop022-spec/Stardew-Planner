export const pad = (n) => String(n).padStart(2, '0')
export const toISO = (year, month0, day) => `${year}-${pad(month0 + 1)}-${pad(day)}`
export const daysIn = (year, month0) => new Date(year, month0 + 1, 0).getDate()
export const startWeekday = (year, month0) => new Date(year, month0, 1).getDay()

// A task with a date 'YYYY-MM-DD' lands on that day. Yearly tasks (friends'
// birthdays) land on the same month and day every year from then on.
export function taskOnDay(task, year, month0, day) {
    if (!task.date) return false
    const [y, m, d] = task.date.split('-').map(Number)
    if (m !== month0 + 1 || d !== day) return false
    return task.repeat ? year >= y : year === y
}