import { useState } from 'react'
import FishList from './FishList'
import CropList from './CropList'
import { filterFish, filterCrops } from '../utils/stardew'

function StardewInfo({ fish, fishError, crops, cropsError, season, weather }) {
  const [tab, setTab] = useState('fish')
  const [showGinger, setShowGinger] = useState(false)

  const visibleFish = filterFish(fish, season, weather, showGinger)
  const visibleCrops = filterCrops(crops, season)
  const raining = weather === 'Rain' || weather === 'Storm'

  const error = tab === 'fish' ? fishError : cropsError
  const loading = tab === 'fish' ? fish.length === 0 : crops.length === 0

  return (
    <div>
      <p className="info-sub">
        {season} · {weather}
      </p>

      <div className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'fish'}
          className={tab === 'fish' ? 'tab active' : 'tab'}
          onClick={() => setTab('fish')}
        >
          Fish ({visibleFish.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === 'crops'}
          className={tab === 'crops' ? 'tab active' : 'tab'}
          onClick={() => setTab('crops')}
        >
          Crops ({visibleCrops.length})
        </button>
      </div>

      <div className="tab-extra">
        {tab === 'fish' ? (
          <label className="toggle">
            <input
              type="checkbox"
              checked={showGinger}
              onChange={(e) => setShowGinger(e.target.checked)}
            />{' '}
            Include Ginger Island fish
          </label>
        ) : (
          <span>{raining ? 'Rain waters your crops today.' : 'Crops need watering today.'}</span>
        )}
      </div>

      {error && <p className="error">Error: {error}</p>}
      {!error && loading && <p>Loading...</p>}
      {!error && !loading && (
        <div className="fish-scroll">
          {tab === 'fish' ? (
            <FishList fish={visibleFish} />
          ) : (
            <CropList crops={visibleCrops} />
          )}
        </div>
      )}
    </div>
  )
}

export default StardewInfo