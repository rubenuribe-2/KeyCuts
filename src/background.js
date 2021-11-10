// This file will run in the background
// Idealy we want this to take care of omnibox and routing the extension to the right place
// console.log(chrome);

const default_keys = {
  "yt": {   
      shortcut: "yt",
      none: "https://www.youtube.com",
      before: "https://www.youtube.com/results?search_query=",
      after: "",
  },
  "g": {
      shortcut: "g",
      none: "https://www.google.com",
      before: "https://www.google.com/search?q=",
      after: "",
  },
  "ddg": {
      shortcut: "ddg",
      none: "https://duckduckgo.com",
      before: "https://duckduckgo.com/?q=",
      after: "",
  },
  "z": {
      shortcut: "z",
      none: "https://www.zillow.com",
      before: "https://www.zillow.com/homes/",
      after: "/",
  },
  "a": {
      shortcut: "a",
      none: "https://www.amazon.com",
      before: "https://www.amazon.com/s?k=",
      after: "",
  },
  "ext": {
      shortcut: "ext",
      none: "chrome://extensions",
      before: "chrome://extensions",
      after: "",
  }
}

let color = '#3aa757';



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

chrome.storage.sync.get(['key'], function(result) {
    console.log('Value currently is ' + result.key);
});
