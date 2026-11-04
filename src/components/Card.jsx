function Card({ title, badge, children }) {
  return (
    <div className="card">
      <div className="card-top">
        <h3>{title}</h3>
        {badge && <span className="badge">{badge}</span>}
      </div>
      {children}
    </div>
  )
}

export default Card