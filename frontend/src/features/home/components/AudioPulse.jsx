import { useEffect, useRef } from "react";
import "../styles/AudioPulse.scss";

const BAR_COUNT = 96;

export default function AudioPulse({ analyserRef, isPlaying }) {
  const barsRef = useRef([]);

  useEffect(() => {
    let frame;
    const frequencies = new Uint8Array(analyserRef.current?.frequencyBinCount || 64);

    function draw() {
      const analyser = analyserRef.current;

      if (!isPlaying) {
        barsRef.current.forEach((bar) => {
          if (bar) bar.style.height = "4px";
        });
        return;
      }

      let hasAudio = false;
      if (analyser) {
        analyser.getByteFrequencyData(frequencies);
        hasAudio = frequencies.some((frequency) => frequency > 0);
      }

      barsRef.current.forEach((bar, index) => {
        if (!bar) return;
        const frequency = hasAudio
          ? frequencies[Math.floor(index * frequencies.length / BAR_COUNT)] / 255
          : Math.abs(Math.sin(Date.now() / 180 + index * 0.38)) * 0.7;
        bar.style.height = `${4 + frequency * 22}px`;
      });

      frame = requestAnimationFrame(draw);
    }

    if (isPlaying) {
      draw();
    } else {
      barsRef.current.forEach((bar) => {
        if (bar) bar.style.height = "4px";
      });
    }

    return () => cancelAnimationFrame(frame);
  }, [analyserRef, isPlaying]);

  return (
    <div className="audio-pulse" aria-hidden="true">
      <div className="audio-pulse__bars">
        {Array.from({ length: BAR_COUNT }, (_, index) => (
          <i key={index} ref={(node) => { barsRef.current[index] = node; }} />
        ))}
      </div>
    </div>
  );
}
