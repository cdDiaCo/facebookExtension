console.log("in background............");

//listen for messages from main.js

var blockLikes = function() {		
		return {cancel: true};  
}; 

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {    
    if (request.message == "stopLikeRequest") {			
		chrome.webRequest.onBeforeRequest.addListener( 	
			blockLikes,
			// filters
			{
			urls: ['*://www.facebook.com/ufi/like/']   
			},
			// extraInfoSpec
			//["blocking", "requestBody"]
			["blocking"]
		);		
        sendResponse({requestBlocked: "done"});
	}
	else if (request.message == "removeListener") {
		chrome.webRequest.onBeforeRequest.removeListener(blockLikes);
		sendResponse({removed: "listener removed"});
	}	
	else if (request.message == "is_facebookTabActive") {
		var isActiveValue;
		chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
			//console.log("tabs: " + JSON.stringify(tabs));
			//console.log("tab0 " + JSON.stringify(tabs[0]));
            if(tabs[0] && (tabs[0].url).indexOf("www.facebook.com") > -1) {
                isActiveValue = true; //in focus (selected)
				sendResponse({isActive: isActiveValue});
            } else {
                isActiveValue = false;  //not in focus
				sendResponse({isActive: isActiveValue});
            }

        });		
		return true;
	}
  });


