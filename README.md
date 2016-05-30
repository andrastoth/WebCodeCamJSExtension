#  WebCodeCamJS Chrome Extension

### The popular [WebCodeCamJS] as a chrome extension.
Use WebCodeCamJS on ewery web pages with minimal coding.

[chrome web store]

Version
----

1.6.0

- Some invisible modification

Version
----

1.5.0

- Add new functions to ViewFinder
	- click icon to open result handler options
		- Inject the code (result function)
		- Go to URL (if code is url, open url in new tab)
		- Collect codes and download (download: If the codes are collected, click the icon again)

- Options
    - decode QRCode Rate: min=0 max=15 step=1 default=5/sec
    - decode BarCode Rate: min=0 max=15 step=1 default=3/sec
    - frame Rate: min=1 max=30 step=1 default=15/sec
    - width: default=320 px
    - height: default=240 px
    - success Timeout: min=0 max=10000 step=1 default=500 ms
    - code Repetition: min=0 max=1 step=1 default=0 (off)
    - flip Vertical: min=0 max=1 step=1 default=0 (off)
    - flip Horizontal: min=0 max=1 step=1 default=0 (off)
    - zoom: min=0 max=5 step=0.1 default=0 (auto)
    - brightness: min=-128 max=128 step=1 default=0 (off)
    - auto Brightness value: min=0 max=256 step=1 default=0 (off)
    - grayScale: min=0 max=1 step=1 default=0 (off)
    - contrast: min=-128 max=128 step=1 default=0 (off)
    - threshold: tmin=0 max=1024 step=1 default=0 (off)
    - Result function: code to inject (default: focused input or textarea)

- [Homepage]
- [WebCodeCamJS]

###### Popup:
<img src = "wccjs1.JPG" width="100%"/>
###### Options (Settings):
<img src = "wccjs2.JPG" width="100%"/>
###### ViewFinder Options:
<img src = "wccjs3.JPG" width="100%"/>
###### Open link using ViewFinder:
<img src = "wccjs4.JPG" width="100%"/>

Included decoders
-----------
- barcode decoder ([DecoderWorker.js])
- qr-decoder ([qrcodelib.js])

License
----

MIT

Author: Tóth András
---
http://atandrastoth.co.uk/

2016-04-06

[Homepage]:http://atandrastoth.co.uk/main/pages/plugins/webcodecamjs/
[WebCodeCamJS]:https://andrastoth.github.io/webcodecamjs/
[DecoderWorker.js]:https://github.com/EddieLa/BarcodeReader
[qrcodelib.js]:https://github.com/LazarSoft/jsqrcode
[chrome web store]:https://chrome.google.com/webstore/detail/webcodecamjs-extension/iakljebmlbbedbflhifhmkbfcbpkippl
