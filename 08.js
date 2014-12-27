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

  DELAY = 1000;

new Board().on('ready', function () {
  var servo = new Servo({
      pin: ADDR,
      center: true
    }),

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

