// This file will take care of general settings stuff for all popup pages.
//import {abreviateTab, getActiveTab} from './utils.js';

openSettings = document.getElementById("settings-btn");

if (openSettings){
    openSettings.addEventListener("click",()=>{
        chrome.tabs.create({
            active: true,
            url:  '/src/settings.html'
          }, null);
    })
}




