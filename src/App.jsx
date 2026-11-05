import { useState, useEffect } from 'react'
import { fetchFish, fetchCrops, fetchBirthdays } from './api/wiki'
import GamePanel from './components/GamePanel'
import RealPanel from './components/RealPanel'

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

  const shared = { fish, fishError, crops, cropsError, birthdays, birthdaysError }

  return (
    <main className="app">
      <h1>Stardew Valley Planner</h1>
      <div className="columns">
        <GamePanel {...shared} />
        <RealPanel {...shared} />
      </div>
    </main>
  )
}

export default App