import { useCallback, useRef } from 'react';
import type { PoseFeedback } from "../poses/warrior2";

export function useCoachThrottle(
    onTrigger: (feedback: PoseFeedback) => void,
    intervalMs = 5000) {

    const lastTriggerRef = useRef(0);
    const lastScoreRef = useRef(-1);
    const totalCallsRef = useRef(0);
    const SESSION_LIMIT = 20;

    return useCallback((feedback: PoseFeedback) => {
        const now = Date.now();
        const scoreDiff = Math.abs(feedback.score - lastScoreRef.current);

        if (totalCallsRef.current >= SESSION_LIMIT) return

        // Only call if 5s have passed AND score changed by 10+ points

        if (now - lastTriggerRef.current > intervalMs && scoreDiff >= 10) {
            lastTriggerRef.current = now;
            lastScoreRef.current = feedback.score;
            totalCallsRef.current += 1;
            onTrigger(feedback);

        }
    }, [onTrigger, intervalMs])
}