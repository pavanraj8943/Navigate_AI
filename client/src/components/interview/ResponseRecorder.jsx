import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, Square, Video, AlertCircle } from 'lucide-react';

export function ResponseRecorder({ isRecording, onToggleRecording }) {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);

    useEffect(() => {
        const toggleMedia = async () => {
            // Cleanup existing tracks if turning off
            if (!isCameraOn && !isMicOn) {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                }
                return;
            }

            try {
                // Determine constraints based on toggles
                const constraints = {
                    video: isCameraOn,
                    audio: isMicOn
                };

                // If both off (handled above), or if we need to request new stream
                if (isCameraOn || isMicOn) {
                    // Specific logic: if stream exists, check if we need to add/remove tracks OR get fresh stream.
                    // Easiest reliable way: Stop old, get new.
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }

                    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                    setError(null);
                }
            } catch (err) {
                console.error("Error accessing media:", err);
                setError("Unable to access camera or microphone. Please check permissions.");
                // Reset toggles on error
                setIsCameraOn(false);
                setIsMicOn(false);
            }
        };

        toggleMedia();

        return () => {
            // Cleanup on unmount is handled by the dependency change logic predominantly,
            // but we need a final cleanup.
            // Note: This return runs before the NEXT effect run.
            // We shouldn't stop tracks here IF we want to persist between renders,
            // but for toggle logic, the effect re-runs on state change.
        };
    }, [isCameraOn, isMicOn]);

    // Cleanup on unmount of component only
    useEffect(() => {
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
        <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg flex flex-col">
            <div className="flex-1 relative overflow-hidden">
                {error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                        <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        {isCameraOn ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                                <div className="flex flex-col items-center">
                                    <Camera className="w-12 h-12 mb-2 opacity-50" />
                                    <p>Camera is Off</p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Recording Overlay */}
                {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-white text-xs font-mono font-medium tracking-wider">REC 00:00</span>
                    </div>
                )}
            </div>

            {/* Controls Bar */}
            <div className="h-16 bg-slate-950 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={`p-3 rounded-full transition-all ${isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                        title={isMicOn ? "Mute Microphone" : "Enable Microphone"}
                    >
                        <Mic className={`w-5 h-5 ${!isMicOn && "opacity-70"}`} />
                    </button>
                    <button
                        onClick={() => setIsCameraOn(!isCameraOn)}
                        className={`p-3 rounded-full transition-all ${isCameraOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                        title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
                    >
                        <Camera className={`w-5 h-5 ${!isCameraOn && "opacity-70"}`} />
                    </button>
                </div>

                <button
                    onClick={onToggleRecording}
                    disabled={!isMicOn} // Require mic for recording
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : isMicOn ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {isRecording ? (
                        <>
                            <Square className="w-4 h-4 fill-current" />
                            Stop
                        </>
                    ) : (
                        <>
                            <div className={`w-2 h-2 rounded-full ${isMicOn ? 'bg-red-300' : 'bg-slate-500'}`} />
                            Start Answer
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
