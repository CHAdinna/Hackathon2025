chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "navigate" && message.page) {
        chrome.action.setPopup({ popup: message.page });
        sendResponse({ success: true });
    }
});
