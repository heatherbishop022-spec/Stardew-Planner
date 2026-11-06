import { useState } from 'react'

function Panel({ title, tag, variant, season, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section
      className={`panel panel-${variant}${open ? '' : ' panel-closed'}`}
      data-season={season}
    >
      <button
        className="panel-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="panel-title">
          {title}
          <span className="panel-tag">{tag}</span>
        </span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="panel-body">{children}</div>}
    </section>
  )
}

export default Panel