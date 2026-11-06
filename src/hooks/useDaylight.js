import { useState, useEffect } from 'react'

const FALLBACK = { latitude: 35.22, longitude: -97.44 }

function getLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(FALLBACK)
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            () => resolve(FALLBACK)
        )
    })
}

// Open-Meteo weather codes -> the few looks the background has
function weatherFromCode(code) {
    if (code === 45 || code === 48) return 'fog'
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
    if (code >= 95) return 'storm'
    if (code === 2 || code === 3) return 'cloudy'
    return 'clear'
}

async function loadSun() {
    const { latitude, longitude } = await getLocation()
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&current=weather_code&timezone=auto&forecast_days=1`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Sun times request failed')
    const data = await res.json()
    // Open-Meteo gives local times like "2026-11-05T06:52". Reading them as UTC
    // and shifting "now" by the location's offset lets us compare them directly.
    return {
        sunrise: Date.parse(data.daily.sunrise[0] + 'Z'),
        sunset: Date.parse(data.daily.sunset[0] + 'Z'),
        offset: data.utc_offset_seconds * 1000,
        day: data.daily.time[0],
        weather: weatherFromCode(data.current.weather_code),
    }
}

export function useDaylight() {
    const [sun, setSun] = useState(null)
    const [failed, setFailed] = useState(false)
    const [now, setNow] = useState(Date.now())

    useEffect(() => {
        let cancelled = false
        loadSun()
            .then((s) => !cancelled && setSun(s))
            .catch(() => !cancelled && setFailed(true))
        const tick = setInterval(() => setNow(Date.now()), 60000)
        // refresh the weather every 15 minutes
        const refresh = setInterval(() => {
            loadSun()
                .then((s) => !cancelled && setSun(s))
                .catch(() => { })
        }, 15 * 60 * 1000)
        return () => {
            cancelled = true
            clearInterval(tick)
            clearInterval(refresh)
        }
    }, [])

    // a new day has started at the location: get the new sunrise and sunset
    useEffect(() => {
        if (!sun) return
        const today = new Date(now + sun.offset).toISOString().slice(0, 10)
        if (today !== sun.day) loadSun().then(setSun).catch(() => { })
    }, [now, sun])

    let timeOfDay = 'day'
    if (sun) {
        const t = now + sun.offset
        timeOfDay = t < sun.sunrise || t >= sun.sunset ? 'night' : 'day'
    } else if (failed) {
        timeOfDay = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
    }

    return { timeOfDay, weather: sun ? sun.weather : 'clear' }
}