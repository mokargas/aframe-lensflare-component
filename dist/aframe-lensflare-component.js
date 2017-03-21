/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/* global AFRAME */
	/* global THREE */

	if (typeof AFRAME === 'undefined') {
	    throw new Error('Component attempted to register before AFRAME was available.')
	}

	if (typeof THREE === 'undefined') {
	    throw new Error('Component attempted to register before THREE was available.')
	}

	/**
	 * A-Frame Lensflare Component component for A-Frame.
	 */
	AFRAME.registerComponent('lensflare', {
	    schema: {
	        //Image to use
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
	            default: 4.0,
	        },
	        lightAngle: {
	            type: 'number',
	            default: Math.PI/3,
	        },
	        lightPenumbra: {
	            type: 'number',
	            default: 0.077,
	        },
	        lightDecay: {
	            type: 'number',
	            default: 1,
	        }
	    },

	    /**
	     * Set if component needs multiple instancing.
	     */
	    multiple: true,

	    /**
	     * Called once when component is attached. Generally for initial setup.
	     */
	    init: function() {
	        const scene = document.querySelector('a-scene').object3D,
	        self = this.el.object3D,
	         parentPos = self.position

	        //Determine positioning
	        let position = this.data.position
	        if (this.data.relative) {
	            position = new THREE.Vector3(parentPos.x + this.data.position.x, parentPos.y + this.data.position.y, parentPos.z + this.data.position.z)
	        }

	        //Determine if the user wants a light
	        if (this.data.createLight) {

	            // SpotLight( color, intensity, distance, angle, penumbra, decay )
	            let light = new THREE.SpotLight(new THREE.Color(this.data.lightColor), this.data.intensity, this.data.lightDistance, this.data.lightAngle, this.data.lightPenumbra, this.data.lightDecay)

	            //Has a target been supplied?
	            let hasTarget = (this.data.target) ? this.data.target : false

	            //Set light target.
	            if (hasTarget) {
	                light.target = document.querySelector(this.data.target).object3D
	            }

	            light.position.set(position.x, position.y, position.z)
	            scene.add(light)
	        }

	        const textureLoader = new THREE.TextureLoader()
	        const textureFlare = textureLoader.load(this.data.src,
	            function(texture) {
	                return texture
	            },
	            function(xhr) {
	                //console.log((xhr.loaded / xhr.total * 100) + '% loaded')
	            },
	            function(xhr) {
	                throw new Error('An error occured loading the Flare texture')
	            }
	        )

	        let lensFlare = new THREE.LensFlare(textureFlare, this.data.size, 0.0, THREE.AdditiveBlending, new THREE.Color(this.data.lightColor));
	        lensFlare.position.copy(position);
	        scene.add(lensFlare)

	    },

	    /**
	     * Called when component is attached and when component data changes.
	     * Generally modifies the entity based on the data.
	     */
	    update: function(oldData) {},

	    /**
	     * Called when a component is removed (e.g., via removeAttribute).
	     * Generally undoes all modifications to the entity.
	     */
	    remove: function() {},

	    /**
	     * Called on each scene tick.
	     */
	    // tick: function (t) { },

	    /**
	     * Called when entity pauses.
	     * Use to stop or remove any dynamic or background behavior such as events.
	     */
	    pause: function() {},

	    /**
	     * Called when entity resumes.
	     * Use to continue or add any dynamic or background behavior such as events.
	     */
	    play: function() {}
	});


/***/ }
/******/ ]);