// This file will run in the background
// Idealy we want this to take care of omnibox and routing the extension to the right place
// console.log(chrome);


let color = '#3aa757';
console.log(">>>", chrome.omnibox.onInputEntered.addListener);

chrome.omnibox.onInputEntered.addListener(function(text){
    console.log(text);
    const short = parseText(text);
    if(short[0] == 'yt'){
        if(short.length > 1){
            short.splice(0,1);
            let yt_url  = "https://www.youtube.com";
            let temp = '';
            let sq = short[0];
            for(let i = 0; i < short.length - 1; i++){
                temp = sq.concat('+', short[i+1]);
                sq = temp;
            }
            let yt_sq = yt_url.concat('/results?search_query=',sq);
            NavigateTo(yt_sq);
        }
        else{
            NavigateTo("https://www.youtube.com");
        }
    }
    else if(short[0] == 'hd'){
        NavigateTo("https://howdy.tamu.edu");
    }
    else{
        NavigateTo("https://canvas.tamu.edu");
    }
    //should select correct url down the line
})

function parseText(text){
    const words = text.split(" ");
    return words;
}


async function NavigateTo(url){
    //navigates current tab to url
    //really it closes the current tab and creates a new one in the same place
    const tab = await getCurrentTab();
    console.log(tab);
    chrome.tabs.remove(tab.id);
    chrome.tabs.create({url: url, active: true, index: tab.index});
}


async function  getCurrentTab(){
    //returns the currently focused tab and its metadata
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function getCurrentUrl(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        // use `url` here inside the callback because it's asynchronous!
    });
    return url;
}
