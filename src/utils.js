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

export function getBtnElem(elem){
    const btnElem = elem.nodeName== "IMG"? elem.parentNode : elem;
    return btnElem
  }

export function addKeySpace(keySpace, list){
    chrome.storage.sync.get(['KeySpaces'], function({KeySpaces}=keyspaces){
        KeySpaces[keySpace] = list;
        chrome.storage.sync.set({"KeySpaces": KeySpaces})
    });
}

export async function deleteKeySpace(shortcut){
    let keySpace = new Promise((res)=>{
        chrome.storage.sync.get(['KeySpaces'],function({KeySpaces}=keyspaces){
            res(KeySpaces[shortcut]);
            delete KeySpaces[shortcut];
            chrome.storage.sync.set({'KeySpaces': KeySpaces},function() { });
        });
    });
    return await keySpace;
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


export async function storeKC(url){
    const tURL = getActiveUrl();
    const splits = [];
    var bURL;
  
    if (tURL.contains("q=")){
      splits = tURL.split("q=");
      bURL = splits[0].concat("q=");
    }
    else if (tURL.contains("search?=")){
      splits = tURL.split("search?=");
      bURL = splits[0].concat("search?=");
    }
    else if (tURL.contains("search_query=")){
      splits = tURL.split("search_query=");
      bURL = splits[0].concat("search_query=");
    }
    console.log({bURL});
    return bURL;
};
  
export async function getBeforeUrl(url){
    
    const parts = url.split('/');
    const baseUrl = parts.slice(0,3).join('/');
    const date = new Date(); //get date now
    date.setMonth(date.getMonth() - 1); //set to one month ago
    let beforeURL = new Promise((res,rej)=>{
        chrome.history.search({text: baseUrl, startTime: date.getTime()}, function(results){ //get searches on this site form 1 month ago till now
            var potentialSearches = results.filter((result)=>{
                return result.title.match(/search/i);
            });
            console.log(potentialSearches);
            const counts = {
                "q=":0,
                "search?=":0,
                "search_query=":0,
                "search=":0
            };
            if(potentialSearches.length > 0){
                
                // let protocall = ["",0];
                const proto = potentialSearches.reduce((protocall,search) => {
                    for(const count in counts){
                        if(search.url.includes(count)){
                            console.log('found');
                            if(protocall[1]>=counts[count]++){
                                protocall = [count,counts[count],search.url.split(count)[0]+count];
                            }
                        }
                    }
                    return protocall;
                },["",0,""]);
                if(proto[2].length!==0){
                    console.log(proto);
                    res(proto[2]);
                    return;
                }
                console.log(proto);
                console.log(potentialSearches);
            }
            let best = ['',0];
            for(const count in counts){
                console.log(count);
                console.log(results);
                counts[count] = results.filter(res=>res.url.includes(count));
                console.log(counts[count]);
                if(counts[count].length>best[1]){
                    console.log('bestie');
                    best = [count,counts[count].length]
                }
            }
            if(best[0]!==''){
                console.log(best);
                res(counts[best[0]][0].url.split(best[0])[0] + best[0]);
                return;
            } else {
                console.log('here')
                 res('');
                 return;
            }
        });
    });
    return await beforeURL;   
}