

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        // settings
        'timer_duration': 30,
        'annoy_level': 'medium',
        'random_speed': true,
        'random_mute': false,
        'paused': false,
        
        // session vars
        'session_started': false,
        'seconds_left': 60*30,
        'last_visited': Date.now(),
        
        // refresh var
        'refresh_needed': 0
    });
});
