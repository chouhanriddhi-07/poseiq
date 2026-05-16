import { DrawingUtils, FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import React, { useEffect, useRef } from "react";
import { analyzeWarrior2, type PoseFeedback } from '../poses/warrior2';
import type { PoseDefinition } from "../poses";

export function useMediaPipe(
    videoRef: React.RefObject<HTMLVideoElement | null>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    onFeedback: (feedback: PoseFeedback) => void,
    selectedPose: PoseDefinition
) {
    const landmarkRef = useRef<PoseLandmarker | null>(null);
    const animationRef = useRef<number>(0);
    const [isLoading, setIsLoading] = React.useState(true);

    const selectedPoseRef = useRef(selectedPose)


    useEffect(() => {
        selectedPoseRef.current = selectedPose
    }, [selectedPose])

    useEffect(() => {
        async function initMediaPipe() {
            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
            );
            landmarkRef.current = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
                    delegate: 'GPU',
                },
                runningMode: 'VIDEO',
                numPoses: 1,
            });
            setIsLoading(false);
            startDetection();
        }

        function startDetection() {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const landmark = landmarkRef.current;

            if (!video || !canvas || !landmark) return;

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                video.addEventListener('loadeddata', () => startDetection(), { once: true });
                return;
            }

            const ctx = canvas.getContext('2d')!;
            const drawingUtils = new DrawingUtils(ctx);
            let lastTime = -1;

            function detect() {
                if (lastTime !== video!.currentTime) {
                    if (video!.videoWidth === 0 || video!.videoHeight === 0) {
                        animationRef.current = requestAnimationFrame(detect);
                        return;
                    }

                    lastTime = video!.currentTime;
                    canvas!.width = video!.videoWidth;
                    canvas!.height = video!.videoHeight;

                    const result = landmark!.detectForVideo(video!, performance.now());
                    ctx.clearRect(0, 0, canvas!.width, canvas!.height);

                    if (result.landmarks.length > 0) {
                        const landmarks = result.landmarks[0];

                        drawingUtils.drawConnectors(
                            landmarks,
                            PoseLandmarker.POSE_CONNECTIONS,
                            { color: '#1D9E75', lineWidth: 2 }
                        );
                        drawingUtils.drawLandmarks(landmarks, {
                            color: '#ffffff',
                            fillColor: '#1D9E75',
                            radius: 4
                        });

                        // ✅ Single analysis call, no duplication
                        const analysis = selectedPoseRef.current.analyze(landmarks)
                        onFeedback(analysis);
                    }
                }
                animationRef.current = requestAnimationFrame(detect);
            }
            detect();
        }

        initMediaPipe();
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    return { isLoading };
}