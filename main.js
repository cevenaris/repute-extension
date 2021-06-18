const SAFE = ["usa.gov", "time.com", "jstor.org"];
const SEARCH = ["https://search.usa.gov/search?affiliate=usagov&query=",
                "https://time.com/search/?q=",
                "https://www.jstor.org/action/doBasicSearch?Query="];
let currKeyword = "";

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
    const AND = "&";
    const DOT = "."
    const HASH = "#"
    const DELIMS = [SLASH, SPACE, DASH, UNDERSCORE, QUESTION, EQUALS, AND, DOT, HASH];

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
    return words;
}

function getKeywordsFromUrl(url) {
    let temp = getPostExtension(url);
    return getKeywords(temp);
}

function formBaseUrl(url) {
    return getDomain(url) + getExtension(url);
}

function isSiteReputable(baseUrl) {     //base url means domain and extension
    return (SAFE.indexOf(baseUrl) > -1);
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

function unique(a) {
    var seen = [];
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function modifySearchUrls(newKeyword, button) {
    document.getElementById("search1").innerHTML = `<a href="${SEARCH[0] + newKeyword}" target="_blank">Search for ${newKeyword}</a>`
    document.getElementById("search2").innerHTML = `<a href="${SEARCH[1] + newKeyword}" target="_blank">Search for ${newKeyword}</a>`
    document.getElementById("search3").innerHTML = `<a href="${SEARCH[2] + newKeyword}" target="_blank">Search for ${newKeyword}</a>`
}


//running code starts here
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function
(tabs) {
    let fullUrl = tabs[0].url;
    let url = formBaseUrl(fullUrl);
    document.getElementById("domain").innerHTML = url;

    if(!isSiteReputable(url)) {
        document.getElementById("action").innerHTML = "This site is untrustworthy. Please consider switching to a site below by clicking the keyword buttons.";
    } else {
        document.getElementById("alternatives").style.display = "none";
        document.getElementById("sources").style.display = "none";
    }

    let keywords = getKeywordsFromUrl(fullUrl);
    keywords = unique(keywords);
    currKeyword = keywords[0];
    let active;
    let outer = document.getElementById("keywords");
    if(keywords.length < 1 || keywords[0] == "") {
        let element = document.createElement("p");
        let node = document.createTextNode("No keywords found from url.");
        element.appendChild(node);
        outer.appendChild(element);
    } else {
        for(let i = 0; i < keywords.length; i++) {
            let temp = keywords[i];
            let element = document.createElement("button");
            let node = document.createTextNode(temp);
            element.appendChild(node);
            element.addEventListener("click",  function() {
                modifySearchUrls(temp);
                if(active != null && active != undefined) {
                    active.style.background = "#ECE0BF";
                }
                element.style.background = "black";
                active = element;
            });
            outer.appendChild(element);
        }
    }
});
