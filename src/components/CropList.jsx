import Card from './Card'

function CropList({ crops }) {
  if (crops.length === 0) return <p>No crops listed for this season.</p>

  return (
    <div className="grid">
      {crops.map((c) => (
        <Card
          key={`${c.name}-${c.season}`}
          title={c.name}
          badge={c.price ? `${c.price}g` : null}
        >
          {c.maxPrice && c.maxPrice > c.price && (
            <p className="meta">Up to {c.maxPrice}g at best quality</p>
          )}
          {c.bundle && <span className="tag">Bundle crop</span>}
        </Card>
      ))}
    </div>
  )
}

export default CropList