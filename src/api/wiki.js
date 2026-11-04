const WIKI_URL = 'https://stardewvalleywiki.com/mediawiki/api.php'

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter']

function parseSeasons(text) {
  const cleaned = text.replace(/\(.*?\)/g, '')
  if (/all seasons/i.test(cleaned)) return SEASONS
  return SEASONS.filter((s) => cleaned.includes(s))
}

function parseWeather(text) {
  if (/any/i.test(text)) return ['Sun', 'Rain']
  const found = []
  if (/sun/i.test(text)) found.push('Sun')
  if (/rain/i.test(text)) found.push('Rain')
  return found
}

function parsePrice(text) {
  const match = text.match(/data-sort-value="(\d+)"/)
  return match ? Number(match[1]) : null
}

export async function fetchFish() {
  const url = `${WIKI_URL}?action=parse&page=Fish&prop=text&format=json&origin=*`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Wiki request failed')
  const data = await res.json()
  const doc = new DOMParser().parseFromString(data.parse.text['*'], 'text/html')

  const fish = []
  let skipped = 0

  doc.querySelectorAll('table.wikitable').forEach((table) => {
    const rows = [...table.querySelectorAll('tr')]
    const headers = [...rows[0].children].map((h) => h.textContent.trim())
    const col = (label) => headers.findIndex((h) => h.startsWith(label))

    const nameI = col('Name')
    const priceI = col('Price')
    const locI = col('Location')
    const timeI = col('Time')
    const seasonI = col('Season')
    const weatherI = col('Weather')
    const usedI = col('Used In')

    if (locI === -1 || seasonI === -1 || weatherI === -1) return

    rows.slice(1).forEach((row) => {
      const cells = [...row.children]
      if (cells.length !== headers.length) {
        skipped++
        return
      }
      const text = (i) => (i === -1 ? '' : cells[i].textContent.trim())
      fish.push({
        name: text(nameI),
        price: parsePrice(cells[priceI].textContent),
                locations: text(locI)
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean),
        time: text(timeI).replace(/(am|pm)(?=\d)/gi, '$1, '),
        seasons: parseSeasons(text(seasonI)),
        weather: parseWeather(text(weatherI)),
        bundle: /bundle/i.test(text(usedI)),
      })
    })
  })

  console.log(`Loaded ${fish.length} fish, skipped ${skipped} rows`)
  return fish
}