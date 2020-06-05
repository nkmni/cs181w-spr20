
let MIN_SESSION_TIME = 0;
let MAX_SESSION_TIME = 60;
let MIN_DAILY_TIME = 0;
let MAX_DAILY_TIME = 120;
let MIN_INTERVAL = 60;

function format_time(seconds_left) {
    var negate = seconds_left < 0;
    if (negate) seconds_left *= -1;
    var hours = (seconds_left / 3600) | 0;
    var minutes = ((seconds_left - 3600*hours) / 60) | 0;
    var seconds = seconds_left % 60;
    hours = hours ? hours + ":" : "";
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    var time_string = hours + minutes + ":" + seconds;
    if (negate) time_string = '-' + time_string;
    return time_string;
}

function update_countdown_div(seconds_left, category) {
    var countdown;
    if (category == "daily") {
        countdown = document.getElementById("daily_countdown");
    } else if (category == "session") {
        countdown = document.getElementById("session_countdown");
    } else if (category == "interval") {
        countdown = document.getElementById("interval_countdown");
    }
    countdown.style.color = "white";
    if (category == "interval") {
        chrome.storage.sync.get('daily_left', function(items) {
            if (items.daily_left < 0) countdown.textContent = "--:--";
            else countdown.textContent = format_time(seconds_left);
        });
    } else {
        countdown.textContent = format_time(seconds_left);
        if (seconds_left < 0) {
            if (seconds_left % 2) countdown.style.color = "red";
            else countdown.style.color = "yellow";
        }
    }
}

//var player = document.getElementById("movie_player");
// Saves options to chrome.storage
function save_options() {
  var daily_elem = document.getElementById('daily_limit');
  var daily_limit = daily_elem.value;
  var invalid_daily = (daily_limit < MIN_DAILY_TIME) || (daily_limit > MAX_DAILY_TIME);
  daily_limit = daily_limit > MAX_DAILY_TIME ? MAX_DAILY_TIME : daily_limit;
  daily_limit = daily_limit < MIN_DAILY_TIME ? MIN_DAILY_TIME : daily_limit;
  
  var session_elem = document.getElementById('session_limit');
  var session_limit = session_elem.value;
  var invalid_session = (session_limit < MIN_SESSION_TIME) || (session_limit > MAX_SESSION_TIME);
  session_limit = session_limit > MAX_SESSION_TIME ? MAX_SESSION_TIME : session_limit;
  session_limit = session_limit < MIN_SESSION_TIME ? MIN_SESSION_TIME : session_limit;

  var interval_elem = document.getElementById('min_interval');
  var min_interval = interval_elem.value;
  var invalid_interval = min_interval < MIN_INTERVAL;
  min_interval = min_interval < MIN_INTERVAL ? MIN_INTERVAL : min_interval;
  
  var invalid_relative = session_limit > daily_limit;
  if (invalid_relative) session_limit = daily_limit;
  
  daily_elem.value = daily_limit;
  session_elem.value = session_limit;
  interval_elem.value = min_interval;
  
  chrome.storage.sync.set({
    'daily_limit': daily_limit,
    'session_limit': session_limit,
    'min_interval': min_interval
  });
  
  // Update status to let user know options were saved.
  var status = document.getElementById('status');
  status.style.whiteSpace = "pre";
  status.textContent = 'Options saved';
  if (invalid_daily)
    status.textContent += '\r\n(daily < 120)!';
  if (invalid_session)
    status.textContent += '\r\n(session < 60)!';
  if (invalid_interval)
    status.textContent += '\r\n(interval > 60)!';
  if (invalid_relative)
    status.textContent += '\r\n(session < daily)!';
  setTimeout(function() { status.textContent = ''; }, 4000);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function load_popup() {
  // Use default value annoy_level = 'medium' and random_speed = true.
  chrome.storage.sync.get([
    'daily_limit',
    'session_limit',
    'min_interval',
    'daily_left',
    'session_left',
    'interval_left',
    'paused'
  ], function(items) {
    document.getElementById('daily_limit').value = items.daily_limit;
    document.getElementById('session_limit').value = items.session_limit;
    document.getElementById('min_interval').value = items.min_interval;
    document.getElementById('daily_countdown').value = items.daily_left;
    document.getElementById('session_countdown').value = items.session_left;
    console.log(items.session_left);
    document.getElementById('interval_countdown').value = items.interval_left;
    document.getElementById('pause').textContent = items.paused ? 'Resume' : 'Pause';
    update_countdown_div(items.daily_left, "daily");
    update_countdown_div(items.session_left, "session");
    update_countdown_div(items.interval_left, "interval");
  });
}

function pause_clicked() {
    chrome.storage.sync.get(['paused', 'refresh_needed'], function(items) {
      var new_paused = !items.paused;
      document.getElementById('pause').textContent = new_paused ? 'Resume' : 'Pause';
      chrome.storage.sync.set({
        'paused': new_paused,
        'refresh_needed': items.refresh_needed+1
      });
    });
}


function reset_clicked() {
    chrome.storage.sync.get(['daily_limit', 'session_limit', 'min_interval', 'refresh_needed'], function(items) {
      chrome.storage.sync.set({
        'daily_left': 60*items.daily_limit,
        'session_left': 60*items.session_limit,
        'interval_left': 60*items.min_interval,
        'refresh_needed': items.refresh_needed+1
      });
    });
}

function update_countdowns(changes, namespace) {
    if (namespace == "sync") {
      if ("daily_left" in changes) {
          var daily_left = changes.daily_left.newValue;
          update_countdown_div(daily_left, "daily");
      }
      if ("session_left" in changes) {
          var session_left = changes.session_left.newValue;
          update_countdown_div(session_left, "session");
      }
      if ("interval_left" in changes) {
          var interval_left = changes.interval_left.newValue;
          update_countdown_div(interval_left, "interval");
      }
    }
}

document.addEventListener('DOMContentLoaded', load_popup);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('pause').addEventListener('click', pause_clicked);
document.getElementById('reset').addEventListener('click', reset_clicked);
chrome.storage.onChanged.addListener(update_countdowns);



