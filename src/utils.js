// common utility functions that can be used throughout app :)



export async function getActiveTab(){ // -> Tab
    //gets the active Tab
    // returns: Tab https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab
    return chrome.tabs.query({active: true, currentWindow: true}).then(tabs => {
        const activeTab = tabs[0];
        return activeTab;
    });
}
export async function getActiveUrl(){// -> String
    //gets url from active tab
    // returns: String e.x. "https://www.google.com"
    return getActiveTab().then(tab=>{
        return tab.url;
    });
    
}

export function addKeyCut(keyCut){
    // adds a new KeyCut to chrome Storage
    /* keyCut {
        shortcut: "", req;
        none: "url",
        before: "url search prefix",
        after "url search suffix",
    } */
    console.assert(keyCut.shortcut,"addKeyCut(keyCut) KeyCut must contain key shortcut");
    chrome.storage.sync.get(['KeyCuts'], function({KeyCuts} = keycut){
        const abv = keyCut.shortcut.split(" ").join(""); //assure that there are no spaces in KeyCut
        KeyCuts[abv] =  {none:keyCut.none||"",shortcut:abv,before:keyCut.before||"",after: keyCut.after||""}; //before and after need values
        chrome.storage.sync.set({"KeyCuts": KeyCuts}, function() { });
    });
}

export async function deleteKeyCut(shortcut){
    // deletes a KeyCut from chrome Storage
    // shortcut : string;
    //returns the deleted keyCut
    let keyCut = new Promise((res)=>{
        chrome.storage.sync.get(['KeyCuts'], function({KeyCuts} = keycut){
            console.log(KeyCuts[shortcut]);
            res(KeyCuts[shortcut]);
            delete KeyCuts[shortcut];
            chrome.storage.sync.set({"KeyCuts": KeyCuts}, function() { });
        });
    });
    console.log(keyCut);
    return await keyCut;
    
}

const commonSubDomains= [
    'www',
    'blog',
    'groups',
    'home',
    'homepage',
    'homepage3',
    'homepage2',
]
function commonSubDomain(subdomain){
    return commonSubDomains.includes(subdomain);
}
const relaventSubDomains = [
    'dev',
    'developer',
    'help',
    'map',
]
function relaventSubDomain(subdomain){
    //true if the subdomain is relevant to the content i.e. developer, map, help.
    return relaventSubDomains.includes(subdomain);
}

export async function abreviateTab(tab){ // -> String
    // Takes in a tab and returns a non conflicting abreviation
    const abrev = new Promise((res)=>{
        chrome.storage.sync.get("!!!",(cuts)=>{
            const set_cuts = cuts["!!!"];
            console.log(set_cuts);
            const url = tab.url;
            const noProt = url.split("://")[1];
            const baseUrl = noProt.split('/')[0];
            const parts = baseUrl.split('.');
            let abv = "";
            let base = 1;
            if(commonSubDomain(parts[0])){
                const abv_ = parts[1].slice(0,3);
                abv = abv_;
                while (set_cuts.includes(abv)){
                    abv = abv_ + base;
                    base++;
                }
            } else {
                const abv_ = parts[0].slice(0,3);
                abv = abv_;
                while (set_cuts.includes(abv)){
                    abv = abv_ + base;
                    base++;
                }
            }
            res(abv);
        });
    });
    return await abrev;
    


}