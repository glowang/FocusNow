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

/** present a quiz form if user clicks on a banned website  
 * @param sender argument has information about the tab id (not sure if needed?)
 * @param sendResponse argument is used for sending response back to the monitor.js script
 */
//chrome.runtime.onMessage.addListener(function(response,sender,sendResponse){
//    alert("hellosss");
    //const parsed_url = parsed(url) // get the right formatr  
//    if (check_url(parsed_url)){
        // TODO how to pop up a new page? an HTTP call? redirect or Open a new, overriden page?
        
    //}
    // then check if url is in our banned list                                   
//});