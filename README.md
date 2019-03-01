# parcel-plugin-workbox-precache

Parcel plugin that generates a precache manifest of the bundle and
prepends it to a `service_worker.js` file.

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
workbox. It expects an output named `service_worker.js` after the
Parcel bundler has been run. It prepends a `importScripts` of workbox
from the Google CDN, injects the generated precache manifest and
instructs workbox to use that manifest to precache the resources.

Note that this plugin does not work with multiple entry assets.

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
workbox.core.skipWaiting();
```

```bash
parcel index.html
```
