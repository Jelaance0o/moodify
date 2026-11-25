import { useCallback, useEffect, useRef, useState } from "react";
import { Angry, Frown, Smile, Sparkles } from "lucide-react";
import { detect, init } from "../utils/utils";

const moodVisuals = {
  happy: { label: "Happy", emoji: "😊", Icon: Smile },
  sad: { label: "Sad", emoji: "😢", Icon: Frown },
  anger: { label: "Anger", emoji: "😠", Icon: Angry },
  bliss: { label: "Bliss", emoji: "🥰", Icon: Sparkles },
};

export default function FaceExpression({ onMoodDetected, onScanningChange, scanRequest, cover }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const timeoutRef = useRef(null);
  const scanId = useRef(0);
  const isStarting = useRef(false);
  const scanningRef = useRef(false);
  const requestRef = useRef(0);
  const moodHandlerRef = useRef(onMoodDetected);
  const scanningHandlerRef = useRef(onScanningChange);
  const [expression, setExpression] = useState("Press Detect Mood to start");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [detectedExpression, setDetectedExpression] = useState(null);

  useEffect(() => {
    moodHandlerRef.current = onMoodDetected;
    scanningHandlerRef.current = onScanningChange;
  }, [onMoodDetected, onScanningChange]);

  const cleanupScan = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    handLandmarkerRef.current?.close();
    handLandmarkerRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const finishScan = useCallback((message, mood = null) => {
    scanId.current += 1;
    cleanupScan();
    scanningRef.current = false;
    setIsScanning(false);
    scanningHandlerRef.current?.(false);
    setExpression(message);
    setDetectedExpression(mood);
  }, [cleanupScan]);

  const startScan = useCallback(() => {
    if (scanningRef.current || isStarting.current) return;

    scanningRef.current = true;
    isStarting.current = true;
    const currentScan = ++scanId.current;
    setError("");
    setDetectedExpression(null);
    setExpression("Starting camera and loading mood detection...");
    setIsScanning(true);
    scanningHandlerRef.current?.(true);
    init({ landmarkerRef, handLandmarkerRef, videoRef, streamRef }).then(
      () => {
        isStarting.current = false;
        if (currentScan !== scanId.current) {
          cleanupScan();
          return;
        }

        setExpression("Looking for your mood...");
        const deadline = Date.now() + 8000;
        const scan = () => {
          if (currentScan !== scanId.current) return;
          const result = detect({ landmarkerRef, handLandmarkerRef, videoRef });

          if (result.mood) {
            moodHandlerRef.current?.(result.mood, result.confidence);
            finishScan(`${result.expression} detected`, result.mood);
            return;
          }

          if (Date.now() >= deadline) {
            finishScan("No mood detected. Try again.");
            return;
          }

          animationRef.current = requestAnimationFrame(scan);
        };

        timeoutRef.current = setTimeout(() => {
          if (currentScan === scanId.current) finishScan("No mood detected. Try again.");
        }, 8100);
        scan();
      },
      (reason) => {
        isStarting.current = false;
        if (currentScan !== scanId.current) {
          cleanupScan();
          return;
        }
        cleanupScan();
        scanningRef.current = false;
        setIsScanning(false);
        scanningHandlerRef.current?.(false);
        setExpression("Camera is off");
        setError(reason.message || "Unable to start the face scanner.");
      }
    );
  }, [cleanupScan, finishScan]);

  useEffect(() => {
    if (scanRequest === requestRef.current) return;
    requestRef.current = scanRequest;
    startScan();
  }, [scanRequest, startScan]);

  useEffect(() => {
    return () => {
      scanId.current += 1;
      cleanupScan();
    };
  }, [cleanupScan]);

  const moodVisual = detectedExpression ? moodVisuals[detectedExpression] : null;

  return (
    <div className="face-scanner">
      {moodVisual ? (
        <div className={`face-scanner__emotion face-scanner__emotion--${detectedExpression}`} aria-live="polite">
          {cover && <img className="face-scanner__cover" src={cover} alt="" />}
          <div className="face-scanner__emotion-content">
            <span className="face-scanner__emoji" aria-hidden="true">{moodVisual.emoji}</span>
            <moodVisual.Icon size={34} aria-hidden="true" />
            <strong>{moodVisual.label} detected</strong>
            <span>Your mood is guiding the music.</span>
          </div>
        </div>
      ) : isScanning ? (
        <>
          <video ref={videoRef} playsInline muted />
          <p aria-live="polite">{error || expression}</p>
          <span className="face-scanner__indicator">Scanning...</span>
        </>
      ) : (
        <div className="face-scanner__welcome" aria-live="polite">
          <div className="face-scanner__mood-art" aria-hidden="true">
            <span>😊</span><span>😢</span><span>😠</span><span>🥰</span>
          </div>
          <strong>{error ? "Camera unavailable" : "Ready when you are"}</strong>
          <span>{error || "Start a scan and let your mood choose the music."}</span>
        </div>
      )}
    </div>
  );
}