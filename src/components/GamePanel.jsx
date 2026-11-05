import { useState } from 'react'
import Panel from './Panel'
import Dropdown from './Dropdown'
import StardewInfo from './StardewInfo'
import { SEASONS, WEATHER_OPTIONS, LUCK_LEVELS, LUCK_TIPS } from '../utils/stardew'

function GamePanel({ fish, fishError, crops, cropsError }) {
  const [season, setSeason] = useState('Spring')
  const [weather, setWeather] = useState('Sunny')
  const [luck, setLuck] = useState('Neutral')

  return (
    <Panel title="Game Life" tag="You choose" variant="game">
      <div className="controls">
        <Dropdown label="Season" options={SEASONS} value={season} onChange={setSeason} />
        <Dropdown
          label="Weather"
          options={WEATHER_OPTIONS}
          value={weather}
          onChange={setWeather}
        />
        <Dropdown label="Luck" options={LUCK_LEVELS} value={luck} onChange={setLuck} />
      </div>
      <p className="note">{LUCK_TIPS[luck]}</p>
      <StardewInfo fish={fish} fishError={fishError} crops={crops} cropsError={cropsError} season={season} weather={weather} />
    </Panel>
  )
}

export default GamePanel