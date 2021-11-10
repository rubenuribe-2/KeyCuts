// This file will take care of general settings stuff for all popup pages.

const openSettings = document.getElementById("settings-btn");

if (openSettings){
    openSettings.addEventListener("click",()=>{
        chrome.tabs.create({
            active: true,
            url:  '/settings.html'
          }, null);
    })
}