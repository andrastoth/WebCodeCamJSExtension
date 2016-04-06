(function() {
    'use strict';
    var camera = document.querySelector('#camera'),
        scannerLaser = document.querySelectorAll('.scanner-laser'),
        playPause = document.querySelector('#play-pause'),
        playStop = document.querySelector('#play-stop'),
        resultText = document.querySelector('.result-text'),
        decoder = null;

    function fadeOut(el, v) {
        el.style.opacity = 1;
        (function fade() {
            if ((el.style.opacity -= 0.1) < v) {
                el.style.display = "none";
                el.classList.add("is-hidden");
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    function fadeIn(el, v, display) {
        if (el.classList.contains("is-hidden")) {
            el.classList.remove("is-hidden");
        }
        el.style.opacity = 0;
        el.style.display = display || "block";
        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += 0.1) > v)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }

    function zoomCanvasToWindow() {
        camera.style.zoom = window.innerWidth / camera.width;
        camera.style.top = ((window.innerHeight - (camera.height * camera.style.zoom)) / 2 / camera.style.zoom).toString().concat('px');
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

    function showAndSendResultToExtension(res, i) {
        chrome.extension.sendMessage({
            order: 'getResultFromDecoder',
            func: i.settings.Resultfunction,
            result: res
        }, null);
        resultText.textContent = res.format + ": " + res.code;
        setTimeout(function() {
            resultText.textContent = '';
        }, 1200);
        [].forEach.call(scannerLaser, function(el) {
            fadeOut(el, 0.5);
            setTimeout(function() {
                fadeIn(el, 0.5);
            }, 300);
        });
    }
    window.addEventListener('resize', zoomCanvasToWindow, false);
    playPause.addEventListener('click', playListener, false);
    playStop.addEventListener('click', stopListener, false);
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.order == 'closeDecoderCamera') {
            sendResponse(true);
            window.close();
        }
    }, false);
    chrome.storage.sync.get('settings', function(i) {
        decoder = new WebCodeCamJS(camera).init(i.settings).play();
        window.resizeTo(decoder.options.width + 16, decoder.options.height + 35);
        decoder.options.resultFunction = function(res) {
            setTimeout(showAndSendResultToExtension.bind(null, res, i), 0);
        }
    });
})();