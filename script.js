const audioPlayer = document.getElementById("audioPlayer");

const fileInput = document.getElementById("fileInput");

const playlistElement = document.getElementById("playlist");

const currentSongElement = document.getElementById("currentSong");

const statusElement = document.getElementById("status");

const playBtn = document.getElementById("playBtn");

const pauseBtn = document.getElementById("pauseBtn");

const stopBtn = document.getElementById("stopBtn");

const nextBtn = document.getElementById("nextBtn");

const previousBtn = document.getElementById("previousBtn");

const progressBar = document.getElementById("progressBar");

const volumeSlider = document.getElementById("volume");

const currentTimeElement = document.getElementById("currentTime");

const durationElement = document.getElementById("duration");


let playlist = [];

let currentIndex = -1;


// -------------------------------------
// Open Music Files
// -------------------------------------

fileInput.addEventListener("change", function () {

    const files = Array.from(this.files);

    if (files.length === 0) {
        return;
    }

    playlist = files;

    currentIndex = -1;

    displayPlaylist();

    statusElement.textContent =
        `${files.length} song${files.length > 1 ? "s" : ""} added`;

});


// -------------------------------------
// Display Playlist
// -------------------------------------

function displayPlaylist() {

    playlistElement.innerHTML = "";

    playlist.forEach((file, index) => {

        const li = document.createElement("li");

        li.textContent = file.name;

        li.addEventListener("click", function () {

            loadSong(index);

            playMusic();

        });

        playlistElement.appendChild(li);

    });

}


// -------------------------------------
// Load Song
// -------------------------------------

function loadSong(index) {

    if (index < 0 || index >= playlist.length) {
        return;
    }

    currentIndex = index;

    const file = playlist[index];

    const songURL = URL.createObjectURL(file);

    audioPlayer.src = songURL;

    currentSongElement.textContent = file.name;

    statusElement.textContent = "Ready to play";

    updateActiveSong();

}


// -------------------------------------
// Play Music
// -------------------------------------

function playMusic() {

    if (playlist.length === 0) {

        statusElement.textContent =
            "Please select a music file first";

        return;

    }

    if (currentIndex === -1) {

        loadSong(0);

    }

    audioPlayer.play();

    statusElement.textContent = "Playing";

    playBtn.textContent = "⏸";

}


// -------------------------------------
// Pause / Resume
// -------------------------------------

pauseBtn.addEventListener("click", function () {

    if (audioPlayer.paused) {

        if (currentIndex === -1) {
            playMusic();
        } else {
            audioPlayer.play();

            statusElement.textContent = "Playing";
        }

    } else {

        audioPlayer.pause();

        statusElement.textContent = "Paused";
    }

});


// -------------------------------------
// Play Button
// -------------------------------------

playBtn.addEventListener("click", function () {

    if (audioPlayer.paused) {

        playMusic();

    } else {

        audioPlayer.pause();

        statusElement.textContent = "Paused";

    }

});


// -------------------------------------
// Stop
// -------------------------------------

stopBtn.addEventListener("click", function () {

    audioPlayer.pause();

    audioPlayer.currentTime = 0;

    statusElement.textContent = "Stopped";

});


// -------------------------------------
// Next Song
// -------------------------------------

nextBtn.addEventListener("click", function () {

    if (playlist.length === 0) {
        return;
    }

    if (currentIndex === -1) {

        currentIndex = 0;

    } else {

        currentIndex =
            (currentIndex + 1) % playlist.length;

    }

    loadSong(currentIndex);

    playMusic();

});


// -------------------------------------
// Previous Song
// -------------------------------------

previousBtn.addEventListener("click", function () {

    if (playlist.length === 0) {
        return;
    }

    if (currentIndex === -1) {

        currentIndex = 0;

    } else {

        currentIndex =
            (currentIndex - 1 + playlist.length)
            % playlist.length;

    }

    loadSong(currentIndex);

    playMusic();

});


// -------------------------------------
// Update Active Song
// -------------------------------------

function updateActiveSong() {

    const songs =
        playlistElement.querySelectorAll("li");

    songs.forEach((song, index) => {

        song.classList.toggle(
            "active",
            index === currentIndex
        );

    });

}


// -------------------------------------
// Volume
// -------------------------------------

volumeSlider.addEventListener("input", function () {

    audioPlayer.volume = this.value;

});


// -------------------------------------
// Progress Bar
// -------------------------------------

audioPlayer.addEventListener("timeupdate", function () {

    if (!audioPlayer.duration) {
        return;
    }

    const progress =
        (audioPlayer.currentTime /
        audioPlayer.duration) * 100;

    progressBar.value = progress;

    currentTimeElement.textContent =
        formatTime(audioPlayer.currentTime);

    durationElement.textContent =
        formatTime(audioPlayer.duration);

});


// -------------------------------------
// Seek
// -------------------------------------

progressBar.addEventListener("input", function () {

    if (!audioPlayer.duration) {
        return;
    }

    audioPlayer.currentTime =
        (this.value / 100) *
        audioPlayer.duration;

});


// -------------------------------------
// Automatically Play Next Song
// -------------------------------------

audioPlayer.addEventListener("ended", function () {

    if (playlist.length === 0) {
        return;
    }

    currentIndex =
        (currentIndex + 1) % playlist.length;

    loadSong(currentIndex);

    playMusic();

});


// -------------------------------------
// Format Time
// -------------------------------------

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;

}


// -------------------------------------
// Audio Events
// -------------------------------------

audioPlayer.addEventListener("play", function () {

    statusElement.textContent = "Playing";

});

audioPlayer.addEventListener("pause", function () {

    if (audioPlayer.currentTime > 0 &&
        audioPlayer.currentTime < audioPlayer.duration) {

        statusElement.textContent = "Paused";

    }

});