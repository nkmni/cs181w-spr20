
var injected = false;
chrome.storage.sync.set({'session_started': true});

function decrement_timer() {
    if (!document.hidden) {
        chrome.storage.sync.get('seconds_left', function(items) {
            chrome.storage.sync.set({'seconds_left': items.seconds_left-1});
        });
    }
}

function inject_vexer(changes, namespace) {
    if (injected) return;
    if ("seconds_left" in changes && namespace == "sync") {
        var time_remaining = changes.seconds_left.newValue;
        if (time_remaining < 0) {
            var s = document.createElement('script');
            s.src = chrome.extension.getURL('vexer.js');
            s.onload = function() { this.remove(); };
            (document.head||document.documentElement).appendChild(s);
            injected = true;
        }
    }
}

function refresh_needed(changes, namespace) {
    if ("refresh_needed" in changes && namespace == "sync") {
        location.reload(true);
    }
}

setInterval(decrement_timer, 1000);
chrome.storage.onChanged.addListener(refresh_needed);
chrome.storage.onChanged.addListener(inject_vexer);
