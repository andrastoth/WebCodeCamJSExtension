(function() {
    'use strict';

    function onMessage(request, sender, sendResponse) {
        if (request.order == "sendResultFromDecoder") {
            window.eval.call(window, ['(function (res) {', request.func, '})'].join(''))(request.result);
            sendResponse(request);
        }
    }
    chrome.extension.onMessage.addListener(onMessage, false);
})();