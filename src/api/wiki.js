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

export async function fetchCrops() {
  const url = `${WIKI_URL}?action=parse&page=Crops&prop=text&format=json&origin=*`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Wiki request failed')
  const data = await res.json()
  const doc = new DOMParser().parseFromString(data.parse.text['*'], 'text/html')
  doc.querySelectorAll('style').forEach((s) => s.remove())

  const crops = []
  let season = null

  doc.querySelectorAll('h2, h3, h4, table.wikitable').forEach((el) => {
    if (el.tagName !== 'TABLE') {
      const found = SEASONS.find((s) => el.textContent.includes(s))
      if (found) season = found
      else if (el.tagName === 'H2') season = null
      return
    }

    const rows = [...el.querySelectorAll('tr')]
    const headers = [...rows[0].children].map((h) => h.textContent.trim().toLowerCase())
    const col = (label) => headers.findIndex((h) => h.startsWith(label))

    const seedI = col('seeds')
    const harvestI = col('harvest')
    const sellI = col('sells for')
    const usedI = col('used in')
    if (seedI === -1 || sellI === -1) return

    rows.slice(1).forEach((row) => {
      const cells = [...row.children]
      const shift = cells.length - headers.length
      if (shift < 0 || shift > 1) return

      const sellCell = cells[sellI + shift]
      const usedCell = usedI === -1 ? null : cells[usedI + shift]

      const seedName = cells[seedI].textContent.trim().split('\n')[0].trim()
      const harvest = harvestI === -1 ? null : cells[harvestI]
      const linkName = harvest?.querySelector('a[title]')?.getAttribute('title')
      const imgName = harvest
        ?.querySelector('img')
        ?.getAttribute('alt')
        ?.replace(/\.png$/i, '')
      const name =
        linkName || imgName || seedName.replace(/\s+(Seeds|Starter|Bulb|Shoot)$/, '')

      const prices = [...sellCell.textContent.matchAll(/(\d[\d,]*)g/g)].map((m) =>
        Number(m[1].replace(/,/g, ''))
      )

      crops.push({
        name,
        season: season || 'Other',
        price: prices[0] ?? null,
        maxPrice: prices.length > 1 ? prices[prices.length - 1] : null,
        bundle: usedCell ? /bundle/i.test(usedCell.textContent) : false,
      })
    })
  })

  const ALL = ['Spring', 'Summer', 'Fall', 'Winter']
  const MULTI_SEASON = {
    'ancient fruit': ['Spring', 'Summer', 'Fall'],
    'cactus fruit': ALL,
    'coffee bean': ['Spring', 'Summer'],
    corn: ['Summer', 'Fall'],
    fiber: ALL,
    'qi fruit': ALL,
    sunflower: ['Summer', 'Fall'],
    'tea leaves': ['Spring', 'Summer', 'Fall'],
    wheat: ['Summer', 'Fall'],
  }

   const original = [...crops]
  const added = []
  const notFound = []

  Object.entries(MULTI_SEASON).forEach(([key, seasons]) => {
    const found = original.find((c) => c.name.toLowerCase() === key)
    const source = found || {
      name: key.replace(/\b\w/g, (ch) => ch.toUpperCase()),
      price: null,
      maxPrice: null,
      bundle: false,
    }
    if (!found) notFound.push(key)

    seasons.forEach((s) => {
      const exists = crops.some((o) => o.name === source.name && o.season === s)
      if (!exists) {
        crops.push({ ...source, season: s })
        added.push(`${source.name} → ${s}`)
      }
    })
  })
  console.log('Multi-season crops added:', added)
  console.log('Hand-listed (not on wiki page):', notFound)

  const counts = {}
  crops.forEach((c) => {
    counts[c.season] = (counts[c.season] || 0) + 1
  })
  console.log('Loaded crops by season:', counts)
  return crops
}

const WIKI_ORIGIN = 'https://stardewvalleywiki.com'

async function fetchPageDoc(page) {
  const url = `${WIKI_URL}?action=parse&page=${page}&prop=text&format=json&origin=*`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Wiki request failed')
  const data = await res.json()
  const doc = new DOMParser().parseFromString(data.parse.text['*'], 'text/html')
  doc.querySelectorAll('style').forEach((s) => s.remove())
  return doc
}

export async function fetchBirthdays() {
  const [calendar, villagers] = await Promise.all([
    fetchPageDoc('Calendar'),
    fetchPageDoc('Villagers').catch(() => null),
  ])

  const portraits = {}
  villagers?.querySelectorAll('div.thumb').forEach((box) => {
    const name = box.querySelector('a[title]')?.getAttribute('title')
    const src = box.querySelector('img')?.getAttribute('src')
    if (name && src) portraits[name] = WIKI_ORIGIN + src
  })

  const birthdays = []
  let season = null

    const isSeasonLink = (a) => /^(Spring|Summer|Fall|Winter)\b/.test(a.getAttribute('title'))
    const villagerLink = (cell) =>
    [...cell.querySelectorAll('a[title]')].find((a) => !isSeasonLink(a))

  calendar.querySelectorAll('h2, table.sortable').forEach((el) => {
    if (el.tagName === 'H2') {
      season = SEASONS.find((s) => el.textContent.includes(s)) || null
      return
    }
    if (!season) return

    el.querySelectorAll('tr').forEach((row) => {
      const cells = [...row.children]
      const nameCell = cells.find((c) => villagerLink(c))
      const dateCell = cells.find((c) => c !== nameCell && /\d/.test(c.textContent))
      if (!nameCell || !dateCell) return

      const name = villagerLink(nameCell).getAttribute('title')
      const day = parseInt(dateCell.textContent.match(/\d+/)[0], 10)
      const icon = nameCell.querySelector('img')?.getAttribute('src')

      birthdays.push({
        name,
        season,
        day,
        icon: icon ? WIKI_ORIGIN + icon : null,
        portrait: portraits[name] || null,
      })
    })
  })

  if (birthdays.length === 0) {
    const sample = calendar.querySelector('table.sortable')
    console.log(
      'No birthdays parsed. Sample:',
      sample?.querySelectorAll('tr')[1]?.outerHTML.replace(/\s+/g, ' ').slice(0, 600)
    )
  }

  console.log(
    'Loaded birthdays:', birthdays.length,
    '| portraits matched:', birthdays.filter((b) => b.portrait).length
  )
  return birthdays
}