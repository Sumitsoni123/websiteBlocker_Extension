//let blockList = [{ site: "www.youtube.com", time: "10" }, { site: "www.facebook.com", time: "5" }]
let blockList = [];

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == "add") {
            blockList.push({ site: request.site, time: "10" });
            sendResponse(true);
        }
        else if (request.type == "delete") {
            blockList = blockList.filter(function (siteObj) {
                return siteObj.site != request.site;
            });
            sendResponse(true);
        }
        else {
            sendResponse(blockList);
        }

    });

async function polling() {
    console.log(blockList);
    let tab = await getActiveTab();
    //console.log(tab);
    if (tab) {
        let taburl = tab.url;
        for (let i = 0; i < blockList.length; i++) {
            if (taburl.includes(blockList[i].site)) {
                chrome.browserAction.setBadgeText({ text: blockList[i].time + "" });
                blockList[i].time--;
                if (blockList[i].time <= 0) {
                    chrome.browserAction.setBadgeText({ text: blockList[i].time + "" });
                    await deleteActiveTab(tab.id);
                }
            }
        }
    }

}

function deleteActiveTab(tabId) {
    return new Promise(function (resolve, reject) {
        chrome.tabs.remove(tabId, function () {
            resolve();
        });
    })
}

function getActiveTab() {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            resolve(tabs[0]);
        });
    })
}

setInterval(polling, 1000);