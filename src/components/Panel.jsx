import { useState } from 'react'

function Panel({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="panel">
      <button
        className="panel-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="panel-body">{children}</div>}
    </section>
  )
}

export default Panel