console.log("in background............");

//listen for messages from main.js
//console log the message

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.message == "stopLikeRequest") {
		chrome.webRequest.onBeforeRequest.addListener( 	
			function(info) {
			console.log("onbeforereq");
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
  });







