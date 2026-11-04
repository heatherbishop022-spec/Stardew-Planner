import { useState, useEffect } from 'react'

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

function App() {
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

  if (error) return <p>Error: {error}</p>
  if (!weather) return <p>Loading weather...</p>

  return (
    <div>
      <h1>Stardew Valley Planner</h1>
      <p>Temperature: {weather.temperature_2m}°F</p>
      <p>Stardew weather: {toStardewWeather(weather.weather_code)}</p>
      <p>Stardew season: {toStardewSeason(new Date())}</p>
    </div>
  )
}

export default App