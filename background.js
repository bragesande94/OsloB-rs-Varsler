chrome.runtime.onMessage.addListener(
    function(response, sender, sendResponse) {
        refresh_interval = response.refresh_interval;
        var data = {}
        data['refresh_interval'] = refresh_interval
        chrome.storage.local.set(data, function() {
        });
        return true;
    }
);