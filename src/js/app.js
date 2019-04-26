/** create a listener to pop up pages when an event trigger occurs */
/**
 * if the http request is banned: spit out a question
 *      if the question is answered correctly, allow website browsing for 10 minutes
 *           (if the user quit the website before the 10 minutes, 
 *           they can continue using it next time without doing the quiz again)
 *      if wrong answer:
 *           give another try
 *      if wrong for three times:
 *           block the entire website use for (custom_input) hour
 */
/** populate this array with banned urls gathered from user_input.ejs 
 * will be listening for an event from HTML
*/

// variable that represents user's local storage 
// TODO store banned domains in local_storage


function get_url_domain() {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs){
        const tab = tabs[0];
        const curr_url = new URL(tab.url);
        const domain = curr_url.hostname;
        return domain;
        // `domain` now has a value like 'example.com'
    });
}


// listening for whether the URL has been changed on a current tab 
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    const domain = get_url_domain();
    check_url(domain);
});

// listening for newly created tab
chrome.tabs.onCreated.addListener(function(tab) {         
    const domain = get_url_domain();
    check_url(domain);
});


//TODO set up a page that allows users to specify pages they want to ban
//check if the url is in the blacklist 

function give_quiz(){ // TODO: need to connect to mongodb and look up question in mongodb
    const dialog = document.getElementById('dialog');
    dialog.showModal();
    sendResponse({message: dialog.showModal()}); 
};


/** check whether url is in the banned list. Call the addlistener function if so, else do nothing */
function check_url(url){
    if (url == 'facebook.com') { // url domain parser 
        give_quiz() // should take a user's latest question ID 
    } 
};


/**
 * Storage stuff for toggle popup on a specific URL
 */
var toggle_popup_flag = (url) => {
    chrome.storage.sync.get([url], function(result) {
        var prev = result.key;
        console.log('Value currently is ' + prev);
        if (prev == null) {
            prev = false;
        }
        var value = !prev; // Toggle 
        chrome.storage.sync.set({url: value}, function() {
            console.log('Value is set to ' + value);
          });
      });
}

// TODO: do some hostname preprocessing before append
// TOOD: write some logic for storing this in options and persist

// an event listener that calls update_blacklist when users want to update from content scripts
chrome.runtime.onMessage.addListener( // how to receive an object and identify it LOL
    (request,sender,sendResponse) => {
        if (request.greeting == {K,V}) // TODO: this is tricky; how do you specify a format
        update_blacklist({k:v});
    } // call update_blacklist with the input received 
    // input should be a KV: {domain: value}
);


// a typical pair is {"dom":UrlSettings Object}
// need "dom" because we want to look up easily from chrome storage
// TODO: chrome.runtime.sendMessage() 
// here is another function that does update the keyvalue pair. done through sending messages to app.js

chrome.runtime.onMessage.addListener(function(response,sender,sendResponse){
    chrome.storage.sync.get(dom, function(object) {
        if (typeof object === 'undefined') { // means this KV has yet to be created
            settings = new UrlSettings(dom,isblocked,time,allowed_time);
            chrome.storage.sync.set({dom:settings},()=> {
                console.log("A new url setting has been recorded");
            });
        } else {
          // if object already exists, update its setting accordingly 
            object.domainName = dom;
            object.blocked = isblocked;
            object.timestamp = time;
            object.allowedTime = allowed_time;
            console.log("Settings for "+dom+"has been updated");
        };
      });
    chrome.runtime.sendMessage({greeting:"Updated!"}, function(response) { // probably want to use Promise in the future
        console.log("Please take note of the updated key value pair"); // sending it to app.js
        });
    });


// once new inputs come in from content script
const update_blacklist = ({key:value})=> {
    chrome.storage.sync.set({key:value}, function() {
        console.log('Value is set to ' + value);
      });  
}

//var blacklist = new Set();
//blacklist.forEach(toggle_popup_flag)

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.greeting == "hello") { // just for debugging purposes
            sendResponse({farewell: "goodbye"});
        } else if (request.blocked != null) { // return if 
            sendResponse({isBlocked: blacklist.has(request.blocked)}); // TODO: actually toggle instead
        } else if (request.toggleBlocked != null) { 
            toggle_popup_flag(request.toggleBlocked);
            sendResponse({toggleBlocked: "toggled!"})
        } else if (request.addToBlacklist != null) {
            blacklist.add(request.addToBlacklist);
            sendResponse({added: true}); // TODO: make this more meaningful
        }
    });