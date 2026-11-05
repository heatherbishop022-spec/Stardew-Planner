const cache = {}

export function fetchHolidays(year, country = 'US') {
    const key = `${year}-${country}`
    if (!cache[key]) {
        cache[key] = fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`)
            .then((res) => {
                if (!res.ok) throw new Error('Holiday request failed')
                return res.json()
            })
            .then((data) => data.map((h) => ({ date: h.date, name: h.name })))
            .catch((err) => {
                delete cache[key]
                throw err
            })
    }
    return cache[key]
}