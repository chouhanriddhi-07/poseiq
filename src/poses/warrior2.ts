import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { calculateAngle } from '../utils/angles'

export interface PoseFeedback {
    isCorrect: boolean
    score: number        // 0-100
    feedback: string[]   // list of corrections
}

// MediaPipe landmark indices —
// 11=left shoulder, 12=right shoulder
// 13=left elbow,   14=right elbow
// 15=left wrist,   16=right wrist
// 23=left hip,     24=right hip
// 25=left knee,    26=right knee
// 27=left ankle,   28=right ankle

export function analyzeWarrior2(landmarks: NormalizedLandmark[]): PoseFeedback {
    const feedback: string[] = []
    let score = 100

    // ── Check front knee angle (should be ~90°) ──
    const leftKneeAngle = calculateAngle(
        landmarks[23], // left hip
        landmarks[25], // left knee
        landmarks[27]  // left ankle
    )

    if (leftKneeAngle < 80 || leftKneeAngle > 100) {
        feedback.push(`Bend your front knee to 90° (currently ${leftKneeAngle}°)`)
        score -= 25
    }

    // ── Check arms are parallel to floor (shoulder→wrist should be ~180°) ──
    const leftArmAngle = calculateAngle(
        landmarks[11], // left shoulder
        landmarks[13], // left elbow
        landmarks[15]  // left wrist
    )

    if (leftArmAngle < 160) {
        feedback.push(`Straighten your left arm (currently ${leftArmAngle}°)`)
        score -= 25
    }

    const rightArmAngle = calculateAngle(
        landmarks[12], // right shoulder
        landmarks[14], // right elbow
        landmarks[16]  // right wrist
    )

    if (rightArmAngle < 160) {
        feedback.push(`Straighten your right arm (currently ${rightArmAngle}°)`)
        score -= 25
    }

    // ── Check hips are open (left hip→right hip should be roughly level) ──
    const hipLevelDiff = Math.abs(landmarks[23].y - landmarks[24].y)
    if (hipLevelDiff > 0.05) {
        feedback.push('Keep your hips level and open to the side')
        score -= 25
    }

    if (feedback.length === 0) feedback.push('Perfect Warrior II! Hold it!')

    return {
        isCorrect: score >= 75,
        score: Math.max(0, score),
        feedback
    }
}