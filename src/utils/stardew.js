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