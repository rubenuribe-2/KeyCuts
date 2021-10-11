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

