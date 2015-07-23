// Saves options to chrome.storage
function save_options() {
  console.log("in save options");		
  var likesLimit = document.getElementById("like-limit").value;  
  chrome.storage.local.set({"likesLimit": likesLimit}, function() {	
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.innerText = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}


// Restores the preferences
// stored in chrome.storage.
function restore_options() {  
  chrome.storage.local.get({"likesLimit": 10}, function(items) {
    document.getElementById('like-limit').value = items["likesLimit"];    
  });
}

var el = document.getElementById('save'); 
el.addEventListener('click', save_options);
document.addEventListener('DOMContentLoaded', restore_options);

