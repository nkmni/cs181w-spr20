
var yt_watch_pattern = /:\/\/.*\.youtube\.com\/watch/i;
var injected = false;

function inject_vexer(changes, namespace) {
    if (injected) return;
    if ("seconds_left" in changes && namespace == "sync") {
        var time_remaining = changes.seconds_left.newValue;
        chrome.storage.sync.get('paused', function(items) {
            if (time_remaining < 0 &&
                yt_watch_pattern.test(window.location.href) &&
                !items.paused) {
                
                var s = document.createElement('script');
                s.src = chrome.extension.getURL('vexer.js');
                s.onload = function() { this.remove(); };
                (document.head||document.documentElement).appendChild(s);
                injected = true;
            }
        });
    }
}

function refresh_needed(changes, namespace) {
    if ("refresh_needed" in changes && namespace == "sync")
        location.reload(true);
}

chrome.storage.onChanged.addListener(inject_vexer);
chrome.storage.onChanged.addListener(refresh_needed);
