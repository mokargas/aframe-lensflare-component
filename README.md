## aframe-lensflare-component

[![Version](http://img.shields.io/npm/v/aframe-lensflare-component.svg?style=flat-square)](https://npmjs.org/package/aframe-lensflare-component)
[![License](http://img.shields.io/npm/l/aframe-lensflare-component.svg?style=flat-square)](https://npmjs.org/package/aframe-lensflare-component)

A component to add a configurable lens-flare (and optional light) to an entity that wraps THREE.JS lens-flares

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-lensflare-component/dist/aframe-lensflare-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity lensflare="foo: bar"></a-entity>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. -->
<!--
Or with [angle](https://npmjs.com/package/angle/), you can install the proper
version of the component straight into your HTML file, respective to your
version of A-Frame:

```sh
angle install aframe-lensflare-component
```
-->

#### npm

Install via npm:

```bash
npm install aframe-lensflare-component
```

Then require and use.

```js
require('aframe');
require('aframe-lensflare-component');
```
