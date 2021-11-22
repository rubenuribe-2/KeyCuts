import {abreviateTab, getActiveTab, addKeyCut} from './utils.js';

const url_field = document.getElementById('url-field');
const kc_field = document.getElementById('KeyCut-field');
const createKC = document.getElementById("keycut-btn");

var keyCuts;
let urls_set = {};
let beforeUrls_set = {};
let urls = [];
let beforeUrls = [];

let kc_exists = false;

function checkUrl(){
    getActiveTab().then((activeTab)=>{
        console.log(activeTab);
        const url = activeTab.url;
        const protocol = url.split('://');
        const shortUrl = protocol[0] === "https"? protocol[1] : url 
        url_field.value = shortUrl;
        
        const ifCut = getCut(url);
        if(ifCut){
            //this url exists in our KeyCut Db
            kc_exists = true;
            createKC.innerText = 'Update KeyCut';
            const shortcut = keyCuts[ifCut].shortcut;
            kc_field.value = shortcut;
            url_field.value = shortUrl;
        } else {
            
            abreviateTab(activeTab).then((abv)=>{
                console.log(abv);
                kc_field.value = abv;
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




if (createKC){
    createKC.addEventListener("click",()=>{
        if(!kc_exists){
            const abv = kc_field.value.split(" ").join("");
            // re append protocall if it was https\/
            const shortUrl = url_field.value.search("://") === -1 ? "https://" + url_field.value: url_field.value;
            addKeyCut({shortcut:abv, none: shortUrl});
            kc_exists = true;
            createKC.innerText = 'Update KeyCut';            
        } else {
            //update?
        }
    });
}
