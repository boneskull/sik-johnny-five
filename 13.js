'use strict';

var five = require('johnny-five'),
  Q = require('q'),
  Board = five.Board,
  Relay = five.Relay,

  /**
   * When to stop alternating the relay (ms)
   * @type {number}
   */
  THRESHOLD = 20,

  /**
   * Base alternation delay
   * @type {number}
   */
  DELAY = 1000;

new Board().on('ready', function () {
  var relay = new Relay(2),

    /**
     * Counter for relay toggling iterations
     * @type {number}
     */
    count = 0,

    /**
     * Returns a function which turns the relay ON then waits.
     * @param {number} [delay] How long to wait
     * @returns {Function}
     */
    on = function on(delay) {
      return function () {
        relay.on();
        return Q.delay(delay);
      };
    },

    /**
     * Returns a function which turns the relay OFF then waits
     * @param {number} [delay] How long to wait
     * @returns {Function}
     */
    off = function off(delay) {
      return function () {
        relay.off();
        return Q.delay(delay);
      };
    },

    /**
     * If delay >= {@link THRESHOLD}, then return a function which
     * toggles the relay, then calls this function recursively.  After four
     * iterations, decrease the delay time by 25%.  Once the threshold is reached,
     * the relay will stop alternating and the function will exit.
     * @param {number} delay Delay to start with
     * @returns {(Function|undefined)}
     */
    demo = function demo(delay) {
      if (count === 3) {
        delay *= 0.75;
        count = 0;
      }
      if (delay < 20) {
        off();
        return;
      }
      return function () {
        return on(delay)()
          .then(off(delay))
          .then(function () {
            count++;
          })
          .then(demo(delay));
      };
    };

  demo(DELAY)();
});
