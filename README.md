# aframe-lensflare-component

[![Version](http://img.shields.io/npm/v/aframe-lensflare-component.svg?style=flat-square)](https://npmjs.org/package/aframe-lensflare-component) [![License](http://img.shields.io/npm/l/aframe-lensflare-component.svg?style=flat-square)](https://npmjs.org/package/aframe-lensflare-component)

A component to add a configurable lens-flare (and optional light) to an entity that wraps THREE.JS Lensflares.
Examples: [See Here] (https://mokargas.github.io/aframe-lensflare-component)

For [A-Frame](https://aframe.io).

![Example of Lensflares](https://github.com/mokargas/aframe-lensflare-component/tree/dev/examples/basic/images/aframe-lensflare-low.gif "Example of Lensflares")

## API

Property      | Description                                                                                                   | Default Value
------------- | ------------------------------------------------------------------------------------------------------------- | --------------------
src           | Asset Image to use                                                                                            | none
createLight   | Whether to create a light along with this flare                                                               | true
position      | This is the position of the flare.                                                                            | true
relative      | Whether to position this flare relative to the parent entity (The position property above becomes an *offset* ) | true
target        | DOM id of the object to point the Flare's spotlight at                                                        | none
size          | Size of the flare graphic (Use power of 2 images for best results)                                                                                     | 500
intensity     | If using `createLight:true`, this is the intensity of the light emitted | 5
lightType     | If using `createLight:true`, this is a string corresponding to A-Frame light types. Either  'directional', 'point', 'spot'                                                    | 'spot'
lightColor    | If `createLight:true`, Color of the light and (currently) flare tint                                                                     | 'rgb(255, 255, 255)'
lightDistance | Distance of the light (if enabled)                                                                            | 500
lightAngle    | Maximum extent of the light in radians (from its direction). Valid for directional and spotlight type lights                                                  | PI/3
lightPenumbra | If using `createLight:true`: Percent of the light cone that is attenuated due to penumbra. Takes values between zero and 1. Valid only for spotlights               | 0.077
lightDecay    | If using `createLight:true`: The amount the light dims along the light's distance                                                          | 1

## Installation

### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-lensflare-component/dist/aframe-lensflare-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-assets>
        <img src="images/flare.jpg" alt="Test Lensflare Asset" id="flare-asset">
    </a-assets>
    <a-sky color="#000000"></a-sky>
    <a-sphere id="flare" radius="0.05" color="red" lensflare="createLight:true; relative: true; src: #flare-asset; position:0.0 0.0 0.06; lightColor:red" position="2 2 -4"></a-sphere>
    <a-sphere id="flare" radius="0.05" lensflare="createLight:true; relative: true; src: #flare-asset; position:0.0 0.0 0.06" position="0 2 -4"></a-sphere>
    <a-sphere id="flare" radius="0.05" color="blue" lensflare="createLight:true; relative: true; src: #flare-asset; position:0.0 0.0 0.06; lightColor:blue" position="-2 2 -4"></a-sphere>


    <a-plane id="ground" position="0 0 -4" rotation="-90 0 0" width="8" height="8" color="#111111" material="metalness: 0.4"></a-plane>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. --> <!-- Or with [angle](https://npmjs.com/package/angle/), you can install the proper version of the component straight into your HTML file, respective to your version of A-Frame: ```sh angle install aframe-lensflare-component ``` -->

 ### npm

Install via npm:

```bash
npm install aframe-lensflare-component
```

Then require and use.

```javascript
require('aframe');
require('aframe-lensflare-component');

//Or if supported by your stack (babel, webpack):

import 'aframe';
import 'aframe-lensflare-component';

```

## TODO

- Seperate Flare colorisation and Light Color
