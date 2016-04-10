(function() {
    'use strict';
    var save = document.querySelector('#save'),
        test = document.querySelector('#test'),
        tbl = document.querySelector('table'),
        handlers = document.querySelector('#handlers'),
        camSelector = document.querySelector('#cam-selector'),
        decoder = new WebCodeCamJS("canvas").buildSelectMenu('select', 'environment|back');

    function getSettings() {
        var settings = {};
        [].forEach.call(document.querySelectorAll('[data-settings="false"] th'), function(s, indexTh) {
            var val = [].find.call(document.querySelectorAll('[data-settings="true"] td'), function(i, indexTd) {
                return indexTd == indexTh;
            }).children[0].value;
            settings[s.innerText.replace(/\s/g, '')] = isNaN(val) ? val : Number(val);
        });
        settings['constraints'] = {
            video: {
                mandatory: {
                    maxWidth: 1280,
                    maxHeight: 720
                },
                optional: [{
                    sourceId: document.querySelector('select').value
                }]
            },
            audio: false
        };
        return settings;
    }

    function loadSettings() {
        var dataCells = document.querySelectorAll('[data-settings="true"] td');
        chrome.storage.local.get('settings', function(i) {
            if (i.settings && Object.keys(i.settings).length) {
                [].forEach.call(document.querySelectorAll('[data-settings="false"] th'), function(s, indexTh) {
                    [].find.call(document.querySelectorAll('[data-settings="true"] td'), function(i, indexTd) {
                        return indexTd == indexTh;
                    }).children[0].value = i.settings[s.innerText.replace(/\s/g, '')];
                });
            } else {
                saveSettings();
            }
        });
    }

    function saveSettings() {
        chrome.storage.local.set({
            'settings': getSettings()
        }, loadSettings);
    }

    function playStop(rep) {
        if (!decoder.isInitialized()) {
            decoder.init(getSettings());
            decoder.options.resultFunction = function(res) {
                document.querySelector('#result').innerText = res.format + ": " + res.code;
            }
        }
        var str = [].indexOf.call(test.classList, 'btn-green') !== -1 ? true : false;
        test.classList.remove(str && !rep ? 'btn-green' : 'btn-orange');
        test.classList.add(str && !rep ? 'btn-orange' : 'btn-green');
        test.innerText = str && !rep ? 'Stop' : 'Test';
        str && !rep ? decoder.play() : decoder.stop();
    }

    function tblOnChange() {
        var settings = getSettings();
        if (decoder.isInitialized()) {
            Object.keys(settings).forEach(function(key) {
                if (key != 'resultFunction') {
                    decoder.options[key] = settings[key];
                }
            });
        }
    }
    loadSettings();
    tbl.on('change', '[data-settings="true"] td input', tblOnChange);
    save.addEventListener('click', saveSettings, false);
    test.addEventListener('click', playStop.bind(null, false), false);
    camSelector.addEventListener('change', playStop.bind(null, true), false);
})();