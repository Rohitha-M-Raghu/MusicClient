import Song from "./songs.js";
class Playlist {
  constructor(playlistId, playlistName, imgUrl, songCount) {
    this.playlistId = playlistId;
    this.playlistName = playlistName;
    this.imgUrl = imgUrl;
    this.songCount = songCount;
  }
}

const playlistListingData = [
  {
    playlistId: 5,
    playlistName: "Playlist1",
    imgUrl: "images/liked-playlist.png",
    songCount: 6,
  },
  {
    playlistId: 16,
    playlistName: "My Playlist#1",
    imgUrl: "images/liked-playlist.png",
    songCount: 10,
  },
].map(
  (playlist) =>
    new Playlist(
      playlist.playlistId,
      playlist.playlistName,
      playlist.imgUrl,
      playlist.songCount
    )
);

renderPlaylistListing(playlistListingData);

//
// List Playlists at left panel
//
function renderPlaylistListing(playlistListingData) {
  const playlistListContainer = document.querySelector(".playlist-listing");
  let htmlContent = `
    <button class="playlist-container js-playlist-container">
      <div class="playlist-cover js-playlist-cover">
          <img src="images/liked-playlist.png" width="40px">
      </div>
      <div class="playlist-details">
          <div class="playlist-name">
              Liked Playlist
          </div>
          <div class="playlist-song-details">
              Playlist &#183; ${getLikedSongCount()} songs
          </div>
      </div>
  </button>
  `;
  playlistListingData.forEach((playlistData) => {
    htmlContent += `
    <button class="playlist-container js-playlist-container" data-playlist-id="${playlistData.playlistId}">
        <div class="playlist-cover js-playlist-cover">
            <img src="${playlistData.imgUrl}" width="40px" class="js-playlist-cover">
        </div>
        <div class="playlist-details">
            <div class="playlist-name">
                ${playlistData.playlistName}
            </div>
            <div class="playlist-song-details">
                Playlist &#183; ${playlistData.songCount} songs
            </div>
        </div>
    </button>
    `;
  });

  playlistListContainer.innerHTML = htmlContent;

  // add event listeners to each playlist button
  document.querySelectorAll(".playlist-container").forEach((button) => {
    const playlistCoverElement = button.querySelector(".js-playlist-cover");
    const originalImg = playlistCoverElement.innerHTML;

    button.addEventListener("mouseover", () => {
      playlistCoverElement.innerHTML = `<i class="fa-sharp fa-solid fa-play"></i>`;
    });

    button.addEventListener("mouseout", () => {
      playlistCoverElement.innerHTML = originalImg;
    });

    button.addEventListener("click", () => {
      const playlistName = button.querySelector(".playlist-name").innerText;
      renderPlaylistHeading(playlistName);
      if (playlistName === "Liked Playlist") {
        // call method to render liked songs
        renderLikedSongs();
      } else {
        const playlistId = button.dataset.playlistId;
        renderPlaylistSongs(playlistId);
      }
    });
  });
}

//
// add new Playlist page render
//
const playlistAddElement = document.querySelector(".playlists-add");
playlistAddElement.addEventListener("click", () => {
  const headerElement = document.querySelector(".title");
  headerElement.innerHTML = `
    <i class="fa-solid fa-folder"></i>
    <input type="text" value="${generatePlaylistName()}" min-length="3" maxlength="20" class="js-newplaylist-input">
  `;

  // to get new playlist name after enter
  const playlistInputElement = document.querySelector(".js-newplaylist-input");
  document.body.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (playlistInputElement.value === "") {
        playlistInputElement.value = generatePlaylistName();
      }
      // call api to add playlist
      const requestBody = {
        playlistName: playlistInputElement.value,
      };
      fetch(`http://localhost:8888/MusicPlayer/api/v1/playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Stringify the request body
      })
        .then((response) => {
          if (response.status === 204) {
            console.log(requestBody.playlistName + " created");
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  });

  // remove the body content
  const mainContentElement = document.querySelector(".js-main-panel-body");
  mainContentElement.innerHTML = "";
});

function generatePlaylistName() {
  let index = 1;
  while (true) {
    if (
      !playlistListingData.some(
        (playlistData) => playlistData.playlistName === `My Playlist#${index}`
      )
    ) {
      return `My Playlist#${index}`;
    }
    index++;
  }
}

