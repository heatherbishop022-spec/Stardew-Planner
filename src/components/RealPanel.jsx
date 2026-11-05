import { useState, useEffect } from 'react'
import Panel from './Panel'
import StardewInfo from './StardewInfo'
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
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

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

  const season = toStardewSeason(new Date())

  return (
    <Panel title="Real Life" tag="Live data" variant="real">
      {error && <p className="error">Weather error: {error}</p>}
      {!error && !weather && <p>Loading weather...</p>}
      {weather && (
        <>
          <div className="summary">
            <span className="chip">{weather.temperature_2m}°F</span>
            <span className="chip">{toStardewWeather(weather.weather_code)}</span>
            <span className="chip">{season}</span>
          </div>

          <p className="note">Live weather from Open-Meteo. Reload to update.</p>

          <StardewInfo 
            fish={fish} 
            fishError={fishError} 
            crops={crops} 
            cropsError={cropsError} 
            season={season} 
            weather={toStardewWeather(weather.weather_code)} 
            />
        </>
      )}
    </Panel>
  )
}

export default RealPanel