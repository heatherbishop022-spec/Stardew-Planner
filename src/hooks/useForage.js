import { useState, useEffect } from 'react'
import { fetchForage } from '../api/wiki'

export function useForage() {
    const [state, setState] = useState({ forage: [], forageError: null })

    useEffect(() => {
        let cancelled = false
        fetchForage()
            .then((forage) => {
                if (!cancelled) setState({ forage, forageError: null })
            })
            .catch((err) => {
                if (!cancelled) setState({ forage: [], forageError: err.message })
            })
        return () => {
            cancelled = true
        }
    }, [])

    return state
}