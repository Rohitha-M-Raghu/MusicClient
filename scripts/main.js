import musicPlayerControls from "./music-panel.js";

document.addEventListener("DOMContentLoaded", () => {
  // Ensure the elements are now in the DOM
  musicPlayerControls.audio = document.getElementById("audio");
  musicPlayerControls.playPauseBtn = document.getElementById("play-pause");
  musicPlayerControls.progressBar = document.getElementById("progress");
  musicPlayerControls.currentTimeElement =
    document.getElementById("current-time");
  musicPlayerControls.durationElement = document.getElementById("duration");
  musicPlayerControls.volumeControl = document.getElementById("volume");

  musicPlayerControls.playPauseBtn.addEventListener("click", () => {
    musicPlayerControls.playPausePlayer();
  });

  musicPlayerControls.audio.addEventListener("timeupdate", () => {
    musicPlayerControls.updateProgress();
  });

  musicPlayerControls.audio.addEventListener("ended", () => {
    musicPlayerControls.resetPlayer();
  });

  musicPlayerControls.progressBar.addEventListener("input", () => {
    musicPlayerControls.seekAudio();
  });

  musicPlayerControls.volumeControl.addEventListener("input", () => {
    musicPlayerControls.adjustVolume();
  });
});
