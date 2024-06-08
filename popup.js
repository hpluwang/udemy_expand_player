document.addEventListener('DOMContentLoaded', () => {
    const expandPlayerCheckbox = document.getElementById('expandPlayer');
    const hideTopNavCheckbox = document.getElementById('hideTopNav');

    // Load saved settings on page load
    chrome.storage.sync.get(['expandPlayer', 'hideTopNav'], (data) => {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving storage:', chrome.runtime.lastError);
            return;
        }
        console.log('Loaded settings:', data);
        expandPlayerCheckbox.checked = data.expandPlayer || false;
        hideTopNavCheckbox.checked = data.hideTopNav || false;

        // Apply loaded settings to content script
        sendMessageToContentScript({action: 'expandPlayer', value: expandPlayerCheckbox.checked});
        sendMessageToContentScript({action: 'hideTopNav', value: hideTopNavCheckbox.checked});
    });

    expandPlayerCheckbox.addEventListener('change', () => {
        const value = expandPlayerCheckbox.checked;
        console.log('Expand Player checkbox changed:', value);
        chrome.storage.sync.set({expandPlayer: value}, () => {
            if (chrome.runtime.lastError) {
                console.error('Error setting storage:', chrome.runtime.lastError);
                return;
            }
            sendMessageToContentScript({action: 'expandPlayer', value: value});
        });
    });

    hideTopNavCheckbox.addEventListener('change', () => {
        const value = hideTopNavCheckbox.checked;
        console.log('Hide Top Nav checkbox changed:', value);
        chrome.storage.sync.set({hideTopNav: value}, () => {
            if (chrome.runtime.lastError) {
                console.error('Error setting storage:', chrome.runtime.lastError);
                return;
            }
            sendMessageToContentScript({action: 'hideTopNav', value: value});
        });
    });

    // Function to send message to content script
    function sendMessageToContentScript(message) {
        console.log('Sending message to content script:', message);
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message:', chrome.runtime.lastError);
                    } else {
                        console.log('Response from content script:', response);
                    }
                });
            } else {
                console.error('No active tabs found.');
            }
        });
    }
});
