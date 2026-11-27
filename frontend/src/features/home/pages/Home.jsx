import { useRef, useState } from "react";
import { ListMusic, Music2, ScanFace } from "lucide-react";
import Header from "../components/Header";
import MoodDetection from "../components/MoodDetection";
import NowPlaying from "../components/NowPlaying";
import SongPanel from "../components/SongPanel";
import AudioPulse from "../components/AudioPulse";
import MoodHistoryModal from "../components/MoodHistoryModal";
import useHome from "../hooks/useHome";
import "../styles/Home.scss";

export default function Home() {
  const audioRef = useRef(null);
  const [mobileView, setMobileView] = useState("detect");
  const home = useHome(audioRef);

  return (
    <main className={`app app--${home.theme}`}>
      <div className="app__shell">
        <Header
          search={home.search}
          onSearchChange={home.setSearch}
          theme={home.theme}
          onToggleTheme={home.toggleTheme}
          user={home.user}
          onLogout={home.logoutUser}
          logoutError={home.logoutError}
        />

        <nav className="mobile-view-switcher" aria-label="Home sections">
          <button
            type="button"
            className={mobileView === "detect" ? "is-active" : ""}
            aria-pressed={mobileView === "detect"}
            onClick={() => setMobileView("detect")}
          >
            <ScanFace size={18} />
            <span>Detect</span>
          </button>
          <button
            type="button"
            className={mobileView === "player" ? "is-active" : ""}
            aria-pressed={mobileView === "player"}
            onClick={() => setMobileView("player")}
          >
            <Music2 size={18} />
            <span>Player</span>
          </button>
          <button
            type="button"
            className={mobileView === "library" ? "is-active" : ""}
            aria-pressed={mobileView === "library"}
            onClick={() => setMobileView("library")}
          >
            <ListMusic size={18} />
            <span>Library</span>
          </button>
        </nav>

        <section className="dashboard" data-mobile-view={mobileView}>
          <div className="dashboard__main">
            <div className="dashboard__top">
              <MoodDetection
                detectedMood={home.detectedMood}
                moodCover={home.detectedMood && !home.moodMessage && home.currentSong?.mood === home.detectedMood.mood ? home.currentSong.cover : ""}
                message={home.moodMessage}
                onMoodDetected={home.handleMoodDetected}
              />
            </div>

            <NowPlaying
              song={home.currentSong}
              isPlaying={home.isPlaying}
              currentTime={home.currentTime}
              duration={home.duration}
              volume={home.volume}
              playbackRate={home.playbackRate}
              sleepRemaining={home.sleepRemaining}
              sleepMinutes={home.sleepMinutes}
              sleepMenuOpen={home.sleepMenuOpen}
              onToggleSleepMenu={home.toggleSleepMenu}
              onSleepMinutesChange={home.setSleepMinutes}
              onStartSleepTimer={home.startSleepTimer}
              onClearSleepTimer={home.clearSleepTimer}
              onPlayPause={home.togglePlayback}
              onNext={home.playNext}
              onPrevious={home.playPrevious}
              onSeek={home.seek}
              onVolumeChange={home.setVolume}
              onPlaybackRateChange={home.setPlaybackRate}
              onOpenHistory={home.openHistory}
              shuffleEnabled={home.shuffleEnabled}
              onToggleShuffle={home.toggleShuffle}
            />
          </div>

          <SongPanel
            songs={home.filteredSongs}
            allSongs={home.songs}
            onSongDurationLoaded={home.setSongDuration}
            activeTab={home.activeTab}
            onTabChange={home.setActiveTab}
            currentSong={home.currentSong}
            queue={home.queue}
            onPlaySong={home.playSong}
            onQueueChange={home.setQueue}
            search={home.search}
            apiStatus={home.apiStatus}
            apiMessage={home.apiMessage}
            onRetry={home.loadSongs}
          />
        </section>

        <AudioPulse
          analyserRef={home.analyserRef}
          isPlaying={home.isPlaying}
        />

        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          onTimeUpdate={home.handleTimeUpdate}
          onLoadedMetadata={home.handleLoadedMetadata}
          onPlay={home.handleAudioPlay}
          onPause={home.handleAudioPause}
          onEnded={home.handleSongEnded}
          preload="metadata"
        />
      </div>

      {home.showHistory && (
        <MoodHistoryModal
          history={home.moodHistory}
          onClose={home.closeHistory}
        />
      )}
    </main>
  );
}
