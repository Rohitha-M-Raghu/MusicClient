import musicPlayerControls from "./music-panel.js";
import Song from "./songs.js";

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

  const masterPlayBtnElement = document.querySelector(".play-btn");
  masterPlayBtnElement.addEventListener("click", () => {
    const url = masterPlayBtnElement.dataset.playUrl;
    fetch(url, { method: "POST" })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((responseData) => {
        const {
          songId,
          songTitle,
          artist: { artistName },
          duration,
          imageUrl,
          songUrl,
        } = responseData;

        console.log(
          `songId: ${songId} songTitle: ${songTitle} artistName: ${artistName} duration: ${duration} imageUrl: ${imageUrl} songUrl: ${songUrl}`
        );

        const songData = new Song(
          songId,
          songTitle,
          artistName,
          duration,
          songUrl,
          imageUrl
        );
        console.log(songData);
        musicPlayerControls.loadSong(songData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  });
});
