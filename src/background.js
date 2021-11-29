// This file will run in the background
// Idealy we want this to take care of omnibox and routing the extension to the right place
// import default_keys from "default-keys.js"
"use strict";

// Where we will expose all the data we retrieve from storage.sync.
var storageCache = {};
var default_keys = {};
var default_spaces = {};

// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData().then(items => {
  // Copy the data retrieved from storage into storageCache.
  Object.assign(storageCache, items);
  default_keys = storageCache.KeyCuts;
  default_spaces = storageCache.KeySpaces;

  console.log("done fetching all data from storage");
});


chrome.runtime.onInstalled.addListener(()=>{
  //runs when the function is updated or installed for the first time

  console.log("importing default-keys");
  var default_keys_url = chrome.runtime.getURL('./defaults/default-keys.json');

  fetch(default_keys_url)
  .then((response) => response.json())
  .then((json_default_keys) => {
    chrome.storage.sync.set({KeyCuts: json_default_keys}, function() {})
  });


  console.log("importing default-spaces");
  var default_spaces_url = chrome.runtime.getURL('./defaults/default-spaces.json');

  fetch(default_spaces_url)
  .then((response) => response.json())
  .then((json_default_spaces) => {
    chrome.storage.sync.set({KeySpaces: json_default_spaces}, function() {})
  });

})


chrome.runtime.onStartup.addListener(async ()=>{
  try {
    await initStorageCache;
  } catch (e) {
    // Handle error that occurred during storage initialization.
  }
  // Normal action handler logic.
});

// Reads all data out of storage.sync and exposes it via a promise.
//
// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
function getAllStorageSyncData() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(null, (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
}

function searchOmnibox(text){
  // Encode user input for special characters , / ? : @ & = + $ #
  const t0 = performance.now() | 0;
  const splitText = text.split(' ');
  const keyCut = splitText[0];
  const query = splitText.slice(1).join(' ');
  console.log({query});
  let navURL;
  if(default_keys[keyCut]){
    const KeyCut = default_keys[keyCut];
    if(query){
      navURL = KCtoURL(KeyCut, query);
    } else {
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
  const t1 = performance.now() | 0;
  console.log(`navigating took ${t1-t0}ms ${t0} ${t1}`);
}

chrome.omnibox.onInputEntered.addListener(searchOmnibox);


function KCtoURL(KeyCut, query){
  return KeyCut.before + encodeURIComponent(query) + KeyCut.after;
};

async function NavigateTo(url){
    // navigates current tab to url
    // really it closes the current tab and creates a new one in the same place
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
      storageCache.KeyCuts = newValue;
    }

  }
});
