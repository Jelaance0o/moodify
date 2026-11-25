// API LAYER
// Gets songs from the Express backend and prepares the fields used by the UI.

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function formatLyrics(lyrics) {
  const lines = Array.isArray(lyrics)
    ? lyrics
    : typeof lyrics === "string" ? lyrics.split(/\r?\n/) : [];

  return lines
    .map((line) => typeof line === "string"
      ? { text: line.trim(), active: false }
      : { text: line?.text?.trim() || "", active: Boolean(line?.active) })
    .filter((line) => line.text);
}

export function getSongs() {
  return fetch(`${API_URL}/api/songs/`)
    .then((response) => {
      if (!response.ok) throw new Error(`Unable to load songs (${response.status}).`);
      return response.json();
    })
    .then((result) => {
      const songs = Array.isArray(result)
        ? result
        : result.song || result.songs || result.data || [];

      return songs.map((song) => ({
        id: song._id || song.id,
        title: song.title || "Untitled song",
        artist: song.artist || "Unknown artist",
        mood: (song.mood || "").toLowerCase(),
        src: song.url || song.src,
        cover: song.posterURL,
        duration: song.duration || "--:--",
        lyrics: formatLyrics(song.lyrics),
      }));
    });
}
