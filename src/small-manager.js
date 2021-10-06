url_field = document.getElementById('url-field');


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    // since only one tab should be active and in the current window at once
    // the return variable should only have one entry
    var activeTab = tabs[0];
    url_field.value = activeTab.url;
    console.log(activeTab);

 });