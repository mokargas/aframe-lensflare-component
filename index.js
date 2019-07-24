/* global AFRAME */
/* global THREE */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
}

if (typeof THREE === 'undefined') {
  throw new Error('Component attempted to register before THREE was available.')
}

//https://github.com/mrdoob/three.js/blob/master/examples/js/objects/Lensflare.js
require('./Lensflare')

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
      default: 4.0,
    },
    lightAngle: {
      type: 'number',
      default: Math.PI / 3,
    },
    lightPenumbra: {
      type: 'number',
      default: 0.077,
    },
    lightDecay: {
      type: 'number',
      default: 1,
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
  setLightType: function (type, settings) {
    switch (type) {
      case 'spot':
        return new THREE.SpotLight(new THREE.Color(settings.lightColor), settings.intensity, settings.lightDistance, settings.lightAngle, settings.lightPenumbra, settings.lightDecay)
      case 'point':
        return new THREE.PointLight(new THREE.Color(settings.lightColor), settings.intensity, settings.lightDistance, settings.lightDecay)
      case 'directional':
        return new THREE.DirectionalLight(new THREE.Color(settings.lightColor), settings.intensity)
    }
  },
  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {

    const scene = document.querySelector('a-scene').object3D;
    const parentEl = this.el.object3D
    const sceneEl = this.el.sceneEl.object3D

    //Determine positioning
    const position = this.data.relative ? new THREE.Vector3(0, 0, 0) : this.data.position

    //Load texture (Three r84 upward doesn't support progress)
    const textureLoader = new THREE.TextureLoader()
    const textureFlare = textureLoader.load(this.data.src.currentSrc,
      function (texture) {
        return texture
      },
      undefined,
      function (error) {
        throw new Error('An error occured loading the Flare texture')
      }
    )

    this.lensFlare = new THREE.Lensflare()
    this.lensFlareElement = new THREE.LensflareElement(textureFlare, this.data.size, 0.0, new THREE.Color(this.data.lightColor))
    this.lensFlare.addElement(this.lensFlareElement);
    this.lensFlare.position.copy(position)



    //Determine if the user wants a light
    if (this.data.createLight) {

      const light = this.setLightType(this.data.lightType.toLowerCase(), this.data)

      //Has a target been supplied?
      const hasTarget = this.data.target ? this.data.target : false

      //Set light target.
      if (hasTarget) {
        light.target = document.querySelector(this.data.target).object3D
        sceneEl.add(light.target)
        sceneEl.updateMatrixWorld()
      }
      light.position.set(position.x, position.y, position.z)

      //If relative, we want to attach the lensflare, and the light as child objects and call updateMatrixWorld once.
      if (this.data.relative) {
        light.add(this.lensFlare)
        parentEl.add(light)
        sceneEl.updateMatrixWorld()
      } else {
        scene.add(light)
      }
    } else {
      //If relative, we want to attach the lensflare as a child object. This is so our lensflare works with animation updates.
      if (this.data.relative) {
        parentEl.add(this.lensFlare)
        sceneEl.updateMatrixWorld()
      } else {
        scene.add(this.lensFlare)
      }
    }


  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {

  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});
