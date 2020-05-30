//var player = document.getElementById("movie_player");
// Saves options to chrome.storage
function save_options() {
  var timer_duration = document.getElementById('timer_duration').value;
  var annoy_level = document.getElementById('annoy_level').value;
  var random_speed = document.getElementById('random_speed').checked;
  var random_mute = document.getElementById('random_mute').checked;
  chrome.storage.sync.set({
    'timer_duration': timer_duration,
    'annoy_level': annoy_level,
    'random_speed': random_speed,
    'random_mute': random_mute
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value annoy_level = 'medium' and random_speed = true.
  chrome.storage.sync.get({
    'timer_duration': 30,
    'annoy_level': 'medium',
    'random_speed': true,
    'random_mute': false,
    'paused': false
  }, function(items) {
    document.getElementById('timer_duration').value = items.timer_duration;
    document.getElementById('annoy_level').value = items.annoy_level;
    document.getElementById('random_speed').checked = items.random_speed;
    document.getElementById('random_mute').checked = items.random_mute;
    document.getElementById('pause').textContent = items.paused ? 'Resume vexYT' : 'Pause vexYT';
  });
}

function pause_clicked() {
    chrome.storage.sync.get({'paused': false}, function(items) {
      var new_paused = !items.paused;
      chrome.storage.sync.set({'paused': new_paused});
      document.getElementById('pause').textContent = new_paused ? 'Resume vexYT' : 'Pause vexYT';
    });
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('pause').addEventListener('click', pause_clicked);



