(function() {
    'use strict';
    var enable = document.getElementById('enable'),
        settings = document.getElementById('settings'),
        viewFinderId = false;

    function changeStateMessage(request, sender, sendResponse) {
        if (request.order == 'viewFinderClosed') {
            viewFinderId = false;
            changeState(viewFinderId);
        }
    }

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
        if (!viewFinderId) {
            chrome.windows.create({
                url: "viewFinder.html",
                type: "popup",
                top: screen.height - 5,
                left: screen.width - 5,
                width: 300,
                height: 200
            }, function(w) {
                chrome.extension.sendMessage({
                    order: 'initViewFinder',
                    viewFinderWindowID: w.id
                }, function(req) {
                    viewFinderId = w.id;
                    changeState(viewFinderId);
                });
            });
        } else if (viewFinderId) {
            chrome.extension.sendMessage({
                order: 'closeDecoderviewFinder'
            }, function(req) {
                viewFinderId = false;
                changeState(viewFinderId);
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
        viewFinderId = st;
        chrome.storage.local.set({
            'isRunning': st
        }, null);
    }

    function storageLocalGet(i) {
        chrome.windows.getAll(function(wins) {
            var find = wins.find(function(win) {
                return i.isRunning === win.id;
            });
            viewFinderId = find ? find.id : false;
            changeState(viewFinderId);
        });
    }
    chrome.extension.onMessage.addListener(changeStateMessage, false);
    enable.addEventListener('click', setState, false);
    settings.addEventListener('click', openSettings, false);
    chrome.storage.local.get('isRunning', storageLocalGet);
})();