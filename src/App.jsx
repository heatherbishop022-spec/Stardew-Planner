import { useState, useEffect } from 'react'
import { fetchFish } from './api/wiki'
import GamePanel from './components/GamePanel'
import RealPanel from './components/RealPanel'

function App() {
  const [fish, setFish] = useState([])
  const [fishError, setFishError] = useState(null)

  useEffect(() => {
    fetchFish()
      .then(setFish)
      .catch((err) => setFishError(err.message))
  }, [])

  return (
    <main className="app">
      <h1>Stardew Valley Planner</h1>
      <div className="columns">
        <GamePanel fish={fish} fishError={fishError} />
        <RealPanel fish={fish} fishError={fishError} />
      </div>
    </main>
  )
}

export default App