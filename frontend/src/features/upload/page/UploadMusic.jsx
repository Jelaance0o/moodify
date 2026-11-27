import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  CloudUpload,
  FileText,
  Moon,
  Smile,
  Frown,
  Angry,
  Sparkles,
  Sun,
  Upload,
} from "lucide-react";

import { Link, useNavigate } from "react-router";
import useUploadMusic from "../hooks/useUpload";
import useTheme from "../../shared/hooks/useTheme";
import "../style/UploadMusic.scss";

const moods = [
  { name: "happy", label: "Happy", Icon: Smile },
  { name: "sad", label: "Sad", Icon: Frown },
  { name: "anger", label: "Anger", Icon: Angry },
  { name: "bliss", label: "Bliss", Icon: Sparkles },
];

const UploadMusic = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const {
    audioFile,
    mood,
    lyrics,
    loading,
    error,
    success,
    handleAudioChange,
    handleMoodChange,
    handleLyricsChange,
    handleUpload,
  } = useUploadMusic();

  return (
    <main className={`upload-page${theme === "dark" ? " upload-page--dark" : ""}`}>
      {/* Header */}
      <header className="upload-header">
        <div className="upload-brand">
          <Link className="upload-brand__link" to="/" aria-label="Moodify home">
            <h2>
              Moodify<span>.</span>
            </h2>
          </Link>

          <div className="brand-divider"></div>

          <p>Mood Based Music Player</p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={18} />
            Home
          </button>

          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="profile-avatar">U</div>
        </div>
      </header>

      {/* Upload Form */}
      <section className="upload-card">
        <div className="upload-heading">
          <div className="heading-icon">
            <AudioLines size={38} />
          </div>

          <div>
            <h1>
              Upload a Song<span>.</span>
            </h1>

            <p>Upload your MP3, select a mood, and add lyrics if available.</p>
          </div>
        </div>

        <form onSubmit={handleUpload}>
          <div className="upload-main">
            {/* MP3 Upload */}
            <div className="file-upload">
              <input
                type="file"
                id="song-file"
                accept=".mp3,audio/mpeg"
                onChange={(e) => handleAudioChange(e.target.files[0])}
                hidden
              />

              <label htmlFor="song-file" className="file-upload-label">
                <CloudUpload size={58} />

                <h3>
                  {audioFile ? audioFile.name : "Upload MP3 File"}

                  {!audioFile && <span>*</span>}
                </h3>

                <p>
                  {audioFile
                    ? `${(audioFile.size / (1024 * 1024)).toFixed(2)} MB`
                    : "Choose an MP3 file to upload"}
                </p>

                <span className="choose-file">
                  <Upload size={17} />

                  {audioFile ? "Choose Another MP3" : "Choose MP3"}
                </span>

                <small>Supported: MP3 | Max size: 20 MB</small>
              </label>
            </div>

            {/* Mood Selection */}
            <div className="mood-selection">
              <h3>
                Select Mood <span>*</span>
              </h3>

              <div className="mood-options">
                {moods.map(({ name, label, Icon }) => (
                  <button
                    type="button"
                    key={name}
                    className={`mood-option ${mood === name ? "active" : ""}`}
                    onClick={() => handleMoodChange(name)}
                  >
                    <Icon size={30} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lyrics */}
          <div className="lyrics-section">
            <label htmlFor="lyrics">
              Lyrics <span>(Optional)</span>
            </label>

            <div className="lyrics-input">
              <FileText size={20} />

              <textarea
                id="lyrics"
                value={lyrics}
                onChange={(e) => handleLyricsChange(e.target.value)}
                placeholder="Enter song lyrics if available..."
                maxLength={5000}
              />
            </div>

            <p className="character-count">{lyrics.length} / 5000</p>
          </div>

          {/* Feedback */}
          {error && <p className="upload-error">{error}</p>}

          {success && (
            <div className="upload-success">
              <p>{success}</p>
              <button type="button" onClick={() => navigate("/")}>
                Return to your library
              </button>
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="upload-submit" disabled={loading}>
            <Upload size={20} />

            {loading ? "Uploading..." : "Upload Song"}

            {!loading && <ArrowRight size={21} />}
          </button>
        </form>
      </section>
    </main>
  );
};

export default UploadMusic;
