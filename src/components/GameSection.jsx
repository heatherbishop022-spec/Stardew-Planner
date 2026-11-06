import { useState } from 'react'
import Section from './Section'
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

function GameSection({
    season,
    onSeasonChange,
    fish, fishError,
    crops, cropsError,
    birthdays, birthdaysError,
    forage, forageError,
}) {
    const [weather, setWeather] = useState('Sunny')
    const [luck, setLuck] = useState('Neutral')
    const [tipIndex, setTipIndex] = useState(0)
    const taskApi = useTasks('tasks-game')

    const seasonTips = tips.filter((t) => t.season === season)
    const tip = seasonTips[tipIndex % seasonTips.length]

    function changeSeason(s) {
        onSeasonChange(s)
        setTipIndex(0)
    }

    return (
        <Section title="Game Life" tag="You choose" variant="game">
            <div className="controls">
                <Dropdown label="Season" options={SEASONS} value={season} onChange={changeSeason} />
                <Dropdown label="Weather" options={WEATHER_OPTIONS} value={weather} onChange={setWeather} />
                <Dropdown label="Luck" options={LUCK_LEVELS} value={luck} onChange={setLuck} />
            </div>
            <p className="note">{LUCK_TIPS[luck]}</p>
            <p className="note note-tall">{festivalText(season)}</p>

            <div className="tip-box">
                <p className="tip-text">{tip.tip}</p>
                <div className="tip-footer">
                    <span>Livin' Off The Land · {tip.date}</span>
                    <span className="tip-buttons">
                        <button
                            className="tip-next"
                            onClick={() =>
                                setTipIndex(
                                    ((tipIndex % seasonTips.length) - 1 + seasonTips.length) % seasonTips.length
                                )
                            }
                        >
                            ‹ Previous
                        </button>
                        <button className="tip-next" onClick={() => setTipIndex(tipIndex + 1)}>
                            Next tip ›
                        </button>
                    </span>
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
                forage={forage}
                forageError={forageError}
                season={season}
                weather={weather}
            />
        </Section>
    )
}

export default GameSection