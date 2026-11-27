import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import useTheme from "../../shared/hooks/useTheme";
import { getSongs } from "../services/songApi";

export default function useHome(audioRef) {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [songs, setSongs] = useState([]);
  const [apiStatus, setApiStatus] = useState("loading");
  const [apiMessage, setApiMessage] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentSongId, setCurrentSongId] = useState(null);
  const [queue, setQueue] = useState([]);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [detectedMood, setDetectedMood] = useState(null);
  const [moodMessage, setMoodMessage] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);
  const [logoutError, setLogoutError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [sleepMinutes, setSleepMinutes] = useState(30);
  const [sleepRemaining, setSleepRemaining] = useState(0);
  const [sleepMenuOpen, setSleepMenuOpen] = useState(false);

  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const playAfterLoad = useRef(false);
  const shuffleHistoryRef = useRef([]);

  const applySongs = useCallback((data) => {
    setSongs(data);
    setQueue(data.slice(0, 8).map((song) => song.id));
    setCurrentSongId(data[0]?.id || null);
    setApiStatus("connected");
  }, []);

  const setSongDuration = useCallback((songId, songDuration) => {
    if (!Number.isFinite(songDuration) || songDuration <= 0) return;
    setSongs((items) => items.map((song) => (
      song.id === songId ? { ...song, duration: songDuration } : song
    )));
  }, []);

  const reportSongError = useCallback((error) => {
    setApiStatus("error");
    setApiMessage(error.message);
  }, []);

  const requestSongs = useCallback(() => {
    getSongs().then(
      applySongs,
      reportSongError
    );
  }, [applySongs, reportSongError]);

  useEffect(() => {
    requestSongs();
  }, [requestSongs]);

  const loadSongs = useCallback(() => {
    setApiStatus("loading");
    setApiMessage("");
    requestSongs();
  }, [requestSongs]);

  const currentSong = songs.find((song) => song.id === currentSongId) || songs[0];
  const currentSongSrc = currentSong?.src;
  const filteredSongs = useMemo(() => {
    const text = search.toLowerCase();
    return songs
      .filter((song) => `${song.title} ${song.artist} ${song.mood}`.toLowerCase().includes(text))
      .sort((first, second) =>
        first.title.localeCompare(second.title, undefined, { numeric: true, sensitivity: "base" }) ||
        first.artist.localeCompare(second.artist, undefined, { numeric: true, sensitivity: "base" })
      );
  }, [songs, search]);

  const startAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const play = () => audio.play().then(
      () => {
        setIsPlaying(true);
        setMoodMessage("");
      },
      () => {
        setIsPlaying(false);
        setMoodMessage("Playback could not start. Press Play to try again.");
      }
    );

    Promise.resolve()
      .then(() => {
        if (!window.AudioContext) return;

        if (!audioContextRef.current) {
          const context = new window.AudioContext();
          const source = context.createMediaElementSource(audio);
          const analyser = context.createAnalyser();
          analyser.fftSize = 128;
          source.connect(analyser);
          analyser.connect(context.destination);
          audioContextRef.current = context;
          audioSourceRef.current = source;
          analyserRef.current = analyser;
        }

        if (audioContextRef.current.state === "suspended") {
          return audioContextRef.current.resume();
        }
      })
      .then(play, play);
  }, [audioRef]);

  function playSong(song) {
    if (shuffleEnabled && !shuffleHistoryRef.current.includes(song.id)) {
      shuffleHistoryRef.current = [...shuffleHistoryRef.current, song.id];
    }

    if (song.id === currentSongId) {
      startAudio();
      return;
    }

    playAfterLoad.current = true;
    setCurrentSongId(song.id);
  }

  function playNext() {
    if (shuffleEnabled) {
      const candidates = songs.length > 1
        ? songs.filter((song) => song.id !== currentSongId)
        : songs;
      if (!candidates.length) return;

      const candidateIds = new Set(candidates.map((song) => song.id));
      let played = shuffleHistoryRef.current.filter((id) => candidateIds.has(id));
      let unplayed = candidates.filter((song) => !played.includes(song.id));

      if (!unplayed.length) {
        played = currentSongId ? [currentSongId] : [];
        unplayed = candidates.filter((song) => !played.includes(song.id));
      }
      if (!unplayed.length) {
        played = [];
        unplayed = candidates;
      }

      const nextSong = unplayed[Math.floor(Math.random() * unplayed.length)];
      shuffleHistoryRef.current = [...played, nextSong.id];
      playSong(nextSong);
      return;
    }

    if (!queue.length) return;
    const index = queue.indexOf(currentSongId);
    const nextSong = songs.find((song) => song.id === queue[(index + 1) % queue.length]);
    if (nextSong) playSong(nextSong);
  }

  function playPrevious() {
    if (!queue.length) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const index = queue.indexOf(currentSongId);
    const previousIndex = index > 0 ? index - 1 : queue.length - 1;
    const previousSong = songs.find((song) => song.id === queue[previousIndex]);
    if (previousSong) playSong(previousSong);
  }

  function handleMoodDetected(mood, confidence = 0.9) {
    const value = mood.toLowerCase();
    const name = value.includes("bliss") ? "bliss"
      : value.includes("sad") ? "sad"
      : value.includes("happy") || value.includes("joy") ? "happy"
      : value.includes("anger") || value.includes("angry") ? "anger" : "";

    if (!name) return;

    setDetectedMood({ mood: name, confidence });

    const matchingSongs = songs.filter((song) => song.mood === name);
    if (!matchingSongs.length) {
      setMoodMessage(`No ${name} songs are available in your library.`);
      setMoodHistory((items) => [
        {
          id: Date.now(),
          key: name,
          confidence,
          at: new Date().toLocaleString(),
          song: "No matching song",
        },
        ...items,
      ]);
      return;
    }

    const randomized = [...matchingSongs];
    for (let index = randomized.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [randomized[index], randomized[randomIndex]] = [randomized[randomIndex], randomized[index]];
    }
    if (randomized.length > 1 && randomized[0].id === currentSongId) {
      [randomized[0], randomized[1]] = [randomized[1], randomized[0]];
    }

    const matchingIds = new Set(matchingSongs.map((song) => song.id));
    setQueue((items) => [
      ...randomized.map((song) => song.id),
      ...items.filter((id) => !matchingIds.has(id)),
    ]);
    setMoodMessage("");
    setMoodHistory((items) => [
      {
        id: Date.now(),
        key: name,
        confidence,
        at: new Date().toLocaleString(),
        song: randomized[0].title,
      },
      ...items,
    ]);
    playSong(randomized[0]);
  }

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      startAudio();
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function seek(value) {
    if (!audioRef.current) return;
    const time = Number(value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  function startSleepTimer() {
    setSleepRemaining(sleepMinutes * 60);
    setSleepMenuOpen(false);
  }

  function toggleShuffle() {
    const nextEnabled = !shuffleEnabled;
    shuffleHistoryRef.current = nextEnabled && currentSongId ? [currentSongId] : [];
    setShuffleEnabled(nextEnabled);
  }

  function logoutUser() {
    setLogoutError("");
    handleLogout().then(
      () => navigate("/login"),
      (error) => setLogoutError(
        error.response?.data?.message || error.message || "Unable to log out."
      )
    );
  }

  function handleTimeUpdate() {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  }

  function handleLoadedMetadata() {
    if (audioRef.current) setDuration(audioRef.current.duration);
  }

  function handleAudioPlay() {
    setIsPlaying(true);
  }

  function handleAudioPause() {
    setIsPlaying(false);
  }

  function handleSongEnded() {
    setIsPlaying(false);
    playNext();
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSongSrc || !audio) return;

    audio.src = currentSongSrc;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (playAfterLoad.current) {
      startAudio();
      playAfterLoad.current = false;
    }
  }, [audioRef, currentSongId, currentSongSrc, startAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.playbackRate = playbackRate;
  }, [audioRef, volume, playbackRate]);

  useEffect(() => {
    if (!sleepRemaining) return undefined;

    const timer = setTimeout(() => {
      if (sleepRemaining === 1) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
      setSleepRemaining(sleepRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [audioRef, sleepRemaining]);

  return {
    songs,
    filteredSongs,
    apiStatus,
    apiMessage,
    loadSongs,
    theme,
    toggleTheme,
    user,
    logoutUser,
    logoutError,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    currentSong,
    setSongDuration,
    queue,
    setQueue,
    shuffleEnabled,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
    detectedMood,
    moodMessage,
    moodHistory,
    showHistory,
    setShowHistory,
    sleepMinutes,
    setSleepMinutes,
    sleepRemaining,
    sleepMenuOpen,
    setSleepMenuOpen,
    audioRef,
    analyserRef,
    playSong,
    playNext,
    playPrevious,
    toggleShuffle,
    handleMoodDetected,
    togglePlayback,
    seek,
    startSleepTimer,
    clearSleepTimer: () => setSleepRemaining(0),
    toggleSleepMenu: () => setSleepMenuOpen((open) => !open),
    closeHistory: () => setShowHistory(false),
    openHistory: () => setShowHistory(true),
    handleTimeUpdate,
    handleLoadedMetadata,
    handleAudioPlay,
    handleAudioPause,
    handleSongEnded,
  };
}
