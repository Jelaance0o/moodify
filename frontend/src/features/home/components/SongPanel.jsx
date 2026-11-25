import { useMemo } from "react";
import { MoreHorizontal, Music2, ListMusic, RefreshCw } from "lucide-react";
import "../styles/SongPanel.scss";

const tabs = [
  { id: "all", label: "All" },
  { id: "lyrics", label: "Lyrics", Icon: Music2 },
  { id: "upnext", label: "Up Next", Icon: ListMusic },
];

function SongCover({ song, className }) {
  return (
    <span className={`song-cover ${className}`} aria-hidden="true">
      <Music2 size={18} />
      {song.cover && (
        <img
          src={song.cover}
          alt=""
          onError={(event) => { event.currentTarget.hidden = true; }}
        />
      )}
    </span>
  );
}

export default function SongPanel({
  songs,
  allSongs,
  activeTab,
  onTabChange,
  currentSong,
  queue,
  onPlaySong,
  onQueueChange,
  search,
  apiStatus,
  apiMessage,
  onRetry,
}) {
  const queuedSongs = useMemo(
    () => queue.map((id) => allSongs.find((song) => song.id === id)).filter(Boolean),
    [queue, allSongs]
  );

  const addToQueue = (song) => {
    onQueueChange((items) => items.includes(song.id) ? items : [...items, song.id]);
  };

  return (
    <aside className="song-panel">
      <div className="song-panel__heading">
        <div>
          <h2>All Songs <span>({allSongs.length})</span></h2>
          <div className={`api-status api-status--${apiStatus}`}>
            <i />
            <span>{apiStatus === "connected" ? "YOUR LIBRARY" : apiStatus === "loading" ? "CONNECTING" : "API OFFLINE"}</span>
          </div>
        </div>
        <button className="panel-refresh" onClick={onRetry} aria-label="Refresh songs" title="Refresh library">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* All three tabs share this single panel container. */}
      <div className="song-tabs" role="tablist" aria-label="Song panel views">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`song-tabs__tab ${activeTab === id ? "is-active" : ""}`}
            onClick={() => onTabChange(id)}
            role="tab"
            aria-selected={activeTab === id}
          >
            {Icon && <Icon size={16} />}
            {label}
          </button>
        ))}
      </div>

      {activeTab === "all" && (
        <div className="song-list" role="tabpanel">
          <div className="song-list__header">
            <span>#</span><span>TRACK / ARTIST</span><span>TIME</span><span />
          </div>

          {apiStatus === "loading" && <div className="api-state"><span className="api-spinner" />{apiMessage}</div>}

          {apiStatus === "error" && (
            <div className="api-state api-state--error">
              <strong>Couldn't load your music</strong>
              <span>{apiMessage}</span>
              <button onClick={onRetry}><RefreshCw size={14} /> Try again</button>
            </div>
          )}

          {apiStatus === "connected" && songs.map((song, index) => (
            <div className={`song-row ${currentSong?.id === song.id ? "is-current" : ""}`} key={song.id}>
              <span className="song-row__number">{String(index + 1).padStart(2, "0")}</span>
              <button className="song-row__main" onClick={() => onPlaySong(song)}>
                <SongCover song={song} className="song-row__cover" />
                <span>
                  <strong>{song.title}</strong>
                  <small>{song.artist}{song.mood && song.mood !== "unknown" ? ` · ${song.mood}` : ""}</small>
                </span>
              </button>
              <span className="song-row__duration">{song.duration}</span>
              <button className="song-row__more" onClick={() => addToQueue(song)} aria-label={`Add ${song.title} to queue`}>
                <MoreHorizontal size={19} />
              </button>
            </div>
          ))}

          {apiStatus === "connected" && !songs.length && (
            <p className="panel-empty">No songs found for “{search}”.</p>
          )}
        </div>
      )}

      {activeTab === "lyrics" && (
        <div className="lyrics-view" role="tabpanel">
          <div className="lyrics-view__song">
            {currentSong && <SongCover song={currentSong} className="lyrics-view__cover" />}
            <div><strong>{currentSong?.title || "No song selected"}</strong><span>{currentSong?.artist || "—"}</span></div>
          </div>
          <div className="lyrics-view__body">
            {currentSong?.lyrics?.length ? currentSong.lyrics.map((line, index) => (
              <p className={line.active ? "is-active" : ""} key={index}>{line.text}</p>
            )) : (
              <>
                <p className="lyrics-view__placeholder">Lyrics unavailable</p>
                <span>Your API can include a `lyrics` field to show it here.</span>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === "upnext" && (
        <div className="queue-view" role="tabpanel">
          <div className="queue-view__intro">
            <strong>Up Next</strong><span>{queuedSongs.length} tracks</span>
          </div>
          {queuedSongs.map((song, index) => (
            <div className="queue-row" key={`${song.id}-${index}`}>
              <span className="queue-row__number">{String(index + 1).padStart(2, "0")}</span>
              <button className="queue-row__main" onClick={() => onPlaySong(song)}>
                <SongCover song={song} className="queue-row__cover" />
                <span><strong>{song.title}</strong><small>{song.artist}</small></span>
              </button>
              <span className="queue-row__duration">{song.duration}</span>
            </div>
          ))}
          {!queuedSongs.length && <p className="panel-empty">Your queue is empty. Add songs from All.</p>}
        </div>
      )}
    </aside>
  );
}
