
console.log("in main............");

var today = new Date();
var today = getFormattedDate(today);
console.log("today" + today);
var likesLimit = 8;
var numOfLikesRetrieved = 0;
var timeSpentRetrieved = 0;
var newTime;
var totalSecondsRetrieved = 0;
var key = today;
//var key = "2015-07-25";

chrome.storage.local.get(key, function(result){	
	retrievedContent = result[key];
	console.log(result[key]);
	
	if(typeof retrievedContent !== 'undefined') {		
		numOfLikesRetrieved = parseInt(retrievedContent.likesGiven);
		timeSpentRetrieved = retrievedContent.timeSpent;		

	} else { // there are no records in storage for this day
		// get the data for the last seven days, then clear the storage
		// save back the useful data 

		var lastSevenDaysArray = getLastSevenDays();
		chrome.storage.local.get(lastSevenDaysArray, function(result) {			
			chrome.storage.local.clear();
			for (day in result) {
				//console.log("jjjj " + JSON.stringify(result[day]));
				var obj = {};
				obj[day] = result[day];
				chrome.storage.local.set(obj);	
			}
		});		
	}	

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
	likesLimitValue = document.createElement("span");	
	likesLimitValue.id = "likes_limit";
	likesLimitValue.innerHTML = " / " + likesLimit;
	var likesText = document.createTextNode(" Likes given: ");

	var timeSpent = document.createElement("span");
	var timeSpentValue = document.createElement("span");
	timeSpentValue.id = "ts_value";
	timeSpentValue.innerHTML = timeSpentRetrieved;
	var timeText = document.createTextNode("Time spent: ");

	var firstBr = document.createElement("br");
	var secBr = document.createElement("br");

	var optionsSpan = document.createElement("span");
	var optionsLink = document.createElement("a");	
	optionsLink.addEventListener("click", optionsLinkHandler);
	optionsLink.id = "opLink_id";
	var optionsText = document.createTextNode("Options");
	optionsLink.appendChild(optionsText);
	optionsLink.title = "Click here for options settings";
	   
	optionsSpan.appendChild(optionsLink);
	div.appendChild(optionsSpan);
	div.appendChild(firstBr);


	timeSpent.appendChild(timeText);
	timeSpent.appendChild(timeSpentValue);
	div.appendChild(timeSpent);

	div.appendChild(secBr);

	likesGiven.appendChild(likesText);
	likesGiven.appendChild(likesGivenValue);
	likesGiven.appendChild(likesLimitValue);
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
		numOfLikesRetrieved -= 1;	
	} else { 
		if (numOfLikesRetrieved === likesLimit) { 
			alert("you reached the likes limit for today"); 				
		}			
		//chrome.storage.local.set({'likesGiven': numOfLikes, 'likesGivenDate': today});
		var key = today + "";
		//var key = "2015-07-25";
		var obj = {};
		obj[key] = {'likesGiven': numOfLikesRetrieved, 'timeSpent': newTime};
		chrome.storage.local.set(obj);   
		document.getElementById('lg_value').innerHTML = numOfLikesRetrieved; // update the likes given UI
	}
	console.log("num of likes: " + numOfLikesRetrieved);
}


function getFormattedDate(dateToFormat) {	
	var dd = dateToFormat.getDate();
	var mm = dateToFormat.getMonth()+1; //January is 0!
	var yyyy = dateToFormat.getFullYear();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	//today = mm+'/'+dd+'/'+yyyy;
	formattedDate = yyyy + '-' + mm + '-' + dd;
	return formattedDate;
}


function startTimer() {
	var seconds = totalSecondsRetrieved ? totalSecondsRetrieved : 0;
	var id = setInterval(addSecond, 1000);

	function addSecond() {	
		// check if facebook tab is active
		chrome.runtime.sendMessage({message: "is_facebookTabActive"}, function(response) {
			//console.log(JSON.stringify(response));
		    if(response.isActive) {				
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
				//var key = "2015-07-25";
				var obj = {};				
				obj[key] = {'likesGiven': numOfLikesRetrieved, 'timeSpent': newTime};
				chrome.storage.local.set(obj);	   
		    } else {
				//console.log("is not active");
		        //not in focus
		    }
    	});			 
	}
}

// convert the time retrieved from the local storage to seconds
function stringToSeconds(timeString) {
	var res = timeString.split(":");
	var hours = parseInt(res[0]) * 3600;
	var minutes = parseInt(res[1]) * 60;
	var seconds = parseInt(res[2]);
	var totalSeconds = hours + minutes + seconds;	 
	
	return totalSeconds;
}

function getLastSevenDays() {		
	var lastSevenDaysArray = [];

	for (var i=7; i>0; i--) {
		var d = new Date(); // current date
		d.setDate(d.getDate() - i);
		var day = getFormattedDate(d);
		lastSevenDaysArray.push(day);
	}
	return lastSevenDaysArray;
}


function optionsLinkHandler() {	
	if (chrome.runtime.openOptionsPage) {
   		// New way to open options pages, if supported (Chrome 42+).
    	chrome.runtime.openOptionsPage();
  	} else {
    	// Reasonable fallback.
    	window.open(chrome.runtime.getURL('options.html'));
  	}
}


