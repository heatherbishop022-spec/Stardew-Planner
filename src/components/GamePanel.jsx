import { useState } from 'react'
import Panel from './Panel'
import Dropdown from './Dropdown'
import StardewInfo from './StardewInfo'
import tips from '../data/tips.json'
import { useTasks } from '../hooks/useTasks'
import {
  SEASONS,
  WEATHER_OPTIONS,
  LUCK_LEVELS,
  LUCK_TIPS,
  festivalText,
} from '../utils/stardew'

function GamePanel({ fish, fishError, crops, cropsError, birthdays, birthdaysError }) {
  const [season, setSeason] = useState('Spring')
  const [weather, setWeather] = useState('Sunny')
  const [luck, setLuck] = useState('Neutral')
  const [tipIndex, setTipIndex] = useState(0)
  const taskApi = useTasks('tasks-game')

  const seasonTips = tips.filter((t) => t.season === season)
  const tip = seasonTips[tipIndex % seasonTips.length]

  function changeSeason(s) {
    setSeason(s)
    setTipIndex(0)
  }

  return (
    <Panel title="Game Life" tag="You choose" variant="game">
      <div className="controls">
        <Dropdown label="Season" options={SEASONS} value={season} onChange={changeSeason} />
        <Dropdown
          label="Weather"
          options={WEATHER_OPTIONS}
          value={weather}
          onChange={setWeather}
        />
        <Dropdown label="Luck" options={LUCK_LEVELS} value={luck} onChange={setLuck} />
      </div>
      <p className="note">{LUCK_TIPS[luck]}</p>
      <p className="note note-tall">{festivalText(season)}</p>

      <div className="tip-box">
        <p className="tip-text">{tip.tip}</p>
        <div className="tip-footer">
          <span>Livin' Off The Land · {tip.date}</span>
          <button className="tip-next" onClick={() => setTipIndex(tipIndex + 1)}>
            Next tip
          </button>
        </div>
      </div>

      <StardewInfo
        world="game"
        taskApi={taskApi}
        fish={fish}
        fishError={fishError}
        crops={crops}
        cropsError={cropsError}
        birthdays={birthdays}
        birthdaysError={birthdaysError}
        season={season}
        weather={weather}
        showPortraits
      />
    </Panel>
  )
}

export default GamePanel