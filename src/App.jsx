import { useState, useEffect } from 'react'
import GamePanel from './components/GamePanel'
import RealPanel from './components/RealPanel'
import { fetchFish, fetchCrops } from './api/wiki'

function App() {
  const [fish, setFish] = useState([])
  const [fishError, setFishError] = useState(null)

  useEffect(() => {
    fetchFish()
      .then(setFish)
      .catch((err) => setFishError(err.message))
  }, [])

    const [crops, setCrops] = useState([])
    const [cropsError, setCropsError] = useState(null)

    useEffect(() => {
      fetchCrops()
        .then(setCrops)
        .catch((err) => setCropsError(err.message))
    }, [])

  return (
    <main className="app">
      <h1>Stardew Valley Planner</h1>
      <div className="columns">
        <GamePanel fish={fish} fishError={fishError} crops={crops} cropsError={cropsError} />
        <RealPanel fish={fish} fishError={fishError} crops={crops} cropsError={cropsError} />
      </div>
    </main>
  )
}

export default App