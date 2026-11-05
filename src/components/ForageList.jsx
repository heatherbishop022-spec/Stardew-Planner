import Card from './Card'

function ForageList({ forage }) {
    if (forage.length === 0) return <p>No forage listed for this season.</p>

    return (
        <div className="grid">
            {forage.map((f) => {
                const shown = f.locations.slice(0, 3)
                const extra = f.locations.length - shown.length
                return (
                    <Card key={f.name} title={f.name} badge={f.price ? `${f.price}g` : null}>
                        {shown.length > 0 && (
                            <p className="meta">
                                {shown.join(', ')}
                                {extra > 0 && ` +${extra} more`}
                            </p>
                        )}
                        {f.bundle && (
                            <span className="tag" title={f.bundles.join(', ')}>
                                Bundle forage
                            </span>
                        )}
                    </Card>
                )
            })}
        </div>
    )
}

export default ForageList