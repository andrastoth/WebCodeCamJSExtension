(function() {
    'use strict';
    var viewFinderWindowID = null;
    var decoder = null;
    var defaultSettings = {
        Resultfunction: ['var focused = document.querySelector(":focus");', 'if (focused && ["input", "textarea"].indexOf(focused.tagName.toLowerCase()) !== -1){', '    focused.value = res.code;', '}'].join('\n'),
        autoBrightnessValue: 0,
        brightness: 0,
        successTimeout: 500,
        codeRepetition: 1,
        constraints: {
            video: {
                mandatory: {
                    maxWidth: 1280,
                    maxHeight: 720
                },
                optional: [{
                    sourceId: true
                }]
            },
            audio: 0
        },
        contrast: 0,
        decodeBarCodeRate: 3,
        decodeQRCodeRate: 5,
        flipHorizontal: 0,
        flipVertical: 0,
        frameRate: 15,
        grayScale: 0,
        height: 240,
        threshold: 0,
        width: 320,
        zoom: 0
    };
    chrome.runtime.onInstalled.addListener(function(object) {
        chrome.storage.local.get('settings', function(i) {
            if (i.settings === undefined) {
                chrome.storage.local.set({
                    settings: defaultSettings,
                    'isRunning': false
                }, null);
                var url = chrome.extension.getURL('options.html');
                chrome.tabs.query({
                    url: url
                }, function(tabs) {
                    if (tabs.length) {
                        chrome.tabs.update(tabs[0].id, {
                            active: true
                        });
                    } else {
                        chrome.tabs.create({
                            url: url
                        });
                    }
                });
            }
        });
    }, false);
    chrome.windows.onRemoved.addListener(function(winID) {
        if (viewFinderWindowID === winID) {
            if (decoder) {
                decoder.stop();
                decoder = null;
            }
            chrome.storage.local.set({
                'isRunning': false
            }, function() {
                chrome.browserAction.setIcon({
                    path: 'css/images/icon16-gray.png'
                });
                chrome.extension.sendMessage({
                    order: 'viewFinderClosed'
                }, null);
            });
        }
    }, false);
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.order == 'initViewFinder') {
            viewFinderWindowID = request.viewFinderWindowID;
            sendResponse(request);
        }
        if (request.order == 'getResultFromDecoder') {
            chrome.tabs.query({
                active: true
            }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    order: 'getResultFromDecoder',
                    func: request.func,
                    result: request.result
                }, null);
            });
        }
        if (request.order == 'openResultInNewWindow') {
            chrome.tabs.query({
                active: true
            }, function(tabs) {
                chrome.tabs.create({
                    url: request.result.code
                });
            });
        }
    }, false);
})();