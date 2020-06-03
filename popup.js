

function format_time(seconds_left) {
    negate = seconds_left < 0;
    if (negate)
        seconds_left *= -1;
    hours = (seconds_left / 3600) >> 0;
    minutes = ((seconds_left - 3600*hours) / 60) >> 0;
    seconds = seconds_left % 60;
    hours = hours ? hours + ":" : "";
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    time_string = hours + minutes + ":" + seconds;
    if (negate) 
        time_string = '-' + time_string;
    return time_string;
}

//var player = document.getElementById("movie_player");
// Saves options to chrome.storage
function save_options() {
  var timer_duration = document.getElementById('timer_duration').value;
  var invalid_duration = (timer_duration < 0) || (timer_duration > 120);
  timer_duration = timer_duration > 120 ? 120 : timer_duration;
  timer_duration = timer_duration < 0 ? 0 : timer_duration;
  var annoy_level = document.getElementById('annoy_level').value;
  var random_speed = document.getElementById('random_speed').checked;
  var random_mute = document.getElementById('random_mute').checked;
  chrome.storage.sync.get({'session_started': false}, function(items) {
    if (!items.session_started)
        chrome.storage.sync.set({'seconds_left': 60*timer_duration});
  });
  chrome.storage.sync.set({
    'timer_duration': timer_duration,
    'annoy_level': annoy_level,
    'random_speed': random_speed,
    'random_mute': random_mute
  }, function() {
    document.getElementById("countdown").textContent = format_time(60*timer_duration);
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved';
    if (invalid_duration)
        status.textContent += ' (0 < timer < 120)';
    setTimeout(function() { status.textContent = ''; }, 4000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function load_popup() {
  // Use default value annoy_level = 'medium' and random_speed = true.
  chrome.storage.sync.get([
    'timer_duration',
    'annoy_level',
    'random_speed',
    'random_mute',
    'paused',
    'seconds_left'
  ], function(items) {
    document.getElementById('timer_duration').value = items.timer_duration;
    document.getElementById('annoy_level').value = items.annoy_level;
    document.getElementById('random_speed').checked = items.random_speed;
    document.getElementById('random_mute').checked = items.random_mute;
    document.getElementById('pause').textContent = items.paused ? 'Resume' : 'Pause';
    document.getElementById('countdown').textContent = format_time(items.seconds_left);
  });
}

function pause_clicked() {
    chrome.storage.sync.get(['paused', 'refresh_needed'], function(items) {
      var new_paused = !items.paused;
      chrome.storage.sync.set({'paused': new_paused});
      document.getElementById('pause').textContent = new_paused ? 'Resume' : 'Pause';
      chrome.storage.sync.set({'refresh_needed': items.refresh_needed+1});
    });
}


function reset_clicked() {
    chrome.storage.sync.get(['timer_duration', 'refresh_needed'], function(items) {
      chrome.storage.sync.set({
        'session_started': false,
        'seconds_left': 60*items.timer_duration,
        'refresh_needed': items.refresh_needed+1
      });
    });
}


function update_countdown(changes, namespace) {
    if ("seconds_left" in changes && namespace == "sync") {
        var seconds_left = changes.seconds_left.newValue;
        countdown = document.getElementById("countdown");
        countdown.textContent = format_time(seconds_left);
        if (seconds_left < 0) {
            if (seconds_left % 2)
                countdown.style.color = "red";
            else
                countdown.style.color = "yellow";
        }
    }
}

document.addEventListener('DOMContentLoaded', load_popup);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('pause').addEventListener('click', pause_clicked);
document.getElementById('reset').addEventListener('click', reset_clicked);
chrome.storage.onChanged.addListener(update_countdown);



