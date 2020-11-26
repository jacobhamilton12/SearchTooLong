let search = "";

document.addEventListener('DOMContentLoaded', function() {
    let input = document.getElementById("query");
    input.addEventListener('input', filterWords);
    document.getElementById("1").addEventListener('click', google);
    document.getElementById("2").addEventListener('click', duckduckgo);
});

function google(e) {
    browser.search.search({
        query: search,
        engine: "Google"
    });
}

function duckduckgo(e) {
    browser.search.search({
        query: search,
        engine: "DuckDuckGo"
    });
}

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function makedic(arr) {
    let dic = {};
    for (let i = 0; i < arr.length; i++) {
        dic[arr[i]] = i;
    }
    return dic;
}

function filterWords() {
    search = document.getElementById("query").value;
    search = search.toLowerCase();
    search = search.replace(/\s/g, " ");
    search = search.replace(/[^0-9a-z']/g, " ");
    search = search.replace(/\s'/, " ");
    search = search.replace(/'\s/, " ");

    //search = search.replace(re, " ");
    search = search.replace("  ", " ");
    search = Array.from(new Set(search.split(" "))).join(" ");
    let arr = search.split(" ");
    let dic = makedic(arr);
    let wordFreqs = loadFile("freq.csv").split("\n");

    let index = 1;
    while (arr.length > 32) {
        for (index; index < 10000; index++) {
            if (wordFreqs[index].substr(0, wordFreqs[index].indexOf(",")) in dic) {
                arr.splice(dic[wordFreqs[index].substr(0, wordFreqs[index].indexOf(","))], 1);
                dic = makedic(arr);
                break;
            }
        }
        if (index == 10000) {
            arr.splice(arr.length - 1, 1);
        }
    }
    search = arr.join(" ");
    //search = search.replaceAll(/[^\s]{15,}[\s]*/g, m => `\"${m.trim()}\" `);
    document.getElementById("result").textContent = search;
}