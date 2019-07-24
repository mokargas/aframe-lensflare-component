/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/* global AFRAME */
	/* global THREE */
	
	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}
	
	if (typeof THREE === 'undefined') {
	  throw new Error('Component attempted to register before THREE was available.');
	}
	
	//https://github.com/mrdoob/three.js/blob/master/examples/js/objects/Lensflare.js
	__webpack_require__(1);
	
	/**
	 * A-Frame Lensflare Component component for A-Frame.
	 */
	AFRAME.registerComponent('lensflare', {
	  schema: {
	    src: {
	      type: 'asset'
	    },
	    createLight: {
	      type: 'boolean',
	      default: true
	    },
	    position: {
	      type: 'vec3'
	    },
	    target: {
	      type: 'string'
	    },
	    intensity: {
	      type: 'number',
	      default: 5
	    },
	    relative: {
	      type: 'boolean',
	      default: true
	    },
	    size: {
	      type: 'number',
	      default: 500
	    },
	    lightColor: {
	      type: 'string',
	      default: 'rgb(255, 255, 255)'
	    },
	    lightDistance: {
	      type: 'number',
	      default: 4.0
	    },
	    lightAngle: {
	      type: 'number',
	      default: Math.PI / 3
	    },
	    lightPenumbra: {
	      type: 'number',
	      default: 0.077
	    },
	    lightDecay: {
	      type: 'number',
	      default: 1
	    },
	    lightType: {
	      default: 'spot',
	      oneOf: ['directional', 'point', 'spot']
	    }
	  },
	
	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: true,
	
	  /**
	   * setLightType - Create a light based on lightType
	   *
	   * @param  {String} type Type of the light, supplied as a string.
	   * @param  {Object} settings Additional settings to pass to the light. E.g. angle and decay
	   * @return {THREE.Light}  A THREE.JS light object
	   */
	  setLightType: function setLightType(type, settings) {
	    switch (type) {
	      case 'spot':
	        return new THREE.SpotLight(new THREE.Color(settings.lightColor), settings.intensity, settings.lightDistance, settings.lightAngle, settings.lightPenumbra, settings.lightDecay);
	      case 'point':
	        return new THREE.PointLight(new THREE.Color(settings.lightColor), settings.intensity, settings.lightDistance, settings.lightDecay);
	      case 'directional':
	        return new THREE.DirectionalLight(new THREE.Color(settings.lightColor), settings.intensity);
	    }
	  },
	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function init() {
	
	    var scene = document.querySelector('a-scene').object3D;
	    var parentEl = this.el.object3D;
	    var sceneEl = this.el.sceneEl.object3D;
	
	    //Determine positioning
	    var position = this.data.relative ? new THREE.Vector3(0, 0, 0) : this.data.position;
	
	    //Load texture (Three r84 upward doesn't support progress)
	    var textureLoader = new THREE.TextureLoader();
	    var textureFlare = textureLoader.load(this.data.src.currentSrc, function (texture) {
	      return texture;
	    }, undefined, function (error) {
	      throw new Error('An error occured loading the Flare texture');
	    });
	
	    this.lensFlare = new THREE.Lensflare();
	    this.lensFlareElement = new THREE.LensflareElement(textureFlare, this.data.size, 0.0, new THREE.Color(this.data.lightColor));
	    this.lensFlare.addElement(this.lensFlareElement);
	    this.lensFlare.position.copy(position);
	
	    //Determine if the user wants a light
	    if (this.data.createLight) {
	
	      var light = this.setLightType(this.data.lightType.toLowerCase(), this.data);
	
	      //Has a target been supplied?
	      var hasTarget = this.data.target ? this.data.target : false;
	
	      //Set light target.
	      if (hasTarget) {
	        light.target = document.querySelector(this.data.target).object3D;
	        sceneEl.add(light.target);
	        sceneEl.updateMatrixWorld();
	      }
	      light.position.set(position.x, position.y, position.z);
	
	      //If relative, we want to attach the lensflare, and the light as child objects and call updateMatrixWorld once.
	      if (this.data.relative) {
	        light.add(this.lensFlare);
	        parentEl.add(light);
	        sceneEl.updateMatrixWorld();
	      } else {
	        scene.add(light);
	      }
	    } else {
	      //If relative, we want to attach the lensflare as a child object. This is so our lensflare works with animation updates.
	      if (this.data.relative) {
	        parentEl.add(this.lensFlare);
	        sceneEl.updateMatrixWorld();
	      } else {
	        scene.add(this.lensFlare);
	      }
	    }
	  },
	
	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	  update: function update(oldData) {},
	
	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	  remove: function remove() {},
	
	  /**
	   * Called on each scene tick.
	   */
	  // tick: function (t) { },
	
	  /**
	   * Called when entity pauses.
	   * Use to stop or remove any dynamic or background behavior such as events.
	   */
	  pause: function pause() {},
	
	  /**
	   * Called when entity resumes.
	   * Use to continue or add any dynamic or background behavior such as events.
	   */
	  play: function play() {}
	});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * @author Mugen87 / https://github.com/Mugen87
	 * @author mrdoob / http://mrdoob.com/
	 */
	
	THREE.Lensflare = function () {
	
		THREE.Mesh.call(this, THREE.Lensflare.Geometry, new THREE.MeshBasicMaterial({ opacity: 0, transparent: true }));
	
		this.type = 'Lensflare';
		this.frustumCulled = false;
		this.renderOrder = Infinity;
	
		//
	
		var positionScreen = new THREE.Vector3();
		var positionView = new THREE.Vector3();
	
		// textures
	
		var tempMap = new THREE.DataTexture(new Uint8Array(16 * 16 * 3), 16, 16, THREE.RGBFormat);
		tempMap.minFilter = THREE.NearestFilter;
		tempMap.magFilter = THREE.NearestFilter;
		tempMap.wrapS = THREE.ClampToEdgeWrapping;
		tempMap.wrapT = THREE.ClampToEdgeWrapping;
		tempMap.needsUpdate = true;
	
		var occlusionMap = new THREE.DataTexture(new Uint8Array(16 * 16 * 3), 16, 16, THREE.RGBFormat);
		occlusionMap.minFilter = THREE.NearestFilter;
		occlusionMap.magFilter = THREE.NearestFilter;
		occlusionMap.wrapS = THREE.ClampToEdgeWrapping;
		occlusionMap.wrapT = THREE.ClampToEdgeWrapping;
		occlusionMap.needsUpdate = true;
	
		// material
	
		var geometry = THREE.Lensflare.Geometry;
	
		var material1a = new THREE.RawShaderMaterial({
			uniforms: {
				'scale': { value: null },
				'screenPosition': { value: null }
			},
			vertexShader: ['precision highp float;', 'uniform vec3 screenPosition;', 'uniform vec2 scale;', 'attribute vec3 position;', 'void main() {', '	gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );', '}'].join('\n'),
			fragmentShader: ['precision highp float;', 'void main() {', '	gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 );', '}'].join('\n'),
			depthTest: true,
			depthWrite: false,
			transparent: false
		});
	
		var material1b = new THREE.RawShaderMaterial({
			uniforms: {
				'map': { value: tempMap },
				'scale': { value: null },
				'screenPosition': { value: null }
			},
			vertexShader: ['precision highp float;', 'uniform vec3 screenPosition;', 'uniform vec2 scale;', 'attribute vec3 position;', 'attribute vec2 uv;', 'varying vec2 vUV;', 'void main() {', '	vUV = uv;', '	gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );', '}'].join('\n'),
			fragmentShader: ['precision highp float;', 'uniform sampler2D map;', 'varying vec2 vUV;', 'void main() {', '	gl_FragColor = texture2D( map, vUV );', '}'].join('\n'),
			depthTest: false,
			depthWrite: false,
			transparent: false
		});
	
		// the following object is used for occlusionMap generation
	
		var mesh1 = new THREE.Mesh(geometry, material1a);
	
		//
	
		var elements = [];
	
		var shader = THREE.LensflareElement.Shader;
	
		var material2 = new THREE.RawShaderMaterial({
			uniforms: {
				'map': { value: null },
				'occlusionMap': { value: occlusionMap },
				'color': { value: new THREE.Color(0xffffff) },
				'scale': { value: new THREE.Vector2() },
				'screenPosition': { value: new THREE.Vector3() }
			},
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader,
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthWrite: false
		});
	
		var mesh2 = new THREE.Mesh(geometry, material2);
	
		this.addElement = function (element) {
	
			elements.push(element);
		};
	
		//
	
		var scale = new THREE.Vector2();
		var screenPositionPixels = new THREE.Vector2();
		var validArea = new THREE.Box2();
		var viewport = new THREE.Vector4();
	
		this.onBeforeRender = function (renderer, scene, camera) {
	
			renderer.getCurrentViewport(viewport);
	
			var invAspect = viewport.w / viewport.z;
			var halfViewportWidth = viewport.z / 2.0;
			var halfViewportHeight = viewport.w / 2.0;
	
			var size = 16 / viewport.w;
			scale.set(size * invAspect, size);
	
			validArea.min.set(viewport.x, viewport.y);
			validArea.max.set(viewport.x + (viewport.z - 16), viewport.y + (viewport.w - 16));
	
			// calculate position in screen space
	
			positionView.setFromMatrixPosition(this.matrixWorld);
			positionView.applyMatrix4(camera.matrixWorldInverse);
	
			if (positionView.z > 0) return; // lensflare is behind the camera
	
			positionScreen.copy(positionView).applyMatrix4(camera.projectionMatrix);
	
			// horizontal and vertical coordinate of the lower left corner of the pixels to copy
	
			screenPositionPixels.x = viewport.x + positionScreen.x * halfViewportWidth + halfViewportWidth - 8;
			screenPositionPixels.y = viewport.y + positionScreen.y * halfViewportHeight + halfViewportHeight - 8;
	
			// screen cull
	
			if (validArea.containsPoint(screenPositionPixels)) {
	
				// save current RGB to temp texture
	
				renderer.copyFramebufferToTexture(screenPositionPixels, tempMap);
	
				// render pink quad
	
				var uniforms = material1a.uniforms;
				uniforms["scale"].value = scale;
				uniforms["screenPosition"].value = positionScreen;
	
				renderer.renderBufferDirect(camera, null, geometry, material1a, mesh1, null);
	
				// copy result to occlusionMap
	
				renderer.copyFramebufferToTexture(screenPositionPixels, occlusionMap);
	
				// restore graphics
	
				var uniforms = material1b.uniforms;
				uniforms["scale"].value = scale;
				uniforms["screenPosition"].value = positionScreen;
	
				renderer.renderBufferDirect(camera, null, geometry, material1b, mesh1, null);
	
				// render elements
	
				var vecX = -positionScreen.x * 2;
				var vecY = -positionScreen.y * 2;
	
				for (var i = 0, l = elements.length; i < l; i++) {
	
					var element = elements[i];
	
					var uniforms = material2.uniforms;
	
					uniforms["color"].value.copy(element.color);
					uniforms["map"].value = element.texture;
					uniforms["screenPosition"].value.x = positionScreen.x + vecX * element.distance;
					uniforms["screenPosition"].value.y = positionScreen.y + vecY * element.distance;
	
					var size = element.size / viewport.w;
					var invAspect = viewport.w / viewport.z;
	
					uniforms["scale"].value.set(size * invAspect, size);
	
					material2.uniformsNeedUpdate = true;
	
					renderer.renderBufferDirect(camera, null, geometry, material2, mesh2, null);
				}
			}
		};
	
		this.dispose = function () {
	
			material1a.dispose();
			material1b.dispose();
			material2.dispose();
	
			tempMap.dispose();
			occlusionMap.dispose();
	
			for (var i = 0, l = elements.length; i < l; i++) {
	
				elements[i].texture.dispose();
			}
		};
	};
	
	THREE.Lensflare.prototype = Object.create(THREE.Mesh.prototype);
	THREE.Lensflare.prototype.constructor = THREE.Lensflare;
	THREE.Lensflare.prototype.isLensflare = true;
	
	//
	
	THREE.LensflareElement = function (texture, size, distance, color) {
	
		this.texture = texture;
		this.size = size || 1;
		this.distance = distance || 0;
		this.color = color || new THREE.Color(0xffffff);
	};
	
	THREE.LensflareElement.Shader = {
	
		uniforms: {
	
			'map': { value: null },
			'occlusionMap': { value: null },
			'color': { value: null },
			'scale': { value: null },
			'screenPosition': { value: null }
	
		},
	
		vertexShader: ['precision highp float;', 'uniform vec3 screenPosition;', 'uniform vec2 scale;', 'uniform sampler2D occlusionMap;', 'attribute vec3 position;', 'attribute vec2 uv;', 'varying vec2 vUV;', 'varying float vVisibility;', 'void main() {', '	vUV = uv;', '	vec2 pos = position.xy;', '	vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );', '	visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );', '	visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );', '	visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );', '	visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );', '	visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );', '	visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );', '	visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );', '	visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );', '	vVisibility =        visibility.r / 9.0;', '	vVisibility *= 1.0 - visibility.g / 9.0;', '	vVisibility *=       visibility.b / 9.0;', '	gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );', '}'].join('\n'),
	
		fragmentShader: ['precision highp float;', 'uniform sampler2D map;', 'uniform vec3 color;', 'varying vec2 vUV;', 'varying float vVisibility;', 'void main() {', '	vec4 texture = texture2D( map, vUV );', '	texture.a *= vVisibility;', '	gl_FragColor = texture;', '	gl_FragColor.rgb *= color;', '}'].join('\n')
	
	};
	
	THREE.Lensflare.Geometry = function () {
	
		var geometry = new THREE.BufferGeometry();
	
		var float32Array = new Float32Array([-1, -1, 0, 0, 0, 1, -1, 0, 1, 0, 1, 1, 0, 1, 1, -1, 1, 0, 0, 1]);
	
		var interleavedBuffer = new THREE.InterleavedBuffer(float32Array, 5);
	
		geometry.setIndex([0, 1, 2, 0, 2, 3]);
		geometry.addAttribute('position', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0, false));
		geometry.addAttribute('uv', new THREE.InterleavedBufferAttribute(interleavedBuffer, 2, 3, false));
	
		return geometry;
	}();

/***/ })
/******/ ]);
//# sourceMappingURL=aframe-lensflare-component.js.map