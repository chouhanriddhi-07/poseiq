import { theme } from '../theme'
import Logo from './Logo'

interface Props {
    onAboutClick: () => void
}

export default function Header({ onAboutClick }: Props) {
    return (
        <header style={styles.header}>

            {/* Brand */}
            <div style={styles.brand}>
                <Logo size={40} />
                <div>
                    <div style={styles.logoText}>PoseIQ</div>
                    <div style={styles.tagline}>AI-powered yoga analysis</div>
                </div>
            </div>

            {/* Nav */}
            <nav style={styles.nav}>

                <button
                    onClick={onAboutClick}
                    style={styles.navBtn}
                >
                    About
                </button>

                <a href="https://github.com/chouhanriddhi-07/poseiq"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.navLink}
                >
                    GitHub
                </a>
            </nav>

            {/* Live badge */}
            <div style={styles.badge}>
                <span style={styles.liveDot} />
                Live AI analysis
            </div>

        </header>
    )
}

const styles: Record<string, React.CSSProperties> = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: theme.white,
        borderBottom: `0.5px solid ${theme.lavenderBorder}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    logoText: {
        fontSize: '18px',
        fontWeight: 700,
        color: theme.lavenderDeep,
        lineHeight: 1,
    },
    tagline: {
        fontSize: '11px',
        color: theme.lavenderMuted,
        marginTop: '2px',
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
    },
    navLink: {
        fontSize: '13px',
        color: theme.lavenderDark,
        textDecoration: 'none',
        fontWeight: 500,
    },
    navBtn: {
        fontSize: '13px',
        color: theme.lavenderDark,
        fontWeight: 500,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: theme.lavenderBg,
        color: theme.lavenderDark,
        fontSize: '12px',
        fontWeight: 500,
        padding: '6px 12px',
        borderRadius: '99px',
        border: `0.5px solid ${theme.lavenderBorder}`,
    },
    liveDot: {
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: theme.lavenderAccent,
        display: 'inline-block',
        animation: 'pulse 2s infinite',
    },
}