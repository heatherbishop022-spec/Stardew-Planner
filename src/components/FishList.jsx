import Card from './Card'

function FishList({ fish }) {
  if (fish.length === 0) return <p>No fish match right now.</p>

  return (
    <div className="grid">
      {fish.map((f, i) => (
        <Card
          key={`${f.name}-${i}`}
          title={f.name}
          badge={f.price ? `${f.price}g` : null}
        >
          <p className="meta">{f.locations.join(', ')}</p>
          <p className="meta">{f.time === 'Any' ? 'Any time' : f.time}</p>
          {f.bundle && <span className="tag">Bundle fish</span>}
        </Card>
      ))}
    </div>
  )
}

export default FishList