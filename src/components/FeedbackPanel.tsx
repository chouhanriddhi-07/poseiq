import { theme } from '../theme'
import type { PoseFeedback } from '../poses/warrior2'
import Logo from './Logo'

interface Props {
    feedback: PoseFeedback | null
    poseName?: string
}

export default function FeedbackPanel({ feedback, poseName }: Props) {

    if (!feedback) {
        return (
            <div style={styles.panel}>
                <h2 style={styles.title}>PoseIQ Analysis</h2>
                <div style={styles.waiting}>
                    <span style={{ fontSize: '48px' }}> <Logo size={48} /> </span>
                    <p style={{ marginTop: '12px', color: theme.lavenderMuted, fontSize: '13px' }}>
                        Get into a pose to start analysis
                    </p>
                </div>
            </div>
        )
    }

    const ringColor = feedback.score >= 75 ? theme.lavenderAccent :
        feedback.score >= 50 ? theme.roseAccent : '#E24B4A'

    return (
        <div style={styles.panel}>
            <h2 style={styles.title}>PoseIQ Analysis</h2>

            {/* Score ring */}
            <div style={styles.scoreWrapper}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50"
                        fill="none"
                        stroke={theme.lavenderBorder}
                        strokeWidth="10"
                    />
                    <circle cx="60" cy="60" r="50"
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(feedback.score / 100) * 314} 314`}
                        transform="rotate(-90 60 60)"
                    />
                    <text x="60" y="55" textAnchor="middle"
                        style={{ fontSize: '28px', fontWeight: 700, fill: ringColor }}>
                        {feedback.score}
                    </text>
                    <text x="60" y="72" textAnchor="middle"
                        style={{ fontSize: '11px', fill: theme.lavenderMuted }}>
                        / 100
                    </text>
                </svg>

                <p style={{
                    marginTop: '8px',
                    fontWeight: 600,
                    color: ringColor,
                    fontSize: '16px',
                }}>
                    {feedback.score >= 75 ? '✅ Good form!' :
                        feedback.score >= 50 ? '⚠️ Getting there' : '❌ Needs work'}
                </p>
            </div>

            {/* Pose badge */}
            <div style={styles.poseBadge}>{poseName}</div>

            {/* Feedback list */}
            <ul style={styles.list}>
                {feedback.feedback.map((msg, i) => (
                    <li key={i} style={{
                        ...styles.listItem,
                        borderLeft: `3px solid ${feedback.isCorrect ? theme.lavenderAccent : theme.roseAccent}`,
                        background: feedback.isCorrect ? theme.lavenderSurface : '#FDF0F5'
                    }}>
                        {feedback.isCorrect ? '✅' : '⚠️'} {msg}
                    </li>
                ))}
            </ul>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    panel: {
        background: '#ffffff',
        borderLeft: '0.5px solid #DDD8FA',
        borderRadius: '0',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        minHeight: '100%',
        width: '100%',
    },
    title: {
        fontSize: '18px',
        fontWeight: 700,
        color: theme.lavenderDeep,
        margin: 0,
        alignSelf: 'flex-start',
    },
    waiting: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    scoreWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
    },
    poseBadge: {
        background: theme.lavenderBg,
        color: theme.lavenderDark,
        fontSize: '12px',
        fontWeight: 600,
        padding: '4px 12px',
        borderRadius: '99px',
        border: `0.5px solid ${theme.lavenderBorder}`,
        letterSpacing: '0.05em',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    listItem: {
        fontSize: '13px',
        color: theme.textPrimary,
        background: theme.lavenderSurface,
        padding: '10px 12px',
        borderRadius: '8px',
        lineHeight: '1.5',
        listStyle: 'none',
    },
}