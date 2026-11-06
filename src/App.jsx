import { useState, useEffect } from 'react'
import { fetchFish, fetchCrops, fetchBirthdays } from './api/wiki'
import GamePanel from './components/GamePanel'
import RealPanel from './components/RealPanel'
import { useForage } from './hooks/useForage'
import Scenery from './components/Scenery'
import { useDaylight } from './hooks/useDaylight'
import Footer from './components/Footer'

function App() {
  const [fish, setFish] = useState([])
  const [fishError, setFishError] = useState(null)
  const [crops, setCrops] = useState([])
  const [cropsError, setCropsError] = useState(null)
  const [birthdays, setBirthdays] = useState([])
  const [birthdaysError, setBirthdaysError] = useState(null)

  useEffect(() => {
    fetchFish().then(setFish).catch((err) => setFishError(err.message))
    fetchCrops().then(setCrops).catch((err) => setCropsError(err.message))
    fetchBirthdays().then(setBirthdays).catch((err) => setBirthdaysError(err.message))
  }, [])

  const { forage, forageError } = useForage()
  const shared = { fish, fishError, crops, cropsError, birthdays, birthdaysError, forage, forageError }
  const { timeOfDay, weather } = useDaylight()
  useEffect(() => {
    document.documentElement.dataset.time = timeOfDay
    document.documentElement.dataset.weather = weather
  }, [timeOfDay, weather])

  return (
    <main className="app">
      <Scenery />
      <h1>Stardew Valley Planner</h1>
      <div className="columns">
        <GamePanel {...shared} />
        <RealPanel {...shared} />
      </div>
      <Footer />
    </main>
  )
}

export default App