// This file will run in the background
// Idealy we want this to take care of omnibox and routing the extension to the right place
// console.log(chrome);


let color = '#3aa757';
console.log(">>>", chrome.omnibox.onInputEntered.addListener);

chrome.omnibox.onInputEntered.addListener(function(text){
    console.log(text);
    NavigateTo("https://www.youtube.com"); //should select correct url down the line
})


async function NavigateTo(url){
    //navigates current tab to url
    //really it closes the current tab and creates a new one in the same place
    const tab = await getCurrentTab();
    console.log(tab);
    chrome.tabs.remove(tab.id);
    chrome.tabs.create({url: url, active: true, index: tab.index});
}


async function  getCurrentTab(){
    //returns the currently focused tab and its metadata
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!
});

chrome.omnibox.onInputEntered.addListener((text) => {
    // Encode user input for special characters , / ? : @ & = + $ #
    
    var navURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
    chrome.tabs.NavigateTo({ url: navURL });
  });