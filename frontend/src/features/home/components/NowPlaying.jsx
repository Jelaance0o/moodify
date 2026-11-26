import { Clock3, Gauge, History, Music2, Pause, Play, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";
import "../styles/NowPlaying.scss";

const formatTime = (seconds = 0) => {
  const minutes = Math.floor((seconds || 0) / 60);
  const remaining = String(Math.floor((seconds || 0) % 60)).padStart(2, "0");
  return `${minutes}:${remaining}`;
};

export default function NowPlaying({
  song,
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackRate,
  sleepRemaining,
  sleepMinutes,
  sleepMenuOpen,
  onToggleSleepMenu,
  onSleepMinutesChange,
  onStartSleepTimer,
  onClearSleepTimer,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  onOpenHistory,
  shuffleEnabled,
  onToggleShuffle,
}) {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <section className="now-playing">
      <div className="now-playing__artwork">
        <Music2 className="now-playing__cover-placeholder" size={48} aria-hidden="true" />
        {song?.cover && (
          <img
            src={song.cover}
            alt={`${song.title || "Song"} cover`}
            onLoad={(event) => {
              event.currentTarget.hidden = false;
            }}
            onError={(event) => { event.currentTarget.hidden = true; }}
          />
        )}
      </div>

      <div className="now-playing__content">
        <div className="now-playing__top">
          <div className="now-playing__details">
            <span className="eyebrow">NOW PLAYING</span>
            <h1 title={song?.title || "Choose a song"}>{song?.title || "Choose a song"}</h1>
            <p>{song?.artist || "Unknown artist"}</p>
            {(song?.album || song?.genre || song?.mood) && (
              <div className="now-playing__metadata">
                {song?.album && <span>{song.album}</span>}
                {song?.genre && <span>{song.genre}</span>}
                {song?.mood && song.mood !== "unknown" && <span>{song.mood}</span>}
              </div>
            )}
          </div>

          <div className="now-playing__utility">
            <button className="utility-button" onClick={onOpenHistory}>
              <History size={17} /> Mood History
            </button>

            <div className="sleep-control">
              <button className="utility-button" onClick={onToggleSleepMenu}>
                <Clock3 size={17} />
                {sleepRemaining ? `${formatTime(sleepRemaining)} left` : "Sleep Timer"}
                <span>⌄</span>
              </button>

              {sleepMenuOpen && (
                <div className="sleep-menu">
                  <label htmlFor="sleep-time">Stop playback in</label>
                  <select
                    id="sleep-time"
                    value={sleepMinutes}
                    onChange={(event) => onSleepMinutesChange(Number(event.target.value))}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                  <button onClick={onStartSleepTimer}>Start timer</button>
                  {sleepRemaining > 0 && (
                    <button className="sleep-menu__clear" onClick={onClearSleepTimer}>Cancel timer</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="track-progress">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => onSeek(event.target.value)}
            style={{ "--progress": `${duration ? (currentTime / duration) * 100 : 0}%` }}
            aria-label="Song progress"
          />
          <div><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
        </div>

        <div className="player-controls">
          <label className="speed-control">
            <Gauge size={17} />
            <select
              value={playbackRate}
              onChange={(event) => onPlaybackRateChange(Number(event.target.value))}
              aria-label="Playback speed"
            >
              {speeds.map((speed) => <option key={speed} value={speed}>{speed}x</option>)}
            </select>
          </label>

          <div className="transport-controls">
            <button
              className={shuffleEnabled ? "shuffle-active" : ""}
              onClick={onToggleShuffle}
              aria-label={shuffleEnabled ? "Turn shuffle off" : "Turn shuffle on"}
              aria-pressed={shuffleEnabled}
              title={shuffleEnabled ? "Shuffle on" : "Shuffle off"}
            >
              <Shuffle />
            </button>
            <button onClick={onPrevious} aria-label="Previous song"><SkipBack /></button>
            <button className="play-button" onClick={onPlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
            </button>
            <button onClick={onNext} aria-label="Next song"><SkipForward /></button>
          </div>

          <label className="volume-control">
            <Volume2 size={19} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => onVolumeChange(Number(event.target.value))}
              aria-label="Volume"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
