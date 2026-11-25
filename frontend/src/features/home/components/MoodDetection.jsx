import { useState } from "react";
import { Angry, ArrowRight, Camera, Frown, Smile, Sparkles } from "lucide-react";
import FaceExpression from "../../Expression/components/FaceExpression";
import "../styles/MoodDetection.scss";

const moodNames = { sad: "Sadness", happy: "Happiness", anger: "Anger", bliss: "Bliss" };
const moods = [
  { key: "happy", label: "Happy", emoji: "😊", Icon: Smile },
  { key: "sad", label: "Sad", emoji: "😢", Icon: Frown },
  { key: "anger", label: "Anger", emoji: "😠", Icon: Angry },
  { key: "bliss", label: "Bliss", emoji: "🥰", Icon: Sparkles },
];

export default function MoodDetection({ apiStatus, detectedMood, message, onMoodDetected, moodCover }) {
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
        <p>Your expression sets the tone. Smile with both palms open to unlock Bliss.</p>
        <button
          className="detect-button"
          disabled={isScanning || apiStatus !== "connected"}
          onClick={() => setScanRequest((request) => request + 1)}
        >
          <Camera size={21} />
          <span>
            {isScanning
              ? "Detecting Mood..."
              : apiStatus === "loading"
                ? "Loading Songs..."
                : apiStatus === "connected" ? "Detect Mood" : "Songs Unavailable"}
          </span>
          <ArrowRight size={20} />
        </button>
        <div className="mood-guide">
          <div className="mood-guide__heading">
            <strong>YOUR MOOD MIX</strong>
            <span>4 moods · 1 soundtrack</span>
          </div>
          <div className="mood-guide__items">
            {moods.map(({ key, label: moodLabel, emoji, Icon }) => (
              <div
                className={`mood-guide__item mood-guide__item--${key}${detectedMood?.mood === key ? " is-active" : ""}`}
                key={key}
              >
                <span className="mood-guide__emoji" aria-hidden="true">{emoji}</span>
                <Icon size={16} aria-hidden="true" />
                <span>{moodLabel}</span>
              </div>
            ))}
          </div>
          <span className="mood-guide__caption">We’ll find a song that fits how you feel.</span>
        </div>
        <div className="mood-result">
          {label ? (
            <><strong>{label}</strong><span>{Math.round(detectedMood.confidence * 100)}% confidence</span></>
          ) : <span>Your detected mood will appear here.</span>}
          {message && <span className="mood-result__message">{message}</span>}
        </div>
      </div>
    </section>
  );
}
