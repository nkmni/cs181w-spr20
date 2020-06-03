
var player = document.getElementById("movie_player");
var duration = player.getDuration();

function annoy() {
    randomSeekTime = Math.floor(Math.random() * duration);
    player.seekTo(randomSeekTime);
    window.scrollBy({
        top: Math.floor(Math.random()*2*window.innerHeight-window.innerHeight),
        left: 0,
        behavior: 'smooth'
    });
}

setInterval(annoy, 1000);

/*
var player = document.getElementById("movie_player");
player.click();
player.mute();
player.pauseVideo();
player.setPlaybackRate(2);
player.seekTo(360);
player.toggleFullscreen(); // sometimes doesn't work to prevent non-user initiated full-screen
player.unMute();
player.setVolume(25);
player.playVideo();
*/