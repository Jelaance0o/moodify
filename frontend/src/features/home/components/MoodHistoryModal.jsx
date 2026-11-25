import { X, History } from "lucide-react";
import "../styles/MoodHistoryModal.scss";
const labels = { sad: "Sadness", happy: "Happiness", anger: "Anger", bliss: "Bliss" };
export default function MoodHistoryModal({ history, onClose }) {
  return (
    <div
      className="history-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="history-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
      >
        <header>
          <div>
            <History size={20} />
            <h2 id="history-title">Mood History</h2>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>
        {history.length ? (
          <div className="history-list">
            {history.map((item) => (
              <article key={item.id}>
                <div>
                  <strong>{labels[item.key]}</strong>
                  <span>{item.at}</span>
                </div>
                <b>{Math.round(item.confidence * 100)}%</b>
                <small>Playing: {item.song}</small>
              </article>
            ))}
          </div>
        ) : (
          <p className="history-empty">
            Your detected moods will appear here after your first scan.
          </p>
        )}
      </section>
    </div>
  );
}
