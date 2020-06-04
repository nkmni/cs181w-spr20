
var player = document.getElementById("movie_player");

function annoy_jump() {
    randomSeekTime = Math.floor(Math.random() * duration);
    player.seekTo(randomSeekTime);
}

function annoy_scroll() {
    window.scrollBy({
        top: Math.floor(Math.random()*window.innerHeight),
        left: 0,
        behavior: 'smooth'
    });
}

if (player !== null) {
    var duration = player.getDuration();
    setInterval(annoy_jump, 1000);
    //setInterval(annoy_scroll, 2000);
}

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