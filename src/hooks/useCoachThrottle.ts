import { useCallback, useRef } from 'react';
import type { PoseFeedback } from "../poses/warrior2";

export function useCoachThrottle(
    onTrigger: (feedback: PoseFeedback) => void,
    intervalMs = 5000) {

    const lastTriggerRef = useRef(0);
    const lastScoreRef = useRef(-1);

    return useCallback((feedback: PoseFeedback) => {
        const now = Date.now();
        const scoreDiff = Math.abs(feedback.score - lastScoreRef.current);

        // Only call if 5s have passed AND score changed by 10+ points

        if (now - lastTriggerRef.current > intervalMs && scoreDiff >= 10) {
            onTrigger(feedback);
            lastTriggerRef.current = now;
            lastScoreRef.current = feedback.score;
        }
    }, [onTrigger, intervalMs])
}