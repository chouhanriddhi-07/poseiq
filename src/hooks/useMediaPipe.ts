import { DrawingUtils, FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import React, { useEffect, useRef, useState } from "react";

export function useMediaPipe(
    videoRef: React.RefObject<HTMLVideoElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>
) {

    // Stores the PoseLandmarker instance between renders
    const landmarkRef = useRef<PoseLandmarker | null>(null);

    // Tracks the animation loop so we can cancel it on cleanup
    const animationRef = useRef<number>(0);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function initMediaPipe() {
            // FilesetResolver downloads the WebAssembly files MediaPipe needs
            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
            );

            // Create the PoseLandmarker instance with the appropriate options
            landmarkRef.current = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
                    delegate: 'GPU', // use GPU for better performance
                },
                runningMode: 'VIDEO', // VIDEO mode = optimized for live streams
                numPoses: 1,  // only detect 1 person
            })

            setIsLoading(false)
            startDetection()
        }

        function startDetection() {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const landmark = landmarkRef.current;

            if (!video || !canvas || !landmark) {
                return;
            }

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                video.addEventListener('loadeddata', () => startDetection(), { once: true })
                return
            }

            const ctx = canvas.getContext('2d')!;
            const drawingUtils = new DrawingUtils(ctx);

            let lastTime = -1

            function detect() {
                // Only process if the video has a new frame
                if (lastTime !== video.currentTime) {

                    if (video.videoWidth === 0 || video.videoHeight === 0) {
                        animationRef.current = requestAnimationFrame(detect)
                        return
                    }

                    lastTime = video.currentTime;

                    // Match canvas size to Video
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight

                    // Run pose detection on this frame
                    const result = landmark!.detectForVideo(
                        video,
                        performance.now()
                    )

                    // Clear previous frame's drawing
                    ctx.clearRect(0, 0, canvas.width, canvas.height)

                    // Draw skeleton if a pose was detected
                    if (result.landmarks.length > 0) {
                        const landmarks = result.landmarks[0];

                        // Draw the connecting lines between joints
                        drawingUtils.drawConnectors(
                            landmarks,
                            PoseLandmarker.POSE_CONNECTIONS,
                            { color: '#1D9E75', lineWidth: 2 }
                        )

                        // Draw a dot at each landmark point
                        drawingUtils.drawLandmarks(landmarks, {
                            color: '#ffffff',
                            fillColor: '#1D9E75',
                            radius: 4
                        })
                    }
                }

                // Schedule the next frame — this is the animation loop
                animationRef.current = requestAnimationFrame(detect)
            }
            detect()
        }
        initMediaPipe()

        // Cleanup: stop the animation loop when component unmounts
        return () => cancelAnimationFrame(animationRef.current)
    }, [])
    return { isLoading }
}

function startDetection() {
    throw new Error("Function not implemented.");
}
