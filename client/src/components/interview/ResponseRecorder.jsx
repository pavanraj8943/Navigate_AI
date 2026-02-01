import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, Square, Video, AlertCircle } from 'lucide-react';

export function ResponseRecorder({ isRecording, onToggleRecording }) {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Request camera access on mount
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setError(null);
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Unable to access camera or microphone. Please check permissions.");
            }
        };

        startCamera();

        // Cleanup on unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Re-attach stream if video ref updates
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, videoRef]);

    return (
        <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg">
            {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
                    <p>{error}</p>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                />
            )}

            {/* Overlays */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
                <button
                    onClick={onToggleRecording}
                    disabled={!!error}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shadow-lg ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-white hover:bg-blue-50 text-slate-900'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isRecording ? (
                        <>
                            <Square className="w-5 h-5 fill-current" />
                            Stop Recording
                        </>
                    ) : (
                        <>
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            Start Answer
                        </>
                    )}
                </button>
            </div>

            {/* Status Indicators */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-xs font-medium">
                    <Camera className="w-3.5 h-3.5 text-green-400" />
                    <span>{stream ? 'Camera On' : 'Connecting...'}</span>
                </div>
                <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-xs font-medium">
                    <Mic className="w-3.5 h-3.5 text-green-400" />
                    <span>Mic On</span>
                </div>
            </div>

            {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-white text-xs font-mono font-medium tracking-wider">REC 00:00</span>
                </div>
            )}
        </div>
    );
}
