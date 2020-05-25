//var player = document.getElementById("movie_player");
// Saves options to chrome.storage
function save_options() {
  var level_of_annoyingness = document.getElementById('level_of_annoyingness').value;
  var randomSpeed = document.getElementById('random_speed').checked;
  var randomMuting = document.getElementById('random_muting').checked;
  chrome.storage.sync.set({
    level_of_annoyingness: level_of_annoyingness,
    randomSpeed: randomSpeed,
    randomMuting: randomMuting
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value level_of_annoyingness = 'medium' and randomSpeed = true.
  chrome.storage.sync.get({
    level_of_annoyingness: 'medium',
    randomSpeed: true,
    randomMuting: false
  }, function(items) {
    document.getElementById('level_of_annoyingness').value = items.level_of_annoyingness;
    document.getElementById('random_speed').checked = items.randomSpeed;
    document.getElementById('random_muting').checked = items.randomMuting;
  });
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

document.getElementById('pause').addEventListener('click',
    random_playback_speed(document));