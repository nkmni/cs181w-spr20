var player = document.getElementById("movie_player");
//player.click()
//player.mute()
player.pauseVideo()
player.setPlaybackRate(1.5)
player.seekTo(80)
player.toggleFullscreen()//sometimes doesn't work to prevent non-user initiated fullscreen
player.seekTo(40)
player.unMute()
player.setVolume(25)

//player.click()
//player.unMute()
player.playVideo()
player.setPlaybackRate(1.5)
player.seekTo(80)
player.seekTo(40)
player.unMute()
player.setVolume(25)

function random_playback_speed(document) {
	//var player = document.getElementById("movie_player");
	player.setPlaybackRate(.75)//not actually random, will be set to a random value after this is properly implemented
}