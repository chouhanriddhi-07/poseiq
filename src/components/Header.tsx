export default function Header() {
    return (
        <header style={styles.header}>
            {/* Logo + brand */}
            <div style={styles.brand}>
                <div style={styles.logoMark}>
                    <span style={{ fontSize: '20px' }}>🧘</span>
                </div>
                <div>
                    <div style={styles.logoText}>PoseIQ</div>
                    <div style={styles.tagline}>AI-powered yoga analysis</div>
                </div>
            </div>

            {/* Nav links */}
            <nav style={styles.nav}>
                <a href="#" style={styles.navLink}>Home</a>
                <a href="#poses" style={styles.navLink}>Poses</a>
                <a href="#about" style={styles.navLink}>About</a>

                <a href="https://github.com/chouhanriddhi-07/poseiq"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.navLink}
                >
                    GitHub
                </a>
            </nav>

            {/* Badge */}
            <div style={styles.badge}>
                <span style={styles.liveDot} />
                Live AI analysis
            </div>
        </header >
    )
}

const styles: Record<string, React.CSSProperties> = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: '#ffffff',
        borderBottom: '0.5px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    logoMark: {
        width: '40px',
        height: '40px',
        background: '#E1F5EE',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: '18px',
        fontWeight: 700,
        color: '#1a1a2e',
        lineHeight: 1,
    },
    tagline: {
        fontSize: '11px',
        color: '#888',
        marginTop: '2px',
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
    },
    navLink: {
        fontSize: '13px',
        color: '#555',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'color .15s',
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: '#E1F5EE',
        color: '#085041',
        fontSize: '12px',
        fontWeight: 500,
        padding: '6px 12px',
        borderRadius: '99px',
        border: '0.5px solid #9FE1CB',
    },
    liveDot: {
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: '#1D9E75',
        display: 'inline-block',
        animation: 'pulse 2s infinite',
    }

}
