function Scenery() {
    return (
        <svg
            className="scenery"
            viewBox="0 0 160 100"
            preserveAspectRatio="xMidYMax slice"
            shapeRendering="crispEdges"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: 'var(--sky-top)' }} />
                    <stop offset="1" style={{ stopColor: 'var(--sky-bottom)' }} />
                </linearGradient>

                <g id="cloud">
                    <rect x="2" y="3" width="14" height="3" />
                    <rect x="5" y="1" width="5" height="2" />
                    <rect x="9" y="0" width="4" height="3" />
                </g>

                <g id="tree">
                    <rect x="3" y="10" width="2" height="5" style={{ fill: 'var(--trunk)' }} />
                    <g style={{ fill: 'var(--leaf)' }}>
                        <rect x="0" y="6" width="8" height="5" />
                        <rect x="1" y="3" width="6" height="3" />
                        <rect x="2" y="1" width="4" height="2" />
                    </g>
                </g>

                <pattern id="rain" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="3" y="2" width="1" height="4" style={{ fill: 'var(--rain)' }} />
                    <rect x="13" y="12" width="1" height="4" style={{ fill: 'var(--rain)' }} />
                </pattern>

                <pattern id="snow" width="24" height="24" patternUnits="userSpaceOnUse">
                    <rect x="4" y="3" width="1" height="1" style={{ fill: 'var(--snow)' }} />
                    <rect x="15" y="9" width="1" height="1" style={{ fill: 'var(--snow)' }} />
                    <rect x="9" y="18" width="1" height="1" style={{ fill: 'var(--snow)' }} />
                    <rect x="20" y="21" width="1" height="1" style={{ fill: 'var(--snow)' }} />
                </pattern>
            </defs>

            <rect width="160" height="100" fill="url(#sky)" />

            {/* sun or moon */}
            <g className="sun-body" style={{ fill: 'var(--sun)' }}>
                <rect x="126" y="8" width="6" height="2" />
                <rect x="124" y="10" width="10" height="6" />
                <rect x="126" y="16" width="6" height="2" />
            </g>

            {/* stars (invisible by day) */}
            <g className="stars" style={{ fill: 'var(--star, transparent)' }}>
                <rect x="10" y="8" width="1" height="1" />
                <rect x="28" y="20" width="1" height="1" />
                <rect x="46" y="6" width="1" height="1" />
                <rect x="60" y="14" width="1" height="1" />
                <rect x="78" y="30" width="1" height="1" />
                <rect x="92" y="10" width="1" height="1" />
                <rect x="100" y="24" width="1" height="1" />
                <rect x="116" y="6" width="1" height="1" />
                <rect x="140" y="28" width="1" height="1" />
                <rect x="150" y="14" width="1" height="1" />
                <rect x="20" y="40" width="1" height="1" />
                <rect x="70" y="44" width="1" height="1" />
                <rect x="130" y="44" width="1" height="1" />
            </g>

            {/* drifting clouds */}
            <g className="clouds" style={{ fill: 'var(--cloud)' }}>
                <use href="#cloud" x="12" y="14" />
                <use href="#cloud" x="62" y="26" />
                <use href="#cloud" x="104" y="36" />
            </g>

            {/* extra gray clouds for cloudy, rainy and snowy weather */}
            <g className="wx-clouds">
                <use href="#cloud" x="-2" y="10" />
                <use href="#cloud" x="30" y="4" />
                <use href="#cloud" x="52" y="20" />
                <use href="#cloud" x="88" y="8" />
                <use href="#cloud" x="118" y="24" />
                <use href="#cloud" x="142" y="12" />
                <use href="#cloud" x="72" y="34" />
            </g>

            {/* far and near hills */}
            <polygon
                style={{ fill: 'var(--hill-far)' }}
                points="0,100 0,64 12,64 12,60 28,60 28,56 48,56 48,60 62,60 62,64 78,64 78,60 96,60 96,56 112,56 112,60 130,60 130,64 160,64 160,100"
            />
            <polygon
                style={{ fill: 'var(--hill-near)' }}
                points="0,100 0,78 20,78 20,74 44,74 44,78 70,78 70,82 100,82 100,78 124,78 124,74 150,74 150,78 160,78 160,100"
            />

            {/* ground */}
            <rect x="0" y="88" width="160" height="12" style={{ fill: 'var(--grass)' }} />
            <rect x="0" y="88" width="160" height="1" style={{ fill: 'var(--grass-dark)' }} />

            {/* trees */}
            <use href="#tree" x="6" y="73" />
            <use href="#tree" x="22" y="75" />
            <use href="#tree" x="132" y="74" />
            <use href="#tree" x="148" y="72" />

            {/* flowers */}
            <g style={{ fill: 'var(--flower-a)' }}>
                <rect x="14" y="93" width="1" height="1" />
                <rect x="46" y="96" width="1" height="1" />
                <rect x="90" y="94" width="1" height="1" />
                <rect x="140" y="95" width="1" height="1" />
            </g>
            <g style={{ fill: 'var(--flower-b)' }}>
                <rect x="30" y="95" width="1" height="1" />
                <rect x="70" y="93" width="1" height="1" />
                <rect x="112" y="96" width="1" height="1" />
                <rect x="154" y="93" width="1" height="1" />
            </g>

            {/* weather layers (all hidden until the weather calls for them) */}
            <rect className="wx-tint" width="160" height="100" />
            <rect className="wx-rain" y="-20" width="160" height="140" fill="url(#rain)" />
            <rect className="wx-snow" y="-24" width="160" height="148" fill="url(#snow)" />
            <rect className="wx-flash" width="160" height="100" fill="#ffffff" />
        </svg>
    )
}

export default Scenery