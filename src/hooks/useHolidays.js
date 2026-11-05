import { useState, useEffect } from 'react'
import { fetchHolidays } from '../api/holidays'

export function useHolidays(year, country = 'US') {
    const [state, setState] = useState({ holidays: [], error: null })

    useEffect(() => {
        let cancelled = false
        fetchHolidays(year, country)
            .then((holidays) => {
                if (!cancelled) setState({ holidays, error: null })
            })
            .catch((err) => {
                if (!cancelled) setState({ holidays: [], error: err.message })
            })
        return () => {
            cancelled = true
        }
    }, [year, country])

    return state
}