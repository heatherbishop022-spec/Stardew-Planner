import { useState } from 'react'
import OutsideNow from './OutsideNow'
import RealSection from './RealSection'
import GameSection from './GameSection'

function Planner(props) {
    const [season, setSeason] = useState('Spring')

    return (
        <div className="planner" data-season={season}>
            <OutsideNow />
            <RealSection />
            <GameSection season={season} onSeasonChange={setSeason} {...props} />
        </div>
    )
}

export default Planner