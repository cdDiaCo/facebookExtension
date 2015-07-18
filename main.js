
console.log("in main............");

var today = getCurrentDate();

var likesLimit = 3;
var numOfLikes =2;
var retrievedDate;

var key = today + "";

chrome.storage.local.get(key, function(result){
	//console.log("nnnnnnnn " + JSON.stringify(result));
	//console.log("nnnnnnnn " + result.date);
	//retrievedDate = (typeof result.date === "undefined") ? today : result.date;
	console.log("lll" + JSON.stringify(result));		
	retrievedContent = result[key];
	console.log(result[key]);
	if(retrievedContent) {
		console.log("fff " + retrievedContent.likesGiven);	
		console.log("ddd " + retrievedContent.timeSpent);
	}
});

document.addEventListener('DOMContentLoaded', function () {  
	// overlay the div that shows the likes given by user, the time spent
	var div = document.createElement("div");
	div.className = "box_stats"; 

	var likesGiven = document.createElement("span");
	var likesGivenValue = document.createElement("span");
	likesGivenValue.id = "lg_value";
    likesGivenValue.innerHTML = numOfLikes;
	var likesText = document.createTextNode(" Likes given: ");

	var timeSpent = document.createElement("span");
	var timeSpentValue = document.createElement("span");
	timeSpentValue.id = "ts_value";
	var timeText = document.createTextNode("Time spent: ");

	timeSpent.appendChild(timeText);
	timeSpent.appendChild(timeSpentValue);
	div.appendChild(timeSpent);

	likesGiven.appendChild(likesText);
	likesGiven.appendChild(likesGivenValue);
	div.appendChild(likesGiven);	
	document.body.appendChild(div);		

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
	console.log("in the like click handler");	
	numOfLikes += 1;
	// check if likesLimit is reached
	// if this is the case notify the user and stop any other possible likes 	
	console.log('numOfLikes ' + numOfLikes);			 
	if (numOfLikes > likesLimit) {			
		chrome.runtime.sendMessage({message: "stopLikeRequest"}, function(response) {
	  		console.log(response.requestBlocked);
		});	
	} else { 
		if (numOfLikes === likesLimit) { 
			alert("you reached the likes limit for today"); 				
		}	
		console.log("today " + today);
		//chrome.storage.local.set({'likesGiven': numOfLikes, 'likesGivenDate': today});
		var key = today + "";
		var obj = {};
		obj[key] = {'likesGiven': numOfLikes, 'timeSpent': 2};
		chrome.storage.local.set(obj);	    
		document.getElementById('lg_value').innerHTML = numOfLikes; // update the likes given UI
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





