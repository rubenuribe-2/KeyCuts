// This file will run in the background
// Idealy we want this to take care of omnibox and routing the extension to the right place
// import default_keys from "default-keys.js"

var default_keys = {
  "yt": {   
      shortcut: "yt",
      none: "https://www.youtube.com/",
      before: "https://www.youtube.com/results?search_query=",
      after: "",
  },
  "g": {
      shortcut: "g",
      none: "https://www.google.com/",
      before: "https://www.google.com/search?q=",
      after: "",
  },
  "ddg": {
      shortcut: "ddg",
      none: "https://duckduckgo.com/",
      before: "https://duckduckgo.com/?q=",
      after: "",
  },
  "z": {
      shortcut: "z",
      none: "https://www.zillow.com/",
      before: "https://www.zillow.com/homes/",
      after: "/",
  },
  "a": {
      shortcut: "a",
      none: "https://www.amazon.com/",
      before: "https://www.amazon.com/s?k=",
      after: "",
  },
  "ext": {
      shortcut: "ext",
      none: "chrome://extensions/",
      before: "chrome://extensions",
      after: "",
  }
}
const default_spaces = {
  "cpstn":{
    items : ['https://drive.google.com/drive/u/0/folders/0ACRBX6tT21kXUk9PVA/','https://github.com/rubenuribe-2/KeyCuts/','https://canvas.tamu.edu/courses/103856/','https://howdy.tamu.edu/uPortal/f/welcome/normal/render.uP']
  }
}


chrome.runtime.onInstalled.addListener(()=>{
  //runs when the function is updated or installed for the first time
  chrome.storage.sync.set({KeyCuts: default_keys}, function() {});
  
})


chrome.runtime.onStartup.addListener(()=>{
    // Runs each time a profile with KeyCuts Installed is opened
    // Retrieve keycuts from DB and store in global data structures.
});

function searchOmnibox(text){
  // Encode user input for special characters , / ? : @ & = + $ #
  t0 = performance.now() | 0;
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
      openSpace(default_spaces[keyCut].items, keyCut);
    } else{
      navURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
    }
  }
  if(navURL){
    NavigateTo(navURL);
  }
  t1 = performance.now() | 0;
  console.log(`navigating took ${t1-t0}ms ${t0} ${t1}`);
}

chrome.omnibox.onInputEntered.addListener(searchOmnibox);



async function NavigateTo(url){
    //navigates current tab to url
    //really it closes the current tab and creates a new one in the same place
    const tab = await getCurrentTab();
    console.log(tab);
    chrome.tabs.remove(tab.id);
    chrome.tabs.create({url: url, active: true, index: tab.index});
}

async function openSpace(links,name = ""){
    const tab = await getCurrentTab();
    console.log(tab);
    chrome.tabs.group({tabIds:tab.id},(groupId)=>{
      chrome.tabGroups.update(groupId,{title: name });
      chrome.tabs.remove(tab.id);
      links.forEach(link=>{
        chrome.tabs.create({url: link,active: true, index: tab.index},(newTab)=>{
          chrome.tabs.group({groupId: groupId,tabIds: newTab.id});
        });
      });
    }); 
    
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



chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if(key === "KeyCuts"){
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue?.KeyCuts}", new value is "${newValue}".`
      );
      chrome.storage.sync.set({"!!!": Object.keys(newValue)});
      console.log(newValue);
      default_keys = newValue;
    }
    
  }
});
function getURL(){

  getActiveTab().then((activeTab)=>{
    console.log(activeTab);
    const url = activeTab.url;
  });
  return url.toString();

};

function storeKC(url){
  const tURL = getURL();
  const splits = [];
  const bURL;
  const eURL;
  const aURL;
  const parsingCode;

  if (tURL.contains("q=")){
    splits = tURL.split("q=");
    bURL = splits[0].concat("q=");
    if (splits[1].contains("+")){
      parsingCode = 0;
    }
    if (splits[1].contains("%")){
      parsingCode = 1;
    }
  }
  else if (tURL.contains("search?=")){
    splits = tURL.split("search?=");
    bURL = splits[0].concat("search?=");
    if (splits[1].contains("+")){
      parsingCode = 0;
    }
    if (splits[1].contains("%")){
      parsingCode = 1;
    }
  }
  else if (tURL.contains("search_query=")){
    splits = tURL.split("search_query=");
    bURL = splits[0].concat("search_query=");
    if (splits[1].contains("+")){
      parsingCode = 0;
    }
    if (splits[1].contains("%")){
      parsingCode = 1;
    }
  }
  return { bURL, parsingCode };
};

function KCtoURL(pCode, bURL, queries){
  let url = bURL;
  if ( pCode == 0 ){
    for (const q in queries){
      url.concat(q);
      url.concat("+");
    }
    url.substring(0, str.length - 1);
  }
  else if ( pCode == 1) {
    url.concat(encodeURIComponent(queries));
  }
}