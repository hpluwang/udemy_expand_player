// Expand the player
function expandPlayer(expand) {
    const playerContainers = document.querySelectorAll(".curriculum-item-view--scaled-height-limiter--lEOjL");
    
    playerContainers.forEach(playerContainer => {
        if (expand) {
            if (playerContainer) {
                playerContainer.style.setProperty('height', '90vh', 'important');
                playerContainer.style.setProperty('max-height', '90vh', 'important');
                forceReflow(playerContainer); // Force reflow
            }
        } else {
            if (playerContainer) {
                playerContainer.style.removeProperty('height');
                playerContainer.style.removeProperty('max-height');
                forceReflow(playerContainer); // Force reflow
            }
        }
    });
}

// Hide the top navigation
function hideTopNav(hide) {
    const topHeader = document.querySelector(".app--row--E-WFM.app--header--QuLOL");
    const sidebarColumn = document.querySelector(".app--column-container--42JNg .app--sidebar-column--gfbWJ");
    
    if (hide) {
        if (topHeader) topHeader.style.display = "none";
        if (sidebarColumn) sidebarColumn.style.top = "0";
        forceReflow(sidebarColumn); // Force reflow
    } else {
        if (topHeader) topHeader.style.removeProperty('display');
        if (sidebarColumn) sidebarColumn.style.removeProperty('top');
        forceReflow(sidebarColumn); // Force reflow
    }
}

// Force reflow
function forceReflow(element) {
    element.offsetHeight; // Read height to force reflow
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Clicked checkboxes!')
    if (request.action === "expandPlayer") {
        expandPlayer(request.value);
    }
    if (request.action === "hideTopNav") {
        hideTopNav(request.value);
    }
    sendResponse({status: "done"});
});

// Add listener for reloading settings after page refresh
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Reload Settings')
    if (message.action === 'reloadSettings') {
        if (message.action === "expandPlayer") {
            expandPlayer(message.value);
        }
        if (message.action === "hideTopNav") {
            hideTopNav(message.value);
        }
        sendResponse({status: "done"});
    }
});



// Apply settings on page load
chrome.storage.sync.get(['expandPlayer', 'hideTopNav'], (data) => {
    console.log('Get from storage.')
    
    if (data.expandPlayer !== undefined) {
        expandPlayer(data.expandPlayer);
    }
    if (data.hideTopNav !== undefined) {
        hideTopNav(data.hideTopNav);
    }
});
