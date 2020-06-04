
var in_session = false;

function daily_reset() {
    chrome.storage.sync.get(['daily_limit', 'session_limit', 'min_interval'], function (items) {
        chrome.storage.sync.set({
            'daily_left': 60*items.daily_limit,
            'session_left': 60*items.session_limit,
            'interval_left': 60*items.min_interval
        });
    });
    in_session = false;
    var now = new Date();
    //var millis_till_midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999) - now;
    var millis_till_midnight = 2*60*1000;
    if (millis_till_midnight <= 0)
         millis_till_midnight += 24*60*60*1000; // it's after 10am, try 10am tomorrow.
    setTimeout(daily_reset, millis_till_midnight);
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        // settings
        'daily_limit': 60,
        'session_limit': 30,
        'min_interval': 0.1, //60,
        'paused': false,
        
        // session vars
        'daily_left': 60*60,
        'session_left': 60*30,
        'interval_left': 60*0.1,
        
        // refresh var
        'refresh_needed': 0
    });
    var now = new Date();
    //var millis_till_midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999) - now;
    var millis_till_midnight = 2*60*1000;
    if (millis_till_midnight <= 0)
         millis_till_midnight += 24*60*60*1000; // it's after 10am, try 10am tomorrow.
    setTimeout(daily_reset, millis_till_midnight);
});

function decrement_yt_timers() {
    chrome.storage.sync.get(['daily_left', 'session_left', 'paused'], function(items) {
        if (!items.paused) {
            chrome.storage.sync.set({
                'daily_left': items.daily_left-1,
                'session_left': items.session_left-1
            });
        }
    });
}

function decrement_interval_timer() {
    chrome.storage.sync.get(['session_limit', 'daily_left', 'session_left', 'interval_left', 'paused'], function(items) {
        if (!items.paused && in_session && items.daily_left > 0) {
            chrome.storage.sync.set({
                'interval_left': items.interval_left-1
            });
        }
    });
}

function end_session(changes, namespace) {
    if ('interval_left' in changes && namespace=='sync') {
        interval_left = changes.interval_left.newValue;
        if (interval_left < 0) {
            in_session = false;
            chrome.storage.sync.get(['session_limit', 'min_interval', 'refresh_needed'], function(items) {
                chrome.storage.sync.set({
                    'session_left': 60*items.session_limit,
                    'interval_left': 60*items.min_interval,
                    'refresh_needed': items.refresh_needed+1
                });
            });
        }
    }
}

var yt_interval_id = null;
var inactive_interval_id = null;
var yt_pattern = /:\/\/.*\.youtube\.com\//i;
var yt_active = false;

function update_countdown() {
    console.log("update_countdown: start");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        if (activeTab === undefined) return;
        console.log(activeTab.url);
        if (yt_pattern.test(activeTab.url)) {
            console.log("update_countdown: pattern matched");
            in_session = true;
            if (!yt_active) {
                yt_active = true;
                yt_interval_id = setInterval(decrement_yt_timers, 1000);
                clearInterval(inactive_interval_id);
                chrome.storage.sync.get('min_interval', function(items) {
                    chrome.storage.sync.set({'interval_left': 60*items.min_interval});
                });
            }
        } else {
            console.log("update_countdown: pattern not matched");
            if (yt_active) {
                yt_active = false;
                if (in_session)
                    inactive_interval_id = setInterval(decrement_interval_timer, 1000);
                clearInterval(yt_interval_id);
            }
        }
    });
}

chrome.tabs.onCreated.addListener(function(tab) { update_countdown(); });
chrome.tabs.onActivated.addListener(function(activeInfo) { update_countdown(); });
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { update_countdown(); });
chrome.storage.onChanged.addListener(end_session);

