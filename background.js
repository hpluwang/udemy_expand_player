
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes("udemy.com")) {
        chrome.tabs.sendMessage(tabId, {action: 'reloadSettings'}, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error sending message:', chrome.runtime.lastError);
            } else {
                console.log('Settings reloaded for tab:', tabId);
            }
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.tabs.query({active: true}, (tabs) => {
        if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
        } else {
            console.error('No active tabs found.');
        }
    });
    return true; 
});
