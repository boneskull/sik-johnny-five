/**
 * Provides a somewhat-convenient way to create a bunch of Pins at once.
 * @module makepins
 */

'use strict';

var _ = require('lodash-node'),
  Pinset = require('./pinset'),
  Pin = require('johnny-five').Pin;


var injector = function injector(repl) {
  if (repl) {
    return function inject(pin) {
      repl.inject(_.object([pin.id || pin.addr], [pin]));
    };
  }
  return function () {
  };
};


/**
 * Given pin configuration, returns a collection of Pin objects.
 *
 * Each object is automatically added, by name, to the REPL, if you call this
 * function with a Board instance for the context.
 *
 * @param {(Object|Array|string|number)} config
 * @param {Object} [cache] Used internally
 * @param {Function} [inject] Used internally
 * @param {string} [name] Name/id of Pin
 * @returns {(Object|Pinset|Pin)}
 */
module.exports = function makepins(config, cache, inject, name) {
  var pin;
  cache = cache || {};
  inject = inject || injector(this && this.repl);
  if (_.isArray(config)) {
    return Pinset.makePinset(config, makepins, cache, inject);
  }
  if (_.isObject(config)) {
    return _.mapValues(config, function (value, key) {
      return makepins(value, cache, inject, key);
    });
  }
  if (_.isString(config) || _.isNumber(config)) {
    if (cache[config]) {
      return cache[config];
    }
    pin = new Pin({
      id: name,
      addr: config
    });
    inject(pin, name);
    cache[name || pin.addr] = pin;
    return pin;
  }
  throw new Error('invalid parameters');
};
