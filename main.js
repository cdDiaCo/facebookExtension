
console.log("in main............");

var today = getCurrentDate();
var likesLimit = 3;
var numOfLikesRetrieved;
var timeSpentRetrieved;
var newTime;
var totalSecondsRetrieved = 0;
var key = today + "";

chrome.storage.local.get(key, function(result){	
	retrievedContent = result[key];
	console.log(result[key]);
	
	numOfLikesRetrieved = (typeof retrievedContent.likesGiven === 'undefined') ? 0 : retrievedContent.likesGiven ;
	timeSpentRetrieved = (typeof retrievedContent.timeSpent === 'undefined') ? 0 : retrievedContent.timeSpent;
	// if there is a valid timeSpentRetrieved start the timer from this value 
	if(timeSpentRetrieved) {
		totalSecondsRetrieved = stringToSeconds(timeSpentRetrieved);
	}

	if(numOfLikesRetrieved === likesLimit) {
		chrome.runtime.sendMessage({message: "stopLikeRequest"}, function(response) {
  			//console.log(response.requestBlocked);
		});	
	}		
});

document.addEventListener('DOMContentLoaded', function () {  
	// overlay the div that shows the likes given by user, the time spent
	var div = document.createElement("div");
	div.className = "box_stats"; 

	var likesGiven = document.createElement("span");
	var likesGivenValue = document.createElement("span");
	likesGivenValue.id = "lg_value";
    likesGivenValue.innerHTML = numOfLikesRetrieved;
	var likesText = document.createTextNode(" Likes given: ");

	var timeSpent = document.createElement("span");
	var timeSpentValue = document.createElement("span");
	timeSpentValue.id = "ts_value";
	timeSpentValue.innerHTML = timeSpentRetrieved;
	var timeText = document.createTextNode("Time spent: ");

	var br = document.createElement("br");

	timeSpent.appendChild(timeText);
	timeSpent.appendChild(timeSpentValue);
	div.appendChild(timeSpent);

	div.appendChild(br);

	likesGiven.appendChild(likesText);
	likesGiven.appendChild(likesGivenValue);
	div.appendChild(likesGiven);	
	document.body.appendChild(div);		

	startTimer();
	window.addEventListener('scroll', onScrollHandler);	
});


function onScrollHandler() {
	// everytime the user scrolls the page, take all the like btns available at that point ( class "UFILikeLink" )	
    //var elements = document.getElementsByClassName("_5jmm _5pat _3lb4 _x72 _50nb");
	var likeBtns = document.getElementsByClassName('UFILikeLink');	

	// iterate the like btns available and attach them the onclik event listener			
	for(var i=0; i<likeBtns.length; i++) {
		var likeClass = likeBtns[i].className;

		// check if this like btn already has the onclick event listener attached
		if( likeClass.indexOf("hasOnClickListener") > -1) { 
			// this like btn already has the onclick event listener
			// so skip to the next one
			continue; 
		}				
			
		likeBtns[i].addEventListener('click', likeClickHandler );	
		likeBtns[i].className = likeClass + " hasOnClickListener"; // mark like btn by adding a new class to it
	} 		
}


function likeClickHandler() {		
	numOfLikesRetrieved += 1;

	// check if likesLimit is reached
	// if this is the case notify the user and stop any other possible likes 				 
	if (numOfLikesRetrieved > likesLimit) {			
		chrome.runtime.sendMessage({message: "stopLikeRequest"}, function(response) {
	  		console.log(response.requestBlocked);
		});	
	} else { 
		if (numOfLikesRetrieved === likesLimit) { 
			alert("you reached the likes limit for today"); 				
		}			
		//chrome.storage.local.set({'likesGiven': numOfLikes, 'likesGivenDate': today});
		var key = today + "";
		var obj = {};
		obj[key] = {'likesGiven': numOfLikesRetrieved, 'timeSpent': newTime};
		chrome.storage.local.set(obj);	    
		document.getElementById('lg_value').innerHTML = numOfLikesRetrieved; // update the likes given UI
	}
}


function getCurrentDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	//today = mm+'/'+dd+'/'+yyyy;
	today = yyyy + '-' + mm + '-' + dd;
	return today;
}


function startTimer() {
	var seconds = totalSecondsRetrieved ? totalSecondsRetrieved : 0;
	var id = setInterval(addSecond, 1000);

	function addSecond() {		
		seconds++;
		var secs = seconds;	
		hours = Math.floor(secs/3600);	
		secs %= 3600;
		minutes = Math.floor(secs/60);
		secs %= 60;
		newTime = ( hours < 10 ? "0" : "" ) + hours + ":" 
					+ ( minutes < 10 ? "0" : "" ) + minutes + ":" 
					+ (secs < 10 ? "0" : "") + secs;	

		document.getElementById("ts_value").innerHTML = newTime;
		var key = today + "";
		var obj = {};
		var likes = document.getElementById('lg_value').innerHTML;
		obj[key] = {'likesGiven': likes, 'timeSpent': newTime};
		chrome.storage.local.set(obj);	    
	}
}

// convert the time retrieved from the local storage to seconds
function stringToSeconds(timeString) {
	var res = timeString.split(":");
	var hours = parseInt(res[0]) * 3600;
	var minutes = parseInt(res[1]) * 60;
	var seconds = parseInt(res[2]);
	var totalSeconds = hours + minutes + seconds;	 
	//console.log("hours " + hours + "minutes " + minutes + "seconds " + seconds);
	return totalSeconds;

}



