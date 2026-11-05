import { useState, useEffect } from 'react'
import Panel from './Panel'
import StardewInfo from './StardewInfo'
import { useTasks } from '../hooks/useTasks'
import { toStardewWeather, toStardewSeason } from '../utils/stardew'

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

function RealPanel({ fish, fishError, crops, cropsError }) {
  const [live, setLive] = useState(null)
  const [error, setError] = useState(null)
  const taskApi = useTasks('tasks-real')

  useEffect(() => {
    async function loadWeather() {
      try {
        const { latitude, longitude } = await getLocation()
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Weather request failed')
        const data = await res.json()
        setLive(data.current)
      } catch (err) {
        setError(err.message)
      }
    }
    loadWeather()
  }, [])

  const season = toStardewSeason(new Date())
  const stardewWeather = live ? toStardewWeather(live.weather_code) : null

  return (
    <Panel title="Real Life" tag="Live data" variant="real">
      <div className="summary">
        {live && <span className="chip">{live.temperature_2m}°F</span>}
        {stardewWeather && <span className="chip">{stardewWeather}</span>}
        <span className="chip">{season}</span>
      </div>
      <p className="note">
        {error ? `Weather error: ${error}` : 'Live weather from Open-Meteo. Reload to update.'}
      </p>
      <p className="note note-tall">Real-world holidays: coming soon.</p>
      <StardewInfo
        world="real"
        taskApi={taskApi}
        fish={fish}
        fishError={fishError}
        crops={crops}
        cropsError={cropsError}
        season={season}
        weather={stardewWeather}
      />
    </Panel>
  )
}

export default RealPanel