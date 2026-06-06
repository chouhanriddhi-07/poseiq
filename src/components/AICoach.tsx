import { useCallback, useState } from "react"
import type { PoseFeedback } from "../poses/warrior2"
import { useCoachThrottle } from "../hooks/useCoachThrottle"

interface Props {
    feedback: PoseFeedback | null
    poseName: string
}

export default function AICoach({ feedback, poseName }: Props) {
    const [coachText, setCoachText] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)


    const callCoach = useCallback(async (feedback: PoseFeedback) => {
        setIsLoading(true)
        setCoachText('')

        try {
            const response = await fetch('/api/coach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    poseName,
                    score: feedback.score,
                    failingChecks: feedback.feedback
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            if (!response.body) throw new Error('No response body')


            // Read the stream chunk by chunk
            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                // Append each chunk to the coaching text as it arrives
                setCoachText((prev: string) => prev + decoder.decode(value))
            }

        } catch (error) {
            console.error('Error fetching coach feedback:', error)
            setCoachText('Sorry, I had trouble generating feedback. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [poseName])

    // Throttled trigger — only fires every 5s when score changes significantly
    const throttledTrigger = useCoachThrottle(callCoach)

    // Trigger whenever feedback updates
    if (feedback) throttledTrigger(feedback)

    return (
        <div style={styles.box}>
            <div style={styles.header}>
                <i className="ti ti-brain"
                    style={{ fontSize: '16px' }}
                    aria-hidden="true"
                />
                AI Coach
                {isLoading && <span style={styles.dot} />}
            </div>

            <p style={styles.text}>
                {coachText || 'Get into a pose to receive AI coaching...'}
            </p>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    box: {
        background: '#ffffff',
        border: '0.5px solid #e0e0e0',
        borderRadius: '12px',
        padding: '14px 16px',
        marginTop: '12px',
        fontFamily: 'system-ui, sans-serif',
        minHeight: '80px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#085041',
        marginBottom: '8px',
    },
    dot: {
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: '#1D9E75',
        display: 'inline-block',
        animation: 'pulse 1s infinite',
    },
    text: {
        fontSize: '13px',
        color: '#444',
        lineHeight: 1.65,
        margin: 0,
    }
}