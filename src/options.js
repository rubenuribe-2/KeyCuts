document.getElementById("turi").addEventListener("click", testURI);

function testURI() {
    var uri = "search?q=Hi%21%40%23%24%25%5E%26*%28%29KeyCuts";
    var enc = encodeURI(uri);
    var dec = decodeURI(enc);
    var out = "Encoded URI: " + enc + "<br>" + "Decoded URI: " + dec;
    document.getElementById("Test").innerHTML = out;
}