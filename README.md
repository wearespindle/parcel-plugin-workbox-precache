# parcel-plugin-workbox-precache

Parcel plugin that generates a precache manifest of the bundle and
injects it in the `service_worker.js` file.

## Installation

```Shell
$ npm i -d parcel-plugin-workbox-precache
```
or
```Shell
$ yarn add --dev parcel-plugin-workbox-precache
```

_Attention: parcel-bundler has to be installed_

## Usage

This module can be used to generate a precache manifest for use with
workbox. It expects an asset named `service_worker.js` after the
Parcel bundler has been run. It injects a `importScripts` of workbox
from the Google CDN and injects a generated precache manifest as a
constant named `precacheManifest`.

The script is injected in the head of the service worker
file. Injected code is surrounded with the comments `//BEGIN workbox`
and `//END workbox`, when the comments are found the code is injected
between them. This is to make sure that `parcel dev` works as
expected.

Note that this plugin probably does not work with multiple entry
assets.

### Example

_**index.html**_

```html
<html>
<head>
<script src="./index.js"></script>
</head>
<body>
</body>
</html>
```

_**index.js**_

```javascript
navigator.serviceWorker.register('/service_worker.js');
```

_**service_worker.js**_
```javascript
/* global self, workbox, precacheManifest */
workbox.precacheAndRoute(precacheManifest);
```
