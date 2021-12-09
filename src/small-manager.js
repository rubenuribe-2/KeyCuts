import {abreviateTab, getActiveTab, addKeyCut, storeKC, deleteKeyCut, deleteKeySpace, getBeforeUrl} from './utils.js';

const url_field = document.getElementById('url-field');
const kc_field = document.getElementById('KeyCut-field');
const createKC = document.getElementById("keycut-btn");

var keyCuts;
var spaces;
let urls_set = {};
let beforeUrls_set = {};
let urls = [];
let beforeUrls = [];

let kc = "";

function kc_exists(){
    return kc !== "";
} 

function checkUrl(){
    getActiveTab().then((activeTab)=>{
        console.log(activeTab);
        const url = activeTab.url;
        const protocol = url.split('://');
        const shortUrl = protocol[0] === "https"? protocol[1] : url 
        url_field.value = shortUrl;
        
        const ifCut = getCut(url);
        if(ifCut!=""){
            //this url exists in our KeyCut Db
            kc = ifCut;
            createKC.innerText = `Update '${kc}' KeyCut`;
            const shortcut = keyCuts[ifCut].shortcut;
            kc_field.value = shortcut;
            url_field.value = shortUrl;
        } else {
            
            abreviateTab(activeTab).then((abv)=>{
                console.log(abv);
                kc_field.value = abv;
                createKC.innerText = `Make '${abv}' KeyCut`;
            });   
        }
         
    });
}
function getCut(url){ //if the url exists as a cut then we return the cut else an empty string
    console.log('getting cut', url)
    console.log('getting cut', urls)
    const ifUrl = urls.find((_url)=>{
        console.log(_url, url);
        console.log(_url==url)
        return _url==url
    });
    console.log(ifUrl);
    if(ifUrl){
        console.log('found')
        return urls_set[url];
    }
    const burl = beforeUrls.find(_burl=>{return url.startsWith(_burl)});
    if(burl){
        return beforeUrls_set[burl]
    } 
    return ""
    
}

chrome.storage.sync.get(['KeyCuts'], ({KeyCuts} = keycuts)=>{
    console.log(KeyCuts);
    keyCuts = KeyCuts
    for (const cut in KeyCuts){
      console.log(cut, KeyCuts[cut]);
      urls_set[KeyCuts[cut].none] = cut;
      urls.push(keyCuts[cut].none)
      if(KeyCuts[cut].before){
          beforeUrls_set[keyCuts[cut].before] = cut;
          beforeUrls.push(keyCuts[cut].before)
      }
    }
    checkUrl();
  });
chrome.storage.sync.get(['KeySpaces'], ({KeySpaces} = keyspaces)=>{
    spaces = Object.keys(KeySpaces);
  });




if (createKC){
    createKC.addEventListener("click",async ()=>{
        if (createKC.classList.contains('deactive')) return
        const abv = kc_field.value.split(" ").join("");
        // re append protocall if it was https\/
        const noSearchUrl = url_field.value.search("://") === -1 ? "https://" + url_field.value: url_field.value;
        let searchURL = await getBeforeUrl(noSearchUrl);
        console.log(searchURL);
        
        if(!kc_exists()){
            //for making a new keyCut
            if(spaces.includes(abv)){
                deleteKeySpace(abv);
            }
            kc = abv;
            addKeyCut({shortcut:abv, none: noSearchUrl, before: searchURL});
            createKC.innerText = `Update '${kc}' KeyCut`;  
            createKC.classList.remove('conflict');          
        } else {
            //update?
            if(searchURL === ''){
                searchURL = keyCuts[abv]?.before || ''; //keep old search if possible
            }
            addKeyCut({shortcut:abv, none: noSearchUrl, before: searchURL});
        }
    });
}

kc_field.addEventListener("input",(e)=>{
    console.log(e)
    const src_elem = e.srcElement;
    src_elem.value = src_elem.value.split(' ').join('');
    const value = src_elem.value;
    if(value === ""){
        createKC.classList.add('deactive');
        createKC.innerText = ':(';
        return;
    } else {
        createKC.classList.remove('deactive');
    }
    console.log(keyCuts[kc]);
    console.log(keyCuts[value]);
    if(keyCuts[value] && keyCuts[value] != keyCuts[kc]){
        //there is a kc conflict
        createKC.classList.add('conflict');
        createKC.innerText = `Replace '${value}' KeyCut`;
    } else if (spaces.includes(value)) {
        createKC.classList.add('conflict');
        createKC.innerText = `Replace '${value}' KeySpace`;
    }else if (!keyCuts[value]){
        createKC.innerText = `Make '${value}' KeyCut`;
        createKC.classList.remove('conflict')
    } else if (keyCuts[value] == keyCuts[kc]) {
        // all good this key cut is available or is the current key cut
        createKC.innerText = `Update '${value}' KeyCut`;
        createKC.classList.remove('conflict')
        
    } 
    
})


  
