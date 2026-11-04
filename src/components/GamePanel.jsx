import { useState } from 'react'
import Panel from './Panel'
import Dropdown from './Dropdown'
import StardewInfo from './StardewInfo'
import { SEASONS, WEATHER_OPTIONS } from '../utils/stardew'

function GamePanel({ fish, fishError }) {
  const [season, setSeason] = useState('Spring')
  const [weather, setWeather] = useState('Sunny')

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
      </div>
      <StardewInfo fish={fish} fishError={fishError} season={season} weather={weather} />
    </Panel>
  )
}

export default GamePanel