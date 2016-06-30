// update on URL update
chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
    changeAction(tab)
});

// update on selection change
chrome.tabs.onSelectionChanged.addListener(function (tabId, info) {
    chrome.tabs.getSelected(null, function (tab) {
        changeAction(tab)
    });
});

function changeAction(tab) {
    var tabId = tab.id;
    var title = "Click to check";
    var text = "?";
    var badgeColor = [120, 120, 120, 200];
    var alienIcon = {'19': "images/alien_apathy19.png", '38': "images/alien_apathy38.png"};

    chrome.browserAction.setTitle({"title": title, "tabId": tabId})
    chrome.browserAction.setBadgeBackgroundColor({
        "color": badgeColor,
        "tabId": tabId
    });
    chrome.browserAction.setBadgeText({
        "text": text,
        "tabId": tabId
    });
    chrome.browserAction.setIcon({
        "path": alienIcon,
        "tabId": tabId
    });

}
