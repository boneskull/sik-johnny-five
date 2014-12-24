'use strict';

var Pin = require('johnny-five').Pin,
  _ = require('lodash-node');

/**
 * A Pinset has the same API as the Pin class, but to use it you will pass
 * an Object or Array of Pin instances.  Each method called in the Pinset will
 * call the method on each instance.
 * @param {(Array|Object)} pins One or more Pin instances.
 * @constructor
 */
var Pinset = function Pinset(pins) {
  this._pins = pins;
};

_.each(Pin.prototype, function (func, fnName) {
  Pinset.prototype[fnName] = function () {
    var args = arguments;
    _.each(this._pins, function (pin) {
      func.apply(pin, args);
    });
    return this;
  };
});

/**
 * Mostly a convenient way for the `makepins` module to do its thing.
 * @param config
 * @param func
 * @param cache
 * @param inject
 * @returns {Pinset}
 */
Pinset.makePinset = function makePinset(config, func, cache, inject) {
  return new Pinset(_.map(config, function(value) {
    return func(value, cache, inject);
  }));
};

module.exports = Pinset;


