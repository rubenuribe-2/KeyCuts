import {abreviateTab, getActiveTab} from './utils.js';

const url_field = document.getElementById('url-field');
const kc_field = document.getElementById('KeyCut-field');

getActiveTab().then((activeTab)=>{
    console.log(activeTab);
    const url = activeTab.url;
    const protocol = url.split('://');
    const shortUrl = protocol[0] === "https"? protocol[1] : url 
    url_field.value = shortUrl;
    const abv = abreviateTab(activeTab);
    console.log(abv);
    kc_field.value = abv;
});

const createKC = document.getElementById("keycut-btn");
if (createKC){
    createKC.addEventListener("click",()=>{
        getActiveTab().then((activeTab)=>{
            chrome.storage.sync.get(['KeyCuts'], function({KeyCuts} = keycut){
                const abv = kc_field.value.split(" ").join("");
                const shortUrl = url_field.value;
                console.log(KeyCuts);
                KeyCuts[abv] =  {none:shortUrl,shortcut:abv,before:"",after:""}; //before and after need values
                console.log(KeyCuts);
                chrome.storage.sync.set({"KeyCuts": KeyCuts}, function() {
                console.log('Value is set to ' + shortUrl);

            }
            )
            
        });
    });
    })
}
