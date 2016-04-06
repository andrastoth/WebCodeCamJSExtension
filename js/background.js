(function() {
    'use strict';
    var cameraWindowID = null;
    var decoder = null;
    chrome.runtime.onInstalled.addListener(function(object) {
        chrome.storage.sync.get('settings', function(i) {
            if (i.settings === undefined) {
                chrome.storage.sync.set({
                    settings: {
                        Resultfunction: ['var focused = document.querySelector(":focus");', 
                                         'if (focused && ["input", "textarea"].indexOf(focused.tagName.toLowerCase()) !== -1){', 
                                         '    focused.value = res.code;', '}'].join('\n'),
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
                    },
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
        if (cameraWindowID === winID) {
            if (decoder) {
                decoder.stop();
                decoder = null;
            }
            chrome.storage.sync.set({
                'isRunning': false
            }, function() {
                chrome.browserAction.setIcon({
                    path: 'css/images/icon16-gray.png'
                });
                chrome.extension.sendMessage({
                    order: 'decoderCameraClosed'
                }, null);
            });
        }
    }, false);
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.order == 'initDecoderCamera') {
            cameraWindowID = request.cameraWindowID;
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
                }, function(req) {});
            });
        }
    }, false);
})();