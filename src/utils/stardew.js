export const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter']
export const WEATHER_OPTIONS = ['Sunny', 'Rain', 'Storm', 'Snow']

export function toStardewWeather(code) {
  if (code >= 95) return 'Storm'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'Rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'Snow'
  return 'Sunny'
}

export function toStardewSeason(date) {
  const month = date.getMonth()
  if (month >= 2 && month <= 4) return 'Spring'
  if (month >= 5 && month <= 7) return 'Summer'
  if (month >= 8 && month <= 10) return 'Fall'
  return 'Winter'
}

const isGinger = (loc) => /ginger island|volcano|pirate cove/i.test(loc)

export function filterFish(fish, season, weather, showGinger) {
  const fishWeather = weather === 'Rain' || weather === 'Storm' ? 'Rain' : 'Sun'
  return fish
    .map((f) =>
      showGinger ? f : { ...f, locations: f.locations.filter((l) => !isGinger(l)) }
    )
    .filter((f) => f.locations.length > 0)
    .filter((f) => f.seasons.includes(season) && f.weather.includes(fishWeather))
}

export const LUCK_LEVELS = ['Very lucky', 'Lucky', 'Neutral', 'Unlucky', 'Very unlucky']

export const LUCK_TIPS = {
  'Very lucky': 'Great day to go mining or dig for artifacts.',
  Lucky: 'Good day for the mines and foraging.',
  Neutral: 'A normal day. Nothing special to plan around.',
  Unlucky: 'Slightly worse odds today. Fine for farm chores.',
  'Very unlucky': 'Poor odds today. Maybe stay on the farm.',
}

export function filterCrops(crops, season) {
  return crops.filter((c) => c.season === season)
}

export const FESTIVALS = {
  Spring: [
    { name: 'Egg Festival', day: '13' },
    { name: 'Flower Dance', day: '24' },
  ],
  Summer: [
    { name: 'Luau', day: '11' },
    { name: 'Dance of the Moonlight Jellies', day: '28' },
  ],
  Fall: [
    { name: 'Stardew Valley Fair', day: '16' },
    { name: "Spirit's Eve", day: '27' },
  ],
  Winter: [
    { name: 'Festival of Ice', day: '8' },
    { name: 'Night Market', day: '15–17' },
    { name: 'Feast of the Winter Star', day: '25' },
  ],
}

export function festivalText(season) {
  const list = FESTIVALS[season] || []
  if (list.length === 0) return 'No festivals this season.'
  return (
    `${season} festivals: ` +
    list.map((f) => `${f.name} (day ${f.day})`).join(', ') +
    '.'
  )
}

export function filterBirthdays(birthdays, season) {
  return birthdays.filter((b) => b.season === season).sort((a, b) => a.day - b.day)
}

export const PRIORITIES = ['High', 'Medium', 'Low']
export const SORT_OPTIONS = ['Order added', 'Priority', 'Completed']

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 }

export function sortTasks(tasks, sortBy) {
  const open = tasks.filter((t) => !t.done)
  const done = tasks
    .filter((t) => t.done)
    .sort((a, b) => a.completedAt - b.completedAt)

  if (sortBy === 'Priority') {
    open.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
  }
  // "Completed" puts finished tasks first; otherwise they sink to the bottom
  return sortBy === 'Completed' ? [...done, ...open] : [...open, ...done]
}

export function formatTaskDate(world, date) {
  if (!date) return ''
  if (world === 'game') return `${date.season} ${date.day}`
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function festivalDays(festival) {
  const nums = (festival.day.match(/\d+/g) || []).map(Number)
  if (nums.length === 2) {
    return Array.from({ length: nums[1] - nums[0] + 1 }, (_, i) => nums[0] + i)
  }
  return nums
}

export function filterForage(forage, season) {
  return forage
    .filter((f) => f.seasons.includes(season))
    .map((f) => ({ ...f, locations: f.places[season] || [] }))
}