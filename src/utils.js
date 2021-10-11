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

export function abreviateTab(tab){ // -> String
    // Takes in a tab and returns a non conflicting abreviation
    const url = tab.url;
    const noProt = url.split("://")[1];
    const baseUrl = noProt.split('/')[0];
    const parts = baseUrl.split('.');
    let abv = "";
    if(commonSubDomain(parts[0])){
        abv = parts[1].slice(0,3);
    } else {
        abv = parts[0].slice(0,3);
    }
    return abv;


}