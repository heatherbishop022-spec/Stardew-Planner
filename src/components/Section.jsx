import { useState } from 'react'

function Section({ title, tag, variant, defaultOpen = true, children }) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <section className={`section section-${variant}`}>
            <button
                className="section-header"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span className="section-title">
                    {title}
                    <span className="section-tag">{tag}</span>
                </span>
                <span>{open ? '−' : '+'}</span>
            </button>
            {open && <div className="section-body">{children}</div>}
        </section>
    )
}

export default Section