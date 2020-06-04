
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        // settings
        'timer_duration': 30,
        'inactive_duration': 0.1, //60,
        'daily_limit': 60,
        'annoy_level': 'medium',
        'random_speed': true,
        'random_mute': false,
        'paused': false,
        
        // session vars
        'seconds_left': 60*30,
        
        // refresh var
        'refresh_needed': 0
    });
});

function decrement_timer() {
    chrome.storage.sync.get(['seconds_left', 'paused'], function(items) {
        if (!items.paused) {
            chrome.storage.sync.set({
                'seconds_left': items.seconds_left-1
            });
        }
    });
}

var interval_id = null;
var timeout_id = null;
var yt_pattern = /:\/\/.*\.youtube\.com\//i;
var yt_active = false;

function end_session() {
    chrome.storage.sync.get(['timer_duration', 'refresh_needed'], function(items) {
        chrome.storage.sync.set({
            'seconds_left': 60*items.timer_duration,
            'refresh_needed': items.refresh_needed+1
        });
    });
}

function update_countdown() {
    console.log("update_countdown: start");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        if (activeTab === undefined) return;
        console.log(activeTab.url);
        if (yt_pattern.test(activeTab.url)) {
            console.log("update_countdown: pattern matched");
            if (!yt_active) {
                yt_active = true;
                interval_id = setInterval(decrement_timer, 1000);
                clearTimeout(timeout_id);
            }
        } else {
            console.log("update_countdown: pattern not matched");
            if (yt_active) {
                yt_active = false;
                clearInterval(interval_id);
                chrome.storage.sync.get('inactive_duration', function (items) {
                    timeout_id = setTimeout(end_session, 60*items.inactive_duration*1000);
                });
            }
        }
    });
}

chrome.tabs.onCreated.addListener(function(tab) { update_countdown(); });
chrome.tabs.onActivated.addListener(function(activeInfo) { update_countdown(); });
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { update_countdown(); });

