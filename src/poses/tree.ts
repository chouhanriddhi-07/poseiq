import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { calculateAngle } from '../utils/angles'
import type { PoseFeedback } from './warrior2'

// 11=left shoulder, 12=right shoulder
// 13=left elbow,   14=right elbow
// 15=left wrist,   16=right wrist
// 23=left hip,     24=right hip
// 25=left knee,    26=right knee
// 27=left ankle,   28=right ankle

export function analyzeTree(landmarks: NormalizedLandmark[]): PoseFeedback {
    const feedback: string[] = []
    let score = 100

    // ── Raised leg (left) — knee should be bent, foot against inner thigh ──
    const leftKneeAngle = calculateAngle(
        landmarks[23], // left hip
        landmarks[25], // left knee
        landmarks[27]  // left ankle
    )

    if (leftKneeAngle < 30 || leftKneeAngle > 100) {
        feedback.push(`Bend your left knee and place your foot against your right inner thigh (currently ${leftKneeAngle}°)`)
        score -= 25
    }

    // ── Standing leg (right) — should be straight ──
    const rightKneeAngle = calculateAngle(
        landmarks[24], // right hip
        landmarks[26], // right knee
        landmarks[28]  // right ankle
    )

    if (rightKneeAngle < 160) {
        feedback.push(`Straighten your right (standing) leg (currently ${rightKneeAngle}°)`)
        score -= 25
    }

    // ── Arms overhead — check both straight AND raised ──
    const leftArmAngle = calculateAngle(landmarks[11], landmarks[13], landmarks[15])
    const leftWristAboveShoulder = landmarks[15].y < landmarks[11].y

    if (leftArmAngle < 160) {
        feedback.push(`Straighten your left arm (currently ${leftArmAngle}°)`)
        score -= 15
    }
    if (!leftWristAboveShoulder) {
        feedback.push('Raise your left arm fully overhead')
        score -= 10
    }

    const rightArmAngle = calculateAngle(landmarks[12], landmarks[14], landmarks[16])
    const rightWristAboveShoulder = landmarks[16].y < landmarks[12].y

    if (rightArmAngle < 160) {
        feedback.push(`Straighten your right arm (currently ${rightArmAngle}°)`)
        score -= 15
    }
    if (!rightWristAboveShoulder) {
        feedback.push('Raise your right arm fully overhead')
        score -= 10
    }

    if (feedback.length === 0) feedback.push('Perfect Tree Pose! Hold it!')

    return {
        isCorrect: score >= 75,
        score: Math.max(0, score),
        feedback
    }
}