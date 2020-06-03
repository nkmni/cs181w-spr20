
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        // settings
        'timer_duration': 30,
        'annoy_level': 'medium',
        'random_speed': true,
        'random_mute': false,
        'paused': false,
        
        // session vars
        'seconds_left': 60*30,
        'last_used': Date.now(),
        
        // refresh var
        'refresh_needed': 0
    });
});

function decrement_timer() {
    chrome.storage.sync.get('seconds_left', function(items) {
        chrome.storage.sync.set({
            'seconds_left': items.seconds_left-1,
            'last_used': Date.now()
        });
    });
}

var interval_id = null;
var yt_pattern = /:\/\/.*\.youtube\.com\//i;
var yt_active = false;

function update_countdown() {
    console.log("updating countdown");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        if (activeTab === undefined) return;
        console.log(activeTab.url);
        if (yt_pattern.test(activeTab.url)) {
            console.log("matched pattern!");
            if (!yt_active) {
                yt_active = true;
                interval_id = setInterval(decrement_timer, 1000);
            }
        } else {
            console.log("did not match pattern");
            if (yt_active) {
                yt_active = false;
                clearInterval(interval_id);
            }
        }
    });
}

chrome.tabs.onCreated.addListener(function(tab) { update_countdown(); });
chrome.tabs.onActivated.addListener(function(activeInfo) { update_countdown(); });
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { update_countdown(); });

