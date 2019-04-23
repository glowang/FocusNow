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