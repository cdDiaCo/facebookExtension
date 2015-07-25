// Saves options to chrome.storage
function save_options() {
  console.log("in save options");		
  var likesLimit = document.getElementById("like-limit").value; 
  	
  if (isNaN(likesLimit) || parseInt(likesLimit) <= 0) {
	var status = document.getElementById('status');
	status.style.color = "red";
	status.innerText = 'Only numbers greater than zero allowed!';
	setTimeout(function() {
		  status.textContent = '';
	}, 2550);
  }	else { 	 
	  chrome.storage.local.set({"likesLimit": likesLimit}, function() {	
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.style.color = "black";
		status.innerText = 'Options saved.';
		setTimeout(function() {
		  status.textContent = '';
		}, 2550);
	  });
  }	
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

