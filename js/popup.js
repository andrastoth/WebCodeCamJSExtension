(function() {
    'use strict';
    var enable = document.getElementById('enable'),
        settings = document.getElementById('settings'),
        state = false;
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.order == 'decoderCameraClosed') {
            state = false;
            changeState();
        }
    }, false);
    enable.addEventListener('click', setState, false);
    settings.addEventListener('click', openSettings, false);

    function openSettings() {
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

    function setState() {
        if (!state) {
            chrome.windows.create({
                url: "camera.html",
                type: "popup",
                top: screen.height - 5,
                left: screen.width - 5,
                width: 300,
                height: 200
            }, function(w) {
                chrome.extension.sendMessage({
                    order: 'initDecoderCamera',
                    cameraWindowID: w.id
                }, function(req) {
                    changeState(true);
                });
            });
        } else if (state) {
            chrome.extension.sendMessage({
                order: 'closeDecoderCamera'
            }, function(req) {
                changeState(false);
            });
        }
    }

    function changeState(st) {
        chrome.browserAction.setIcon({
            path: 'css/images/icon' + (st ? '48.png' : '48-gray.png')
        });
        enable.classList.remove(st ? 'btn-default' : 'btn-green');
        enable.classList.add(st ? 'btn-green' : 'btn-default');
        enable.children[0].innerText = enable.children[0].innerText.replace(st ? 'Stopped' : 'Running', st ? 'Running' : 'Stopped');
        saveIsRunning(st);
    }

    function saveIsRunning(st) {
        state = st;
        chrome.storage.sync.set({
            'isRunning': st
        }, null);
    }
    chrome.storage.sync.get('isRunning', function(i) {
        state = i.isRunning;
        changeState(state);
    });
})();