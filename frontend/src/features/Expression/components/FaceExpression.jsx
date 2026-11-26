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

  const stopCamera = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const closeDetectors = useCallback(() => {
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    handLandmarkerRef.current?.close();
    handLandmarkerRef.current = null;
  }, []);

  const cleanupScan = useCallback(() => {
    stopCamera();
    closeDetectors();
  }, [closeDetectors, stopCamera]);

  const finishScan = useCallback((message, mood = null) => {
    scanId.current += 1;
    stopCamera();
    scanningRef.current = false;
    setIsScanning(false);
    scanningHandlerRef.current?.(false);
    setExpression(message);
    setDetectedExpression(mood);
  }, [stopCamera]);

  const startScan = useCallback(() => {
    if (scanningRef.current || isStarting.current) return;

    scanningRef.current = true;
    isStarting.current = true;
    const currentScan = ++scanId.current;
    setError("");
    setDetectedExpression(null);
    setExpression("Loading camera and mood detector");
    setIsScanning(true);
    scanningHandlerRef.current?.(true);
    const initializationTimeout = setTimeout(() => {
      if (currentScan !== scanId.current) return;
      isStarting.current = false;
      setError("Mood detector is taking too long to load. Check your connection and try again.");
      finishScan("Mood detector could not load.");
      closeDetectors();
    }, 20000);
    timeoutRef.current = initializationTimeout;
    init({
      landmarkerRef,
      handLandmarkerRef,
      videoRef,
      streamRef,
      isCancelled: () => currentScan !== scanId.current,
    }).then(
      () => {
        if (timeoutRef.current === initializationTimeout) {
          clearTimeout(initializationTimeout);
          timeoutRef.current = null;
        }
        if (currentScan !== scanId.current) {
          return;
        }
        isStarting.current = false;

        setExpression("Looking for your mood");
        const deadline = Date.now() + 8000;
        const moodHoldDurations = { bliss: 250, happy: 650, sad: 180, anger: 180 };
        const moodLabels = { bliss: "Bliss", happy: "Happy", sad: "Sad", anger: "Angry" };
        const moodGapTolerance = 250;
        let candidateMood = null;
        let candidateStartedAt = 0;
        let candidateLastSeenAt = 0;
        let candidateConfidence = 0;
        const completeMood = (expression, mood, confidence) => {
          moodHandlerRef.current?.(mood, confidence);
          finishScan(`${expression} detected`, mood);
        };
        const scan = () => {
          if (currentScan !== scanId.current) return;
          let result;
          try {
            result = detect({ landmarkerRef, handLandmarkerRef, videoRef });
          } catch (reason) {
            setError(reason.message || "Mood detection stopped unexpectedly. Try again.");
            finishScan("Mood detection failed.");
            closeDetectors();
            return;
          }

          const now = Date.now();
          if (result.mood) {
            if (candidateMood !== result.mood || now - candidateLastSeenAt > moodGapTolerance) {
              candidateMood = result.mood;
              candidateStartedAt = now;
              candidateConfidence = result.confidence;
              setExpression("Hold your expression steady");
            } else {
              candidateConfidence = Math.max(candidateConfidence, result.confidence);
            }
            candidateLastSeenAt = now;

            if (now - candidateStartedAt >= moodHoldDurations[result.mood]) {
              completeMood(result.expression, result.mood, candidateConfidence);
              return;
            }
          } else if (candidateMood && now - candidateLastSeenAt > moodGapTolerance) {
            candidateMood = null;
          }

          if (now >= deadline) {
            if (
              candidateMood &&
              now - candidateStartedAt >= moodHoldDurations[candidateMood] &&
              now - candidateLastSeenAt <= moodGapTolerance
            ) {
              completeMood(moodLabels[candidateMood], candidateMood, candidateConfidence);
            } else {
              finishScan("No mood detected. Try again.");
            }
            return;
          }

          animationRef.current = requestAnimationFrame(scan);
        };

        timeoutRef.current = setTimeout(() => {
          if (currentScan !== scanId.current) return;
          const now = Date.now();
          if (
            candidateMood &&
            now - candidateStartedAt >= moodHoldDurations[candidateMood] &&
            now - candidateLastSeenAt <= moodGapTolerance
          ) {
            completeMood(moodLabels[candidateMood], candidateMood, candidateConfidence);
          } else {
            finishScan("No mood detected. Try again.");
          }
        }, 8100);
        scan();
      },
      (reason) => {
        if (timeoutRef.current === initializationTimeout) {
          clearTimeout(initializationTimeout);
          timeoutRef.current = null;
        }
        if (currentScan !== scanId.current) {
          return;
        }
        isStarting.current = false;
        cleanupScan();
        scanningRef.current = false;
        setIsScanning(false);
        scanningHandlerRef.current?.(false);
        setExpression("Camera is off");
        setError(reason.message || "Unable to start the face scanner.");
      }
    );
  }, [cleanupScan, closeDetectors, finishScan]);

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
          <span className="face-scanner__indicator">Scanning mood</span>
        </>
      ) : (
        <div className="face-scanner__welcome" aria-live="polite">
          <div className="face-scanner__mood-art" aria-hidden="true">
            <span>😊</span><span>😢</span><span>😠</span><span>🥰</span>
          </div>
          <strong>{error ? "Mood scanner unavailable" : "Ready when you are"}</strong>
          <span>{error || "Start a scan and let your mood choose the music."}</span>
        </div>
      )}
    </div>
  );
}