import { useState } from 'react'
import Card from './Card'

export function Portrait({ name, src }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <span className="portrait portrait-fallback">{name[0]}</span>
  }
  return (
    <img
      className="portrait"
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function BirthdayList({ birthdays, showPortraits }) {
  if (birthdays.length === 0) return <p>No birthdays listed for this season.</p>

  return (
    <div className="grid">
      {birthdays.map((b) => (
        <Card key={`${b.name}-${b.season}`} title={b.name} badge={`Day ${b.day}`}>
          {showPortraits && <Portrait name={b.name} src={b.portrait || b.icon} />}
        </Card>
      ))}
    </div>
  )
}

export default BirthdayList