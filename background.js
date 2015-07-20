console.log("in background............");

//listen for messages from main.js

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {    
    if (request.message == "stopLikeRequest") {
		chrome.webRequest.onBeforeRequest.addListener( 	
			function(info) {
				//console.log("onbeforereq");
				//console.log("onBeforeRequest: " + JSON.stringify(info.requestBody.raw[0].bytes) );  
				return {cancel: true};  
			},
			// filters
			{
			urls: ['*://www.facebook.com/ufi/like/']   
			},
			// extraInfoSpec
			["blocking", "requestBody"]
		);
        sendResponse({requestBlocked: "done"});
	}
	else if (request.message == "is_facebookTabActive") {
		var isActiveValue;
		chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
			console.log("tabs: " + JSON.stringify(tabs));
			console.log("tab0 " + JSON.stringify(tabs[0]));
            if(tabs[0] && (tabs[0].url).indexOf("www.facebook.com") > -1) {
                isActiveValue = true; //in focus (selected)
				sendResponse({isActive: isActiveValue});
            } else {
                isActiveValue = false;  //not in focus
				sendResponse({isActive: isActiveValue});
            }

        });
		//sendResponse({isActive: isActiveValue});
		return true;
	}

  });







