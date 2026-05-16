import type { PoseFeedback } from '../poses/warrior2'

interface Props {
    feedback: PoseFeedback | null
}

export default function FeedbackPanel({ feedback }: Props) {
    if (!feedback) {
        return (
            <div style={styles.panel}>
                <h2 style={styles.title}>PoseIQ Analysis</h2>
                <div style={styles.waiting}>
                    <span style={{ fontSize: '48px' }}>🧘</span>
                    <p style={{ marginTop: '12px', color: '#888' }}>
                        Get into Warrior II position to start analysis
                    </p>
                </div>
            </div>
        )
    }

    const ringColor = feedback.score >= 75 ? '#1D9E75' :
        feedback.score >= 50 ? '#EF9F27' : '#E53935'

    return (
        <div style={styles.panel}>
            <h2 style={styles.title}>PoseIQ Analysis</h2>

            {/* Score ring */}
            <div style={styles.scoreWrapper}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                    {/* Background ring */}
                    <circle cx="60" cy="60" r="50"
                        fill="none" stroke="#e0e0e0" strokeWidth="10" />
                    {/* Score ring — strokeDasharray animates the fill */}
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
                        style={{ fontSize: '11px', fill: '#888' }}>
                        / 100
                    </text>
                </svg>

                <p style={{
                    marginTop: '8px',
                    fontWeight: 600,
                    color: ringColor,
                    fontSize: '16px'
                }}>
                    {feedback.score >= 75 ? '✅ Good form!' :
                        feedback.score >= 50 ? '⚠️ Getting there' : '❌ Needs work'}
                </p>
            </div>

            {/* Pose name */}
            <div style={styles.poseBadge}>Warrior II</div>

            {/* Feedback messages */}
            <ul style={styles.list}>
                {feedback.feedback.map((msg, i) => (
                    <li key={i} style={{
                        ...styles.listItem,
                        borderLeft: `3px solid ${feedback.isCorrect ? '#1D9E75' : '#EF9F27'}`
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
        width: '280px',
        minHeight: '480px',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        fontFamily: 'system-ui, sans-serif'
    },
    title: {
        fontSize: '18px',
        fontWeight: 700,
        color: '#1a1a2e',
        margin: 0,
        alignSelf: 'flex-start'
    },
    waiting: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    scoreWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
    },
    poseBadge: {
        background: '#E1F5EE',
        color: '#085041',
        fontSize: '12px',
        fontWeight: 600,
        padding: '4px 12px',
        borderRadius: '99px',
        letterSpacing: '0.05em'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    listItem: {
        fontSize: '13px',
        color: '#333',
        background: '#f9f9f9',
        padding: '10px 12px',
        borderRadius: '8px',
        lineHeight: '1.5'
    }
}