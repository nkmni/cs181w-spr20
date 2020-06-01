

chrome.storage.sync.get({
	'session_started': false
}, function(items) {
	if (!items.session_started) {
		chrome.storage.sync.set({
			'session_started': true,
			'start_time': 0 //get current time
		});
    }
});

var player = document.getElementById("movie_player");
//player.click();
//player.mute();
//player.pauseVideo();
player.setPlaybackRate(2);
//player.seekTo(80)
//player.toggleFullscreen(); //sometimes doesn't work to prevent non-user initiated fullscreen
//player.unMute();
//player.setVolume(25);
//player.playVideo();

/*
function random_playback_speed(document) {
	//var player = document.getElementById("movie_player");
	player.setPlaybackRate(.75)//not actually random, will be set to a random value after this is properly implemented
}
*/
