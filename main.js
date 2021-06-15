function test() {
    let a = confirm("Safe?");
    if(a) {
        document.body.p = "<p>This site is SAFE.";
    } else {
        document.body.p = "<p>This site is NOT safe.";
    }
}

function getUrl() {
    return location.href;
}

function getSlashIndex(url) {
    let str = url;
    let add = 0;
    if(url.indexOf("//") > -1) {        //in case there is https:// at the start
        str = url.substr(url.indexOf("//") + 2);
        add = 2 + url.indexOf("//");
    }

    return str.indexOf("/") + add;
}

function getIndexOfDomain(url) {
    let end = getIndexOfExtension(url) - 1;
    let i = end;
    let curr = url.charAt(i);
    while(curr != "." && curr != "/") {
        curr = url.charAt(i);
        i--;
    }
    return i + 2;
}

function getDomain(url) {
    let temp = getIndexOfDomain(url);
    return url.substr(temp, getIndexOfExtension(url) - temp);
}
//code is kinda repetitive, could later make a general function
function getExtension(url) {
    let temp = getIndexOfExtension(url);
    return url.substr(temp, getSlashIndex(url) - temp);
}

function getPostExtension(url) {
    return url.substr(getSlashIndex(url) + 1);
}

function getIndexOfExtension(url) {
    let end = getSlashIndex(url);
    let i = end;
    let curr = url.charAt(i);
    while(curr != ".") {
        curr = url.charAt(i);
        i--;
    }
    return i + 1;
}

function getKeywords(postExtension) {
    const SLASH = "/";
    const SPACE = " ";
    const DASH = "-";
    const UNDERSCORE = "_";
    const QUESTION = "?";
    const EQUALS = "=";
    const DELIMS = [SLASH, SPACE, DASH, UNDERSCORE, QUESTION, EQUALS];

    let curr = "";
    let words = [];
    for (let i = 0; i < postExtension.length; i++) {
        let str = postExtension.charAt(i);
        if(DELIMS.indexOf(str) > -1) {
            words.push(curr);
            curr = "";
        } else {
            curr += str;
        }
        console.log(curr);
    }
    words.push(curr);
    alert(curr);
}

function getKeywordsFromUrl(url) {
    let temp = getPostExtension(url);
    return getKeywords(temp);
}

function formBaseUrl(url) {
    return getDomain(url) + getExtension(url);
}

function isSiteReputable(baseUrl) {     //base url means domain and extension
    const REPUTABLE_SITES = ["cnn.com", "usa.gov", "bbc.com", "jstor.org"];
    return (REPUTABLE_SITES.indexOf(baseUrl) > -1);
}

function makeGoogleSearchUrl(keyword) {
    return "chrome-extension://jcdkcfhbdgggnllaiognbibcephhfaae/www.google.com/search?q=" + keyword;
}

function httpGetAsync(theUrl, callback)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        //if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        if(true)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function httpFetch(url, callback) {
    fetch(url).then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
}).catch(function() {
  console.log("Error");
});
}

async function simple(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function searchGoogle(keyword) {
    return httpGetAsync(makeGoogleSearchUrl(keyword), same);
}

function same(x) {
    alert(x);
}

//running code starts there
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function
(tabs) {
    let url = tabs[0].url;
    url = formBaseUrl(url);
    document.getElementById("domain").innerHTML = url;

    if(!isSiteReputable(url)) {
        document.getElementById("action").innerHTML = "This site is untrustworthy. Please consider switching to a site below.";
    }
});