// code to render playlistHeading
function renderPlaylistHeading(playlistName) {
  const headerElement = document.querySelector(".main-panel-header");

  headerElement.innerHTML = `
  <div class="title">
    <i class="fa-solid fa-folder"></i>
    <input type="text" value="${playlistName}" min-length="3" maxlength="20" class="js-newplaylist-input">
  </div>
  `;
  //
  // API to rename playlist on Enter
  //
  const playlistInputElement = document.querySelector(".js-newplaylist-input");
  document.body.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (playlistInputElement.value === "") {
        playlistInputElement.value = generatePlaylistName();
      }
      // call api to rename playlist -- needs editing
      const requestBody = {
        playlistName: playlistInputElement.value,
      };
      fetch(`http://localhost:8888/MusicPlayer/api/v1/playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Stringify the request body
      })
        .then((response) => {
          if (response.status === 204) {
            console.log(requestBody.playlistName + " created");
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  });
}

// code to render playlistSongs
function renderPlaylistSongs(playlistId) {
  // get songs from playlistId using api

  fetch(
    `http://localhost:8888/MusicPlayer/api/v1/playlists/${playlistId}/songs`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 204) {
        // SHow no content
        displayNoSongsInMain();
      } else {
        throw new Error("Network response was not ok");
      }
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
      renderSongListInMain(songs);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Function to get liked Songs
function getLikedSongCount() {
  const responseBody = {
    data: [
      {
        duration: "00:04:43",
        songTitle: "Diamonds",
        songDurationInSecs: 283000,
        artist: {
          country: "Barbados",
          genre: "Pop",
          description:
            'A Barbadian singer and businesswoman known for hits like "Umbrella" and "Diamonds."',
          artistName: "Rihanna",
          artistId: 1,
        },
        count: 0,
        genre: "Pop",
        songId: 1,
        order: 0,
      },
      {
        duration: "00:00:10",
        songTitle: "Wagon Wheel",
        songDurationInSecs: 10000,
        artist: {
          country: "USA",
          genre: "Country",
          description:
            "Darius Rucker is a versatile country artist with a distinctive voice and a wide following.",
          artistName: "Darius Rucker",
          artistId: 5,
        },
        count: 0,
        genre: "Country",
        songId: 5,
        order: 0,
      },
      {
        duration: "00:00:20",
        songTitle: "Shape of You'",
        songDurationInSecs: 20000,
        artist: {
          country: "UK",
          genre: "Pop",
          description:
            "Ed Sheeran is a popular pop artist known for his heartfelt lyrics and acoustic melodies.",
          artistName: "Ed Sheeran",
          artistId: 9,
        },
        count: 0,
        genre: "Pop",
        songId: 9,
        order: 0,
      },
      {
        duration: "00:00:20",
        songTitle: "All of the Lights",
        songDurationInSecs: 20000,
        artist: {
          country: "USA",
          genre: "Pop",
          description:
            'An American rapper and producer acclaimed for his innovative music and albums like "The College Dropout."',
          artistName: "Kanye West",
          artistId: 11,
        },
        count: 0,
        genre: "Pop",
        songId: 11,
        order: 0,
      },
    ],
  };
  const count = responseBody.data.length;
  return count;
}

// code to render playlistSongs
function renderLikedSongs() {
  // get songs from playlistId using api

  fetch(`http://localhost:8888/MusicPlayer/api/v1/liked-songs`, {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 204) {
        // SHow no content
        const mainContentElement = document.querySelector(
          ".js-main-panel-body"
        );
        mainContentElement.innerHTML = `<div class="no-song-msg">No Songs In Playlist</div>`;
      } else {
        throw new Error("Network response was not ok");
      }
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
      renderSongListInMain(songs);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function renderSongListInMain(songs) {
  if (!songs) {
    displayNoSongsInMain();
    return;
  }

  let songDetailsHTML = `
    <button class="play-btn">
        <i class="fa-solid fa-play"></i>
    </button>
    <div class="song-list-heading">
        <div class="song-count">#</div>
        <div>Title</div>
        <div>Artist</div>
        <div>
            <i class="fa-regular fa-clock"></i>
        </div>
    </div>
    <div class="song-list">";
  `;
  songs.forEach((songDetails, index) => {
    songDetailsHTML += `
    <button class="song-details">
        <div class="song-number">${index + 1}</div>
        <div class="song-data">
            <img src="${songDetails.coverUrl}" width="40px">
            <div class="song-name">${songDetails.songTitle}</div>
        </div>
        <div class="artist-name">${songDetails.artistName}</div>
        <div class="duration">${songDetails.formatDuration()}</div>
    </button>
    `;
  });

  songDetailsHTML += "</div>";
  const songDetailsRender = document.querySelector(".js-main-panel-body");
  songDetailsRender.innerHTML = songDetailsHTML;
}

function displayNoSongsInMain() {
  const mainContentElement = document.querySelector(".js-main-panel-body");
  mainContentElement.innerHTML = `<div class="no-song-msg">No Songs In Playlist</div>`;
}
