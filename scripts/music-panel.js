import Song from "./songs.js";

const musicPlayerControls = {
  audio: document.getElementById("audio"),
  playPauseBtn: document.getElementById("play-pause"),
  progressBar: document.getElementById("progress"),
  currentTimeElement: document.getElementById("current-time"),
  durationElement: document.getElementById("duration"),
  volumeControl: document.getElementById("volume"),

  playPausePlayer() {
    if (this.audio.paused) {
      this.audio.play();
      this.playPauseBtn.classList.remove("fa-play-circle");
      this.playPauseBtn.classList.add("fa-pause-circle");
    } else {
      this.audio.pause();
      this.playPauseBtn.classList.remove("fa-pause-circle");
      this.playPauseBtn.classList.add("fa-play-circle");
    }
  },

  updateProgress() {
    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration;
    this.progressBar.value = (currentTime / duration) * 100;
    this.currentTimeElement.textContent = this.formatTime(currentTime);
    if (!isNaN(duration)) {
      this.durationElement.textContent = this.formatTime(duration);
    }
  },

  resetPlayer() {
    this.playPauseBtn.classList.remove("fa-pause-circle");
    this.playPauseBtn.classList.add("fa-play-circle");
    this.audio.currentTime = 0;
    this.progressBar.value = 0;
    this.currentTimeElement.textContent = this.formatTime(0);
  },

  seekAudio() {
    const duration = this.audio.duration;
    this.audio.currentTime = (this.progressBar.value / 100) * duration;
  },

  adjustVolume() {
    this.audio.volume = this.volumeControl.value / 100;
  },

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsPart = Math.floor(seconds % 60);
    return `${minutes}:${secondsPart < 10 ? "0" : ""}${secondsPart}`;
  },

  loadSong(song) {
    this.audio.src = song.songUrl;
    this.audio.load();
    this.audio.addEventListener("error", (e) => {
      console.error("Error loading audio:", e);
    });
    this.resetPlayer();
    console.log("Loaded Song:", song.songUrl);
    this.playPausePlayer();
    // loading song details
    song.loadSongDetailsIntoMusicPlayer();
  },
};

export default musicPlayerControls;
