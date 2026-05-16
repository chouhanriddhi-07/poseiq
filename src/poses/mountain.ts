import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { calculateAngle } from '../utils/angles'
import type { PoseFeedback } from './warrior2'

export function analyzeMountain(landmarks: NormalizedLandmark[]): PoseFeedback {
    const feedback: string[] = []
    let score = 100

    // ── Both legs must be straight ──
    const leftKneeAngle = calculateAngle(
        landmarks[23], // left hip
        landmarks[25], // left knee
        landmarks[27]  // left ankle
    )
    if (leftKneeAngle < 160) {
        feedback.push(`Straighten your left leg (currently ${leftKneeAngle}°)`)
        score -= 20
    }

    const rightKneeAngle = calculateAngle(
        landmarks[24], // right hip
        landmarks[26], // right knee
        landmarks[28]  // right ankle
    )
    if (rightKneeAngle < 160) {
        feedback.push(`Straighten your right leg (currently ${rightKneeAngle}°)`)
        score -= 20
    }

    // ── Shoulders must be level (y values close to each other) ──
    // In MediaPipe, y increases downward — a big difference means tilting
    const shoulderLevelDiff = Math.abs(landmarks[11].y - landmarks[12].y)
    if (shoulderLevelDiff > 0.05) {
        feedback.push('Level your shoulders — you are tilting to one side')
        score -= 20
    }

    // ── Arms must be at sides, NOT raised ──
    // Wrists should be below or level with hips (y greater than hip y)
    const leftWristBelowHip = landmarks[15].y > landmarks[23].y - 0.05
    const rightWristBelowHip = landmarks[16].y > landmarks[24].y - 0.05

    if (!leftWristBelowHip) {
        feedback.push('Relax your left arm down at your side')
        score -= 15
    }
    if (!rightWristBelowHip) {
        feedback.push('Relax your right arm down at your side')
        score -= 15
    }

    // ── Body upright — hips and shoulders should be vertically aligned ──
    // Check that shoulder x and hip x are close (not leaning forward/back)
    const leftLeanDiff = Math.abs(landmarks[11].x - landmarks[23].x)
    const rightLeanDiff = Math.abs(landmarks[12].x - landmarks[24].x)

    if (leftLeanDiff > 0.08 || rightLeanDiff > 0.08) {
        feedback.push('Stand tall — keep your hips directly under your shoulders')
        score -= 10
    }

    if (feedback.length === 0) feedback.push('Perfect Mountain Pose! Stand tall and breathe.')

    return {
        isCorrect: score >= 75,
        score: Math.max(0, score),
        feedback
    }
}