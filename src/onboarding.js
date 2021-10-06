// This file will take care of onboarding interactions

noOnboard = document.getElementById("no-onboard");
yesOnboard = document.getElementById("onboard-me");
if(noOnboard){
    noOnboard.addEventListener("click",()=>{
        // change popup to ordinary popup
        chrome.action.setPopup({popup: "src/popup.html"},()=>{
        });
        // persist that user has onboarded.
    });
}

if(yesOnboad){
    yesOnboad.addEventListener("click",()=>{
        // do onboarding & show user around
        // at the end we should persist that the user has onboarded
    })
}
