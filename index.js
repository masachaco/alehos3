'use strict'

let code = require('./code')

let Alehos = function () {
  this.code = code
  this.handlers = {}
}

/**
 * register a handling function with an event
 * the event should be: discover, onoff, temperature, percentage, healthCheck
 * the object will be wrote to handlers
 *
 * @param {string} name
 * @param {function} fnc
 */
Alehos.prototype.registerHandler = function (eventName, handler) {
  if (typeof handler !== 'function') {
    throw new Error(`Event handler for '${eventName}' was not a function`)
  }

  this.handlers[eventName] = handler
}

/**
 * Given header of the request, provide handling function
 *
 * @param {string} header
 * @returns {function}
 */
Alehos.prototype._getHlrFn = function (header) {
  let fn
  switch (header.namespace) {
    // discovery
    case this.code.NAMESPACE_DISCOVERY:
      fn = this.handlers['discover']
      break

    // power control
    case this.code.NAMESPACE_POWERCONTROL:
      if (header.name === this.code.NAME_TURNON) {
        fn = this.handlers['powerControllerTurnOn']
      }
      if (header.name === this.code.NAME_TURNOFF) {
        fn = this.handlers['powerControllerTurnOff']
      }

      break

    // camera
    case this.code.NAMESPACE_CAMERASTREAMCONTROLLER:
      if (header.name === this.code.NAME_INITIALIZECAMERASTREAM) {
        fn = this.handlers['cameraStreamInitialize']
      }

      break

    // brightness
    case this.code.NAMESPACE_BRIGHTNESSCONTROLLER:
      if (header.name === this.code.NAME_ADJUSTBRIGHTNESS) {
        fn = this.handlers['brightnessControllerAdjust']
      }
      if (header.name === this.code.NAME_SETBRIGHTNESS) {
        fn = this.handlers['brightnessControllerSet']
      }

      break

    // thermostat
    case this.code.NAMESPACE_THERMOSTATCONTROLLER:
      if (header.name === this.code.NAME_ADJUSTTARGETTEMPERATURE) {
        fn = this.handlers['thermostatAdjustTargetTemperature']
      }
      if (header.name === this.code.NAME_SETTARGETTEMPERATURE) {
        fn = this.handlers['thermostatSetTargetTemperature']
      }
      if (header.name === this.code.NAME_SETTHERMOSTATMODE) {
        fn = this.handlers['thermostatSetThermostatMode']
      }

      break
  }

  return fn
}

module.exports = Alehos
