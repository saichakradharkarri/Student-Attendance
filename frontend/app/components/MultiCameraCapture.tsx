"use client";

import React, { useRef, useEffect, useState } from "react";

export interface MultiCameraCaptureProps {
  onCapture: (images: string[]) => void; // Returns array of 5 captured images
}

const directions = ["Front", "Left", "Right", "Up", "Down"];

const MultiCameraCapture: React.FC<MultiCameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraStatus, setCameraStatus] = useState<"loading" | "active" | "stopped">("stopped");
  const [cameraError, setCameraError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  // Start camera
  const startCamera = async () => {
    try {
      setCameraStatus("loading");
      setCameraError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
      });

      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraStatus("active");
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setCameraError("Permission denied: Please allow camera access in your browser URL bar.");
      } else {
        setCameraError("Failed to access camera. Please check permissions.");
      }
      setCameraStatus("stopped");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraStatus("stopped");
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || cameraStatus !== "active") return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

    const updatedImages = [...capturedImages, dataUrl];
    setCapturedImages(updatedImages);
    setCurrentStep(currentStep + 1);

    if (updatedImages.length === directions.length) {
      onCapture(updatedImages); // Send all 5 images to parent
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Camera Status */}
      <div className="flex items-center space-x-2 text-sm">
        <div
          className={`w-3 h-3 rounded-full ${
            cameraStatus === "active"
              ? "bg-green-500"
              : cameraStatus === "loading"
              ? "bg-yellow-500 animate-pulse"
              : "bg-red-500"
          }`}
        ></div>
        <span className="text-gray-600">
          {cameraStatus === "active"
            ? "Camera Active"
            : cameraStatus === "loading"
            ? "Starting Camera..."
            : "Camera Stopped"}
        </span>
      </div>

      {/* Video */}
      <div className="relative w-full max-w-md min-h-[360px] flex items-center justify-center bg-black/20 rounded-lg shadow-inner">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`rounded-lg shadow-md w-full ${
            cameraStatus === "active" ? "block" : "hidden"
          }`}
          style={{ maxHeight: "360px" }}
        />

        {cameraStatus === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gray-900/80 p-6 text-center rounded-lg border border-white/10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white font-medium">Starting camera...</p>
            <p className="text-gray-400 text-sm mt-2">Please allow camera access.</p>
          </div>
        )}

        {cameraStatus === "stopped" && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/60 rounded-lg">
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Start Camera
            </button>
          </div>
        )}
        
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gray-900/80 p-6 text-center rounded-lg border border-red-500/50">
            <div className="text-red-500 mb-2">
              <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-400 font-semibold mb-3">{cameraError}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />



      {cameraStatus === "active" && currentStep < directions.length && (
        <div className="text-center text-white space-y-2">
          <p className="text-lg">
            Please look: <span className="font-bold">{directions[currentStep]}</span>
          </p>
          <button
            onClick={captureImage}
            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Capture
          </button>
        </div>
      )}

      {currentStep >= directions.length && (
        <div className="text-center text-green-400">
          <p>✅ All 5 images captured successfully!</p>
        </div>
      )}
    </div>
  );
};

export default MultiCameraCapture;
