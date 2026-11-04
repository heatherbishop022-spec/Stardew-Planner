import { useState } from 'react'
import FishList from './FishList'
import { filterFish } from '../utils/stardew'

function StardewInfo({ fish, fishError, season, weather }) {
  const [showGinger, setShowGinger] = useState(false)
  const visible = filterFish(fish, season, weather, showGinger)

  return (
    <div>
      <h2 className="info-title">Fish you can catch ({visible.length})</h2>
      <p className="info-sub">
        {season} · {weather}
      </p>
      <label className="toggle">
        <input
          type="checkbox"
          checked={showGinger}
          onChange={(e) => setShowGinger(e.target.checked)}
        />{' '}
        Include Ginger Island fish
      </label>
      {fishError && <p className="error">Fish error: {fishError}</p>}
      {!fishError && fish.length === 0 && <p>Loading fish...</p>}
      {fish.length > 0 && (
        <div className="fish-scroll">
          <FishList fish={visible} />
        </div>
      )}
    </div>
  )
}

export default StardewInfo