import { theme } from '../theme'
import Logo from './Logo'

interface Props {
    isOpen: boolean
    onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: Props) {
    if (!isOpen) return null

    return (
        <div onClick={onClose} style={styles.backdrop}>
            <div onClick={e => e.stopPropagation()} style={styles.modal}>

                {/* Header */}
                <div style={styles.modalHeader}>
                    <div style={styles.brand}>
                        <Logo size={32} />
                        <div>
                            <div style={styles.title}>PoseIQ</div>
                            <div style={styles.subtitle}>AI-Powered Yoga Pose Analyzer</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {/* Body */}
                <div style={styles.body}>
                    <p style={styles.intro}>
                        PoseIQ uses your webcam and Google's MediaPipe AI to analyze
                        your yoga poses in real time — no app download, no equipment,
                        no data sent to any server. Everything runs privately in your browser.
                    </p>

                    <div style={styles.sectionTitle}>How it works</div>
                    <div style={styles.steps}>
                        {[
                            { icon: '📷', title: 'Webcam captures you', desc: 'Your camera feed is processed locally — never uploaded anywhere' },
                            { icon: '🤖', title: 'AI detects 33 body points', desc: 'MediaPipe Pose Landmarker maps your joints at 30 frames per second' },
                            { icon: '📐', title: 'Angles are calculated', desc: 'Joint angles are compared against ideal pose thresholds' },
                            { icon: '✅', title: 'You get instant feedback', desc: 'Live score and corrections update in real time as you move' },
                        ].map((step, i) => (
                            <div key={i} style={styles.step}>
                                <div style={styles.stepIcon}>{step.icon}</div>
                                <div>
                                    <div style={styles.stepTitle}>{step.title}</div>
                                    <div style={styles.stepDesc}>{step.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={styles.sectionTitle}>Built with</div>
                    <div style={styles.techRow}>
                        {['React', 'TypeScript', 'MediaPipe', 'Claude AI', 'Vite', 'Vercel'].map(t => (
                            <span key={t} style={styles.techBadge}>{t}</span>
                        ))}
                    </div>

                    <div style={styles.statusBox}>
                        <span style={styles.wip}>🚧 Actively in development</span>
                        <p style={{ fontSize: '12px', color: '#633806', margin: '4px 0 0' }}>
                            Hold timer, score history, and more poses coming soon.
                        </p>
                    </div>

                    <div style={styles.author}>
                        <div style={styles.avatar}>RC</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '14px', color: theme.lavenderDeep }}>
                                Riddhi Chouhan
                            </div>
                            <div style={{ fontSize: '12px', color: theme.lavenderMuted }}>
                                Lead Software Engineer · Portfolio project
                            </div>
                        </div>

                        <a href="https://www.linkedin.com/in/chouhanriddhi"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.linkedinBtn}
                        >
                            LinkedIn ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    backdrop: {
        position: 'fixed', inset: 0,
        background: 'rgba(38,33,92,0.4)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
    },
    modal: {
        background: theme.white,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflow: 'auto',
        border: `0.5px solid ${theme.lavenderBorder}`,
    },
    modalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: `0.5px solid ${theme.lavenderBorder}`,
        background: `linear-gradient(135deg, ${theme.lavenderSurface} 0%, ${theme.roseBg} 100%)`,
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    title: {
        fontSize: '20px',
        fontWeight: 700,
        color: theme.lavenderDeep,
        lineHeight: 1,
    },
    subtitle: {
        fontSize: '12px',
        color: theme.lavenderMuted,
        marginTop: '2px',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        color: theme.lavenderMuted,
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '6px',
    },
    body: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    intro: {
        fontSize: '14px',
        lineHeight: 1.7,
        color: theme.textPrimary,
        margin: 0,
    },
    sectionTitle: {
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '.07em',
        textTransform: 'uppercase',
        color: theme.lavenderMuted,
        marginBottom: '-8px',
    },
    steps: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    step: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        background: theme.lavenderSurface,
        border: `0.5px solid ${theme.lavenderBorder}`,
        borderRadius: '10px',
        padding: '12px',
    },
    stepIcon: {
        fontSize: '22px',
        flexShrink: 0,
        marginTop: '1px',
    },
    stepTitle: {
        fontSize: '13px',
        fontWeight: 600,
        color: theme.lavenderDeep,
        marginBottom: '2px',
    },
    stepDesc: {
        fontSize: '12px',
        color: theme.textSecondary,
        lineHeight: 1.5,
    },
    techRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
    },
    techBadge: {
        background: theme.lavenderBg,
        color: theme.lavenderDark,
        fontSize: '12px',
        fontWeight: 500,
        padding: '4px 10px',
        borderRadius: '99px',
        border: `0.5px solid ${theme.lavenderBorder}`,
    },
    statusBox: {
        background: '#FAEEDA',
        border: '0.5px solid #F5C87A',
        borderRadius: '10px',
        padding: '12px 14px',
    },
    wip: {
        fontSize: '13px',
        fontWeight: 600,
        color: '#633806',
    },
    author: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px',
        background: theme.lavenderSurface,
        border: `0.5px solid ${theme.lavenderBorder}`,
        borderRadius: '10px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: theme.roseAccent,
        color: theme.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 700,
        flexShrink: 0,
    },
    linkedinBtn: {
        marginLeft: 'auto',
        background: '#0A66C2',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 500,
        padding: '6px 12px',
        borderRadius: '99px',
        textDecoration: 'none',
    },
}