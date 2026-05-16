// src/poses/index.ts — central registry
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { analyzeMountain } from './mountain'
import { analyzeTree } from './tree'
import type { PoseFeedback } from './warrior2'
import { analyzeWarrior2 } from './warrior2'

export interface PoseDefinition {
    id: string
    name: string
    emoji: string
    difficulty: 'Beginner' | 'Intermediate'
    analyze: (landmarks: NormalizedLandmark[]) => PoseFeedback
}

export const POSES: PoseDefinition[] = [
    { id: 'warrior2', name: 'Warrior II', emoji: '🥋', difficulty: 'Intermediate', analyze: analyzeWarrior2 },
    { id: 'tree', name: 'Tree pose', emoji: '🌳', difficulty: 'Beginner', analyze: analyzeTree },
    { id: 'mountain', name: 'Mountain pose', emoji: '⛰️', difficulty: 'Beginner', analyze: analyzeMountain },
]