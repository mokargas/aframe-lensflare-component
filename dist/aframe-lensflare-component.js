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
/***/ function(module, exports) {

	'use strict';
	
	/* global AFRAME */
	/* global THREE */
	
	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}
	
	if (typeof THREE === 'undefined') {
	  throw new Error('Component attempted to register before THREE was available.');
	}
	
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
	    var scene = document.querySelector('a-scene').object3D,
	        self = this.el.object3D,
	        parentPos = self.position;
	
	    var parentEl = this.el.object3D,
	        sceneEl = this.el.sceneEl.object3D;
	
	    //Determine positioning
	    var position = this.data.relative ? new THREE.Vector3(parentPos.x + this.data.position.x, parentPos.y + this.data.position.y, parentPos.z + this.data.position.z) : this.data.position;
	
	    //Load texture
	    var textureLoader = new THREE.TextureLoader();
	    var textureFlare = textureLoader.load(this.data.src, function (texture) {
	      return texture;
	    }, function (xhr) {
	      //console.log((xhr.loaded / xhr.total * 100) + '% loaded')
	    }, function (xhr) {
	      throw new Error('An error occured loading the Flare texture');
	    });
	
	    this.lensFlare = new THREE.LensFlare(textureFlare, this.data.size, 0.0, THREE.AdditiveBlending, new THREE.Color(this.data.lightColor));
	    this.lensFlare.position.copy(position);
	
	    //Determine if the user wants a light
	    if (this.data.createLight) {
	
	      var light = this.setLightType(this.data.lightType.toLowerCase(), this.data);
	
	      //Has a target been supplied?
	      var hasTarget = this.data.target ? this.data.target : false;
	
	      //Set light target.
	      if (hasTarget) light.target = document.querySelector(this.data.target).object3D;
	      light.position.set(position.x, position.y, position.z);
	
	      //If relative, we want to attach the lensflare, and the light as child objects and call updateMatrixWorld once.
	      if (this.data.relative) {
	        THREE.SceneUtils.attach(light, sceneEl, parentEl);
	        THREE.SceneUtils.attach(this.lensFlare, sceneEl, parentEl);
	        sceneEl.updateMatrixWorld();
	      } else {
	        scene.add(light);
	      }
	    } else {
	      //If relative, we want to attach the lensflare as a child object. This is so our lensflare works with animation updates.
	      if (this.data.relative) {
	        THREE.SceneUtils.attach(this.lensFlare, sceneEl, parentEl);
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

/***/ }
/******/ ]);
//# sourceMappingURL=aframe-lensflare-component.js.map