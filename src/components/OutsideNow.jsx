import { useState, useEffect } from 'react'
import { useHolidays } from '../hooks/useHolidays'
import { toStardewWeather, toStardewSeason, formatTaskDate } from '../utils/stardew'
import { toISO } from '../utils/dates'

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

function OutsideNow() {
    const [live, setLive] = useState(null)
    const [error, setError] = useState(null)
    const now = new Date()
    const { holidays, error: holidayError } = useHolidays(now.getFullYear())

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

    const season = toStardewSeason(now)
    const condition = live ? toStardewWeather(live.weather_code) : null

    const todayISO = toISO(now.getFullYear(), now.getMonth(), now.getDate())
    const todayHoliday = holidays.find((h) => h.date === todayISO)
    const nextHoliday = holidays.find((h) => h.date > todayISO)

    let holidayText = 'Loading holidays...'
    if (holidayError) holidayText = 'Holidays unavailable right now.'
    else if (holidays.length > 0) {
        if (todayHoliday) holidayText = `Today is ${todayHoliday.name}.`
        else if (nextHoliday)
            holidayText = `Next holiday: ${nextHoliday.name} (${formatTaskDate('real', nextHoliday.date)}).`
        else holidayText = 'No more holidays this year.'
    }

    return (
        <div className="outside">
            <div className="outside-head">
                <h2 className="outside-title">Outside right now</h2>
                {live && <span className="chip">{live.temperature_2m}°F</span>}
                {condition && <span className="chip">{condition}</span>}
                <span className="chip">{season}</span>
            </div>
            {error && <p className="outside-note">Weather error: {error}</p>}
            <p className="outside-note">{holidayText}</p>
        </div>
    )
}

export default OutsideNow