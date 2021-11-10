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

const default_spaces = {
  "cpstn":{
    items : ['https://canvas.tamu.edu/courses/103856','https://howdy.tamu.edu/uPortal/f/welcome/normal/render.uP','https://drive.google.com/drive/u/0/my-drive']
  }
}

let color = '#3aa757';
chrome.runtime.onStartup.addListener(()=>{
    // Runs each time a profile with KeyCuts Installed is opened
    // Retrieve keycuts from DB and store in global data structures.
});

chrome.omnibox.onInputEntered.addListener((text) => {
  // Encode user input for special characters , / ? : @ & = + $ #
  const splitText = text.split(' ');
  const keyCut = splitText[0];
  const query = splitText.slice(1).join(' ');
  console.log({query});
  let navURL;
  if(default_keys[keyCut]){
    const KeyCut = default_keys[keyCut];
    if(query){
      navURL = KeyCut.before + encodeURIComponent(query) + KeyCut.after;
    }
    else {
      navURL = KeyCut.none;
    }
  } else {
    if(default_spaces[keyCut]){
      default_spaces[keyCut].items.forEach((item)=>{
        NavigateTo(item);
      })
    } else{
      navURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
    }
  }
  if(navURL){
    NavigateTo(navURL);
  }
});

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

/* getCurrentTab().then(res=>{
  chrome.storage.local.set({key: res.url}, function() {
      console.log('Value is set to ' + res.url);
  });
  chrome.storage.sync.get(['key'], function(result) {
      console.log('Value currently is ' + result.key);
  });
  
})
 */
