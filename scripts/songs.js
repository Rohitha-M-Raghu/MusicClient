import musicPlayerControls from "./music-panel.js";

class Song {
  constructor(
    songId = null,
    songTitle,
    artistName,
    duration,
    songUrl = "",
    coverUrl = ""
  ) {
    this.songId = songId;
    this.songTitle = songTitle;
    this.artistName = artistName;
    this.duration = duration;
    this.songUrl = songUrl;
    this.coverUrl = coverUrl;
  }

  formatDuration() {
    let [hours, minutes, seconds] = this.duration.split(":").map(Number);
    if (hours === 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  }

  loadSongDetailsIntoMusicPlayer() {
    const imageElement = document.querySelector(".js-music-cover");
    const songTitleElement = document.querySelector(".song-title");
    const artistElement = document.querySelector(".artist");
    const durationElement = document.querySelector("#duration");

    console.log(typeof durationElement);
    console.log(typeof this.duration);
    imageElement.src = this.coverUrl;
    songTitleElement.innerText = this.songTitle;
    artistElement.innerText = this.artistName;
    durationElement.innerText = this.duration;
  }
}

const songDetails = [
  {
    songId: 1,
    songTitle: "Diamonds",
    artistName: "Rihanna",
    duration: "00:04:43",
    songUrl: "songs/Diamonds.mp3",
    coverUrl: "images/album-cover.jpg",
  },
  {
    songId: 2,
    songTitle: "Zombie",
    artistName: "Miley Cyrus",
    duration: "00:00:20",
    songUrl: "songs/Zombie.mp3",
    coverUrl: "images/album-cover.jpg",
  },
  {
    songId: 2,
    songTitle: "Zombie",
    artistName: "Miley Cyrus",
    duration: "00:00:20",
    songUrl: "songs/Zombie.mp3",
    coverUrl: "images/album-cover.jpg",
  },
  {
    songId: 2,
    songTitle: "Zombie",
    artistName: "Miley Cyrus",
    duration: "00:00:20",
    songUrl: "songs/Zombie.mp3",
    coverUrl: "images/album-cover.jpg",
  },
  {
    songId: 2,
    songTitle: "Zombie",
    artistName: "Miley Cyrus",
    duration: "00:00:20",
    songUrl: "songs/Zombie.mp3",
    coverUrl: "images/album-cover.jpg",
  },
  {
    songId: 2,
    songTitle: "Zombie",
    artistName: "Miley Cyrus",
    duration: "00:00:20",
    songUrl: "songs/Zombie.mp3",
    coverUrl: "images/album-cover.jpg",
  },
].map(
  (song) =>
    new Song(
      song.songId,
      song.songTitle,
      song.artistName,
      song.duration,
      song.songUrl,
      song.coverUrl
    )
);

window.onload = () => {
  fetch("http://localhost:8888/MusicPlayer/api/v1/songs?include=songUrl")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((responseData) => {
      const songs = responseData.data.map(
        (song) =>
          new Song(
            song.songId,
            song.songTitle,
            song.artist.artistName,
            song.duration,
            song.songUrl,
            song.imageUrl,
            song.songUrl
          )
      );
      console.log(songs);
      renderSongDetails(songs);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
};

// console.log(songDetails);
// renderSongDetails(songDetails);

function renderSongDetails(songDetails) {
  const songListElement = document.querySelector(".song-list");
  let htmlContent = "";
  songDetails.forEach((songData) => {
    htmlContent += `
    <button class="song-details" data-song-url="${
      songData.songUrl
    }" data-song-id="${songData.songId}">
    <div class="song-number">${songData.songId}</div>
    <div class="song-data">
        <img src="${songData.coverUrl}" width="40px">
        <div class="song-name">${songData.songTitle}</div>
    </div>
        <div class="artist-name">${songData.artistName}</div>
        <div class="duration">${songData.formatDuration()}</div>
    </button>
    `;
  });

  songListElement.innerHTML = htmlContent;

  // to add event listeners to song-list buttons
  document.querySelectorAll(".song-details").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.dataset.songId;

      fetch(`http://localhost:8888/MusicPlayer/api/v1/songs/${songId}/play`, {
        method: "POST",
      })
        .then((response) => {
          if (response.status === 204) {
            const songTitle = button.querySelector(".song-name").innerText;
            const artistName = button.querySelector(".artist-name").innerText;
            const duration = button.querySelector(".duration").innerText;
            const imageUrl = button.querySelector("img").src;
            const songUrl = button.dataset.songUrl;

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
            musicPlayerControls.loadSong(songData);
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });

    // mouse over effect fot each song list button
    document.querySelectorAll(".song-details").forEach((button, index) => {
      const songNumberElement = button.querySelector(".song-number");
      button.addEventListener("mouseover", () => {
        songNumberElement.innerHTML = `<i class="fa-sharp fa-solid fa-play"></i>`;
      });

      button.addEventListener("mouseout", () => {
        songNumberElement.innerHTML = index + 1;
      });
    });
  });
}
export default Song;
