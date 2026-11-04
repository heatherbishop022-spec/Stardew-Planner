import { useState, useEffect } from 'react'
import { fetchFish } from './api/wiki'
import Panel from './components/Panel'
import FishList from './components/FishList'

const FALLBACK = { latitude: 35.22, longitude: -97.44 }

function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(FALLBACK)
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => resolve(FALLBACK)
    )
  })
}

function toStardewWeather(code) {
  if (code >= 95) return 'Storm'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'Rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'Snow'
  return 'Sunny'
}

function toStardewSeason(date) {
  const month = date.getMonth()
  if (month >= 2 && month <= 4) return 'Spring'
  if (month >= 5 && month <= 7) return 'Summer'
  if (month >= 8 && month <= 10) return 'Fall'
  return 'Winter'
}

const isGinger = (loc) => /ginger island|volcano|pirate cove/i.test(loc)

function App() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [fish, setFish] = useState([])
  const [fishError, setFishError] = useState(null)
  const [showGinger, setShowGinger] = useState(false)

  useEffect(() => {
    async function loadWeather() {
      try {
        const { latitude, longitude } = await getLocation()
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Weather request failed')
        const data = await res.json()
        setWeather(data.current)
      } catch (err) {
        setError(err.message)
      }
    }
    loadWeather()
  }, [])

  useEffect(() => {
    fetchFish()
      .then(setFish)
      .catch((err) => setFishError(err.message))
  }, [])

  if (error) return <p>Error: {error}</p>
  if (!weather) return <p>Loading weather...</p>

  const season = toStardewSeason(new Date())
  const stardewWeather = toStardewWeather(weather.weather_code)
  const fishWeather =
    stardewWeather === 'Rain' || stardewWeather === 'Storm' ? 'Rain' : 'Sun'

  const visible = fish
    .map((f) =>
      showGinger ? f : { ...f, locations: f.locations.filter((l) => !isGinger(l)) }
    )
    .filter((f) => f.locations.length > 0)
    .filter((f) => f.seasons.includes(season) && f.weather.includes(fishWeather))

  return (
    <main className="app">
      <h1>Stardew Valley Planner</h1>

      <div className="summary">
        <span className="chip">{weather.temperature_2m}°F</span>
        <span className="chip">{stardewWeather}</span>
        <span className="chip">{season}</span>
      </div>

      <Panel title={`See what fish you can catch (${visible.length})`}>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showGinger}
            onChange={(e) => setShowGinger(e.target.checked)}
          />{' '}
          Include Ginger Island fish
        </label>
        {fishError && <p>Fish error: {fishError}</p>}
        {!fishError && fish.length === 0 && <p>Loading fish...</p>}
        <FishList fish={visible} />
      </Panel>
    </main>
  )
}

export default App