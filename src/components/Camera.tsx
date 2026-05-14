import { useEffect, useRef } from "react";
import { useMediaPipe } from "../hooks/useMediaPipe";

export default function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const { isLoading } = useMediaPipe(videoRef, canvasRef)


    useEffect(() => {
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
            }
        }

        startCamera();

        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        }
    }, []);

    return (
        <div style={{ position: 'relative', width: '640px', height: '480px' }}>
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
                    width: '640px', height: '480px',
                    transform: 'scaleX(-1)'   // mirror like a selfie camera
                }}
            />

            {/* Canvas sits exactly on top of the video */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '640px', height: '480px',
                    transform: 'scaleX(-1)',  // mirror to match video
                    zIndex: 1
                }}
            />
        </div>
    )
}


