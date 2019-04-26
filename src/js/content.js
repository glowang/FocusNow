// alert("hey stop that")
// confirm("CONFIRM???")

/**
 * Best idea is to prob just generate html dom elements programatically as below
 */

// get current page details
var host = location.hostname;

var interceptPage = () => {
    // create a new div element to wrap everything
    document.write("helloOOO!") // wipe existing page
    var newDiv = document.createElement("div"); 
    var newContent = document.createTextNode("Be mindful and present...blocking " + host); 
    newDiv.appendChild(newContent);  
    
    // create adv button
    var input = document.createElement("input");
    input.type = "button";
    input.value = "button press";
    input.onclick = () => {
        console.log("refreshing")
        // not block it now
        chrome.runtime.sendMessage({toggleBlocked: host}, function(response) {
            console.log(response.toggleBlocked);
          });
        window.location.reload()
    }
    
    newDiv.appendChild(input)
    
    // add the newly created element and its content into the DOM 
    document.body.insertBefore(newDiv, null); 
}


class UrlSettings {
    constructor(dom, isblocked, time, allowed_time) {
        this.domainName = dom;
        this.blocked = isblocked;
        this.timestamp = time;
        this.allowedTime = allowed_time;
    };
};

// TODO HTML form to collect user input and call function updateUrlSetting? ？
var sendUrlUpdate = (dom,isblocked,time,allowed_time) => {
    chrome.runtime.sendMessage({dom, UrlSettings(dom,isblocked,time,allowed_time)});
}

// listening for app.js to complete its update in the background: 
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.greeting === "Updated!") {
            console.log("hahA");
        } else {
            console.log("Haven't received confirmation of update");
        }
    });


chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });

chrome.runtime.sendMessage({blocked: host}, response => {
    console.log("isBlocked: " + response.isBlocked);
    if (response.isBlocked) {
        console.log("Do blocked things");
        interceptPage();
    } else {
        console.log("Not blocked! Refresh and be happy");
    }
});

