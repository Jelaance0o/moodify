import { useState } from "react";
import { ArrowRight, Camera } from "lucide-react";
import FaceExpression from "../../Expression/components/FaceExpression";
import "../styles/MoodDetection.scss";

const moodNames = { sad: "Sadness", happy: "Happiness", anger: "Anger", bliss: "Bliss" };
const moods = [
  { key: "happy", label: "Happy", emoji: "😊", gesture: "Smile" },
  { key: "sad", label: "Sad", emoji: "😢", gesture: "Frown / look down" },
  { key: "anger", label: "Anger", emoji: "😠", gesture: "Lower brows" },
  { key: "bliss", label: "Bliss", emoji: "🥰", gesture: "Smile + both open palms" },
];

export default function MoodDetection({ detectedMood, message, onMoodDetected, moodCover }) {
  const [scanRequest, setScanRequest] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const label = detectedMood ? moodNames[detectedMood.mood] : null;

  return (
    <section className="mood-detection">
      <div className="camera-preview">
        <div className="camera-preview__top">
          <span><i /> CAMERA</span>
          <span>LIVE SCAN</span>
        </div>

        <div className="camera-preview__scanner">
          <FaceExpression
            onMoodDetected={onMoodDetected}
            onScanningChange={setIsScanning}
            scanRequest={scanRequest}
            cover={moodCover}
          />
        </div>

        <div className="camera-preview__bottom">
          <span>MOOD RECOGNITION</span>
          {label && <strong>{label} · {Math.round(detectedMood.confidence * 100)}%</strong>}
        </div>
      </div>

      <div className="detect-card">
        <div className="detect-card__heading">
          <h2>Detect Your Mood</h2>
          <span>01</span>
        </div>
        <p>Use a natural facial cue. Add both open palms to your smile to detect Bliss.</p>
        <button
          className="detect-button"
          disabled={isScanning}
          onClick={() => setScanRequest((request) => request + 1)}
        >
          <Camera size={21} />
          <span>{isScanning ? "Detecting Mood" : "Detect Mood"}</span>
          <ArrowRight size={20} />
        </button>
        <div className="mood-guide">
          <div className="mood-guide__heading">
            <strong>YOUR MOOD MIX</strong>
            <span>4 moods · 1 soundtrack</span>
          </div>
          <div className="mood-guide__items">
            {moods.map(({ key, label: moodLabel, emoji, gesture }) => (
              <div
                className={`mood-guide__item mood-guide__item--${key}${detectedMood?.mood === key ? " is-active" : ""}`}
                key={key}
              >
                <span className="mood-guide__emoji" aria-hidden="true">{emoji}</span>
                <strong className="mood-guide__label">{moodLabel}</strong>
                <small className="mood-guide__gesture">{gesture}</small>
              </div>
            ))}
          </div>
          <span className="mood-guide__caption">We’ll find a song that fits how you feel.</span>
        </div>
        {(label || message) && (
          <div className="mood-result">
            {label && (
              <>
                <strong>{label}</strong>
                <span>{Math.round(detectedMood.confidence * 100)}% confidence</span>
              </>
            )}
            {message && <span className="mood-result__message">{message}</span>}
          </div>
        )}
      </div>
    </section>
  );
}
