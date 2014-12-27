'use strict';

var five = require('johnny-five'),
  Q = require('q'),
  Board = five.Board,
  Servo = five.Servo,
  Sensor = five.Sensor,

  /**
   * Pin address of Servo input
   * @type {number}
   */
  SERVO_ADDR = 9,

  /**
   * Pin address of sensor output
   * @type {string}
   */
  FLEX_ADDR = 'A0';

new Board().on('ready', function () {
  var servo = new Servo({
      pin: SERVO_ADDR,
      center: true
    }),

    flex = new Sensor({
      pin: FLEX_ADDR,
      range: [600, 900]
    });

  flex.scale(0, 180).on('change', function() {
    servo.to(this.value);
  });

});

