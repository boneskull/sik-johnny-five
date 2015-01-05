'use strict';

var five = require('johnny-five'),
  Q = require('q'),
  Board = five.Board,
  Servo = five.Servo,

  /**
   * Pin address of Servo input
   * @type {number}
   */
  ADDR = 9,

  /**
   * Standard delay between actions
   * @type {number}
   */
  DELAY = 1000;

new Board().on('ready', function () {
  var servo = new Servo({
      pin: ADDR,
      center: true
    }),

    /**
     * Returns a function which rotates a servo `deg` degrees over time `time`.
     * @param {number} deg Degrees
     * @param {number} [time] Time (ms)
     * @returns Promise<Servo>
     */
    to = function to(deg, time) {
      return function () {
        return Q(servo.to(deg, time))
          .delay(DELAY);
      };
    };

  to(180)()
    .then(to(0))
    .then(to(180, DELAY))
    .then(to(0, DELAY));

});

