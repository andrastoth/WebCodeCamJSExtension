(function() {
    'use strict';
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.order == "getResultFromDecoder") {
            window.eval.call(window, ['(function (res) {', request.func, '})'].join(''))(request.result);
            sendResponse(request);
        }
    }, false);
})();