(function() {
    'use strict';
    var Orders = (function() {
        return {
            sendResultFromDecoder: 0,
            openResultInNewWindow: 1,
            collectForDownload: 2
        }
    })();
    var viewFinder = document.querySelector('#view-finder'),
        scannerLaser = document.querySelectorAll('.scanner-laser'),
        playPause = document.querySelector('#play-pause'),
        playStop = document.querySelector('#play-stop'),
        resultText = document.querySelector('.result-text'),
        openLink = document.querySelector('#open-link'),
        actionSelector = document.querySelector('.action-selector'),
        collectedCodes = [],
        decoder = null;

    function getActionIndex() {
        var chk = document.querySelector('input:checked');
        if (chk) {
            chk = chk.value;
        }
        return chk ? parseInt(chk) : 0;
    }

    function changeActionSelector(arg) {
        setTimeout(function() {
            actionSelector.style.display = arg ? 'block' : 'none';
        }, !arg ? 300 : 0);
        setTimeout(function() {
            actionSelector.querySelector('div').style.left = arg ? 0 : '100%';
            actionSelector.querySelector('div').style.opacity = arg;
            actionSelector.style.opacity = arg;
        }, arg ? 300 : 0);
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,'.concat(encodeURIComponent(text)));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function fadeOut(els, v) {
        [].forEach.call(els, function(el) {
            el.style.opacity = 0;
            setTimeout(function() {
                el.style.opacity = 0.5;
            }, v);
        });
    }

    function zoomCanvasToWindow() {
        viewFinder.style.zoom = window.innerWidth / viewFinder.width;
        viewFinder.style.top = ((window.innerHeight - (viewFinder.height * viewFinder.style.zoom)) / 2 / viewFinder.style.zoom).toString().concat('px');
    }

    function playListener(e) {
        if (playPause.className == 'play') {
            playPause.className = 'pause'
            decoder.play();
            window.document.title = 'WCCJSEXT - Running';
        } else {
            playPause.className = 'play'
            decoder.pause();
            window.document.title = 'WCCJSEXT - Paused';
        }
    }

    function stopListener() {
        window.close();
    }

    function setResultText(res) {
        resultText.textContent = res.format + ": " + res.code;
        setTimeout(function() {
            resultText.textContent = '';
        }, 1200);
        fadeOut(scannerLaser, 300);
    }

    function showAndSendResultToExtension(res, i) {
        var actionIndex = getActionIndex();
        if (actionIndex === Orders.collectForDownload) {
            collectedCodes.push(res.code);
        } else if (actionIndex !== Orders.openResultInNewWindow || isValidURL(res.code)) {
            chrome.extension.sendMessage({
                order: Object.keys(Orders)[actionIndex],
                func: i.settings.Resultfunction,
                result: res
            }, null);
        }
        setResultText(res);
    }

    function openLinkChange() {
        var actionIndex = getActionIndex();
        if (actionIndex === Orders.collectForDownload) {
            if (collectedCodes.length) {
                download('scan_'.concat(new Date().getTime()), collectedCodes.join('\n\r'));
                collectedCodes = [];
            } else {
                setResultText({
                    format: 'Error',
                    code: 'There are no scanned data!'
                });
                setTimeout(changeActionSelector.bind(null, 1), 300);
            }
        } else {
            changeActionSelector(1);
        }
    }

    function onMessage(request, sender, sendResponse) {
        if (request.order == 'closeDecoderviewFinder') {
            sendResponse(true);
            window.close();
        }
    }

    function storageLocalGet(i) {
        decoder = new WebCodeCamJS(viewFinder).init(i.settings).play();
        window.resizeTo(decoder.options.width + 16, decoder.options.height + 35);
        decoder.options.resultFunction = function(res) {
            setTimeout(showAndSendResultToExtension.bind(null, res, i), 0);
        }
    }

    function isValidURL(str) {
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        return regex.test(str);
    }
    window.addEventListener('resize', zoomCanvasToWindow, false);
    playPause.addEventListener('click', playListener, false);
    playStop.addEventListener('click', stopListener, false);
    openLink.addEventListener('click', openLinkChange, false);
    actionSelector.addEventListener('click', changeActionSelector.bind(null, 0), false);
    chrome.extension.onMessage.addListener(onMessage, false);
    chrome.storage.local.get('settings', storageLocalGet);
})();