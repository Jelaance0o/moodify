import { useState } from "react";
import { uploadSong } from "../services/Upload.api";

const useUploadMusic = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [mood, setMood] = useState("");
  const [lyrics, setLyrics] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAudioChange = (file) => {
    setError("");
    setSuccess("");

    if (!file) return;

    const isMP3 =
      file.type === "audio/mpeg" || file.name.toLowerCase().endsWith(".mp3");

    if (!isMP3) {
      setAudioFile(null);
      setError("Please select a valid MP3 file.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setAudioFile(null);
      setError("MP3 file must be 20 MB or smaller.");
      return;
    }

    setAudioFile(file);
  };

  const handleMoodChange = (value) => {
    setMood(value);
    setError("");
    setSuccess("");
  };

  const handleLyricsChange = (value) => {
    setLyrics(value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!audioFile || !mood) {
      setError("Please select an MP3 file and a mood.");
      return;
    }

    const formData = new FormData();

    formData.append("song", audioFile);
    formData.append("mood", mood);
    formData.append("lyrics", lyrics);

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await uploadSong(formData);

      setSuccess(data.message || "Song uploaded successfully!");

      setAudioFile(null);
      setMood("");
      setLyrics("");

      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to upload song.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};

export default useUploadMusic;
