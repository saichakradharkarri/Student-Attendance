"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

export interface FaceData {
  box: [number, number, number, number];
  match: { user_id: string; name: string } | null;
  confidence?: number;
}

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  captureIntervalMs?: number | null;
  singleShot?: boolean;
  isLiveMode?: boolean;
  facesData?: FaceData[];
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  captureIntervalMs = null,
  singleShot = false,
  isLiveMode = false,
  facesData = [],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [cameraStatus, setCameraStatus] = useState<"loading" | "active" | "stopped">("stopped");
  const [cameraError, setCameraError] = useState<string>("");

  const startCamera = async () => {
    try {
      setCameraStatus("loading");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraStatus("active");
    } catch (err) {
      console.error("Camera error:", err);
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setCameraError("Permission denied: Please allow camera access in your browser settings or URL bar.");
      } else {
        setCameraError("Failed to access camera.");
      }
      setCameraStatus("stopped");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCameraStatus("stopped");
  };

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || cameraStatus !== "active") return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw rectangles and IDs
    facesData.forEach((face) => {
      const [x, y, w, h] = face.box;
      ctx.strokeStyle = face.match ? "lime" : "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      if (face.match) {
        ctx.fillStyle = "lime";
        ctx.font = "16px Arial";
        ctx.fillText(`${face.match.name} (${face.match.user_id})`, x, y - 5);
      } else {
        ctx.fillStyle = "red";
        ctx.font = "16px Arial";
        ctx.fillText("Unknown", x, y - 5);
      }
    });

    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    onCapture(dataUrl);
  }, [cameraStatus, facesData, onCapture]);

  useEffect(() => {
    if (singleShot || isLiveMode) startCamera();
    return () => stopCamera();
  }, [singleShot, isLiveMode]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (captureIntervalMs && isLiveMode && cameraStatus === "active") {
      intervalRef.current = setInterval(capture, captureIntervalMs);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [captureIntervalMs, isLiveMode, cameraStatus, facesData, capture]);

  return (
    <div className="relative w-full max-w-md min-h-[360px] flex items-center justify-center bg-black/20 rounded-lg">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`rounded-lg shadow-md w-full ${cameraStatus === "active" ? "block" : "hidden"}`}
        style={{ maxHeight: "360px" }}
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 rounded-lg w-full" />
      {cameraStatus === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gray-900/80 p-6 text-center rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white font-medium">Requesting Camera Access...</p>
          <p className="text-gray-400 text-sm mt-2">Please click &quot;Allow&quot; on the browser permission prompt.</p>
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gray-900/80 p-6 text-center rounded-lg">
          <div className="text-red-500 mb-2">
            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="text-red-400 font-semibold">{cameraError}</p>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
