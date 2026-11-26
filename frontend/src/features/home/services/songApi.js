import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
});

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

export async function getSongs() {
  try {
    const { data: result } = await api.get("/api/songs/");
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
      duration: song.duration ?? null,
      lyrics: formatLyrics(song.lyrics),
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && ["ECONNABORTED", "ETIMEDOUT"].includes(error.code)) {
      throw new Error("Loading songs timed out. Check your connection and try again.");
    }
    throw error;
  }
}
