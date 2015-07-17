(function() {
console.log("in main............");

var likesLimit = 3;
var numOfLikes;
chrome.storage.local.get('likesGiven', function(result){
	numOfLikes = (typeof result.likesGiven === "undefined") ? 0 : result.likesGiven ;	
});


document.addEventListener('DOMContentLoaded', function () {
    //console.log("in addeventlistener");

	var div = document.createElement("div");
	div.className = "box_stats"; 

	var likesGiven = document.createElement("span");
	var likesGivenValue = document.createElement("span");
    likesGivenValue.innerHTML = numOfLikes;
	var text = document.createTextNode("likes given: ");
	likesGiven.appendChild(text);
	likesGiven.appendChild(likesGivenValue);
	div.appendChild(likesGiven);
	document.body.appendChild(div);	
	

	window.onscroll = function() {
		// everytime the user scrolls the page, take all the like btns available at that point ( class "UFILikeLink" )	
	    //var elements = document.getElementsByClassName("_5jmm _5pat _3lb4 _x72 _50nb");
		var likeBtns = document.getElementsByClassName('UFILikeLink');				
		for(var i=0; i<likeBtns.length; i++) {
			var likeClass = likeBtns[i].className;

			if( likeClass.indexOf("hasOnClickListener") > -1) { 
				// this like btn already has the onclick event listener
				// so skip to the next one
				continue; 
			}
				
			likeBtns[i].className = likeClass + " hasOnClickListener";	 // mark this like btn by adding a new class to it		
			likeBtns[i].onclick = function() {
									console.log("in the handler");									
									numOfLikes += 1;
									// check if likesLimit is reached
									// if this is the case notify the user and stop any other possible likes 				 
									if (numOfLikes > likesLimit) {	
										chrome.runtime.sendMessage({message: "stopLikeRequest"}, function(response) {
									  		console.log(response.requestBlocked);
										});	
									} else if (numOfLikes === likesLimit) {
										alert("you reached the likes limit for today");
									} else {
										chrome.storage.local.set({'likesGiven': numOfLikes});	
										likesGivenValue.innerHTML = numOfLikes; // update the likes given UI
									}																		
								};
			console.log("numOfLikes: " + numOfLikes);						
		} 						
	};

});


})();
