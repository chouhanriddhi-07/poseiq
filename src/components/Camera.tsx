import { useEffect, useRef } from "react";

export default function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);

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
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        }
    }, []);

    return (
        <video ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '640px', height: '480px', transform: 'scaleX(-1)' }}
        />

    )
}