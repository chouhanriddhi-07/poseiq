import { useEffect, useRef } from "react";
import { useMediaPipe } from "../hooks/useMediaPipe";
import type { PoseFeedback } from "../poses/warrior2";
import type { PoseDefinition } from "../poses";


// Define what props Camera accepts
interface Props {
    onFeedback: (feedback: PoseFeedback) => void
    selectedPose: PoseDefinition
    onStop: () => void
}

export default function Camera({ onFeedback, selectedPose, onStop }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null)


    const { isLoading } = useMediaPipe(videoRef, canvasRef, onFeedback, selectedPose)


    useEffect(() => {
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 }
                });
                streamRef.current = stream

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
            }
        }

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop()
                })
                streamRef.current = null
            }
        }
    }, [])


    return (
        <div style={{
            position: 'relative',
            width: '100%',
            flex: 1,
            minHeight: '300px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#111',
        }}>

            {/* Live dot — top left */}
            <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 10,
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: '99px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
            }}>
                <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#D4537E',
                    display: 'inline-block',
                    animation: 'pulse 1.5s infinite',
                }} />
                Live
            </div>

            {/* Stop button — top right corner of camera */}
            <button
                onClick={onStop}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 10,
                    background: 'rgba(0,0,0,0.55)',
                    color: '#fff',
                    border: '0.5px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                }}
            >
                ⏹ Stop
            </button>

            {isLoading && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '14px',
                    zIndex: 2
                }}>
                    Loading AI model...
                </div>
            )}

            <video
                ref={videoRef}
                autoPlay playsInline muted
                style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    transform: 'scaleX(-1)',// mirror like a selfie camera
                    objectFit: 'cover',
                }}
            />

            {/* Canvas sits exactly on top of the video */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    transform: 'scaleX(-1)',  // mirror to match video
                    zIndex: 1
                }}
            />
        </div>
    )
}


