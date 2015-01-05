'use strict';

/**
 * Provides functions to play w/ the motor on the REPL (command-line).
 * @type {exports}
 */

var five = require('johnny-five'),
  Board = five.Board,
  Motor = five.Motor,
  Q = require('q'),
  _ = require('lodash-node'),

  DELAY = 2000,
  STEP_DELAY = 20,
  DEFAULT_SPEED = 128,
  MIN_SPEED = 0,
  MAX_SPEED = 256;

require('q-foreach')(Q);

new Board().on('ready', function () {
  var motor = new Motor(9);

  var step = function step(speed) {
    return Q(motor.speed(speed))
      .delay(STEP_DELAY);
  };

  /**
   * Increases speed to `target` speed, or max.
   * @param {number} [target=255] Target speed
   * @returns {Promise}
   */
  var faster = function faster(target) {
    var current = motor.currentSpeed;
    target = _.isUndefined(target) || _.isObject(target) ? MAX_SPEED : target;
    if (target > current) {
      motor.board.info('Motor', 'Increasing speed from ' + current + ' to ' + target);
      return Q.forEach(_.range(current, target), step, motor)
        .then(function () {
          return motor;
        });
    }
    return Q();
  };

  /**
   * Decreases speed to `target speed, or min.
   * @param {number} [target=0] Target speed
   * @returns {Promise}
   */
  var slower = function slower(target) {
    var current = motor.currentSpeed;
    target = _.isUndefined(target) || _.isObject(target) ? MIN_SPEED : target;
    if (target < current) {
      motor.board.info('Motor', 'Decreasing speed from ' + current + ' to ' + target);
      return Q.forEach(_.range(current, target, -1), step, motor)
        .then(function () {
          return motor;
        });
    }
    return Q();
  };

  /**
   * Runs an acceleration demo.
   * @returns {Promise}
   */
  var demo = function demo() {
    motor.board.info('Motor', 'Demonstrating full range of speed');
    return Q(motor.stop())
      .post('start', [MIN_SPEED])
      .then(faster)
      .delay(DELAY)
      .post('stop')
      .then(function() {
        motor.board.info('Motor', 'Done');
      });
  };

  /**
   * Starts the motor at given `speed`.
   * @param {number} [speed=128] Speed to start at
   * @returns {Promise<Motor>}
   */
  var start = function start(speed) {
    speed = _.isUndefined(speed) ? DEFAULT_SPEED : speed;
    motor.board.info('Motor', 'Starting motor @ speed ' + speed);
    return Q(motor.start(speed));
  };

  /**
   * Sets the speed of the motor.  Starts it if not started.
   * @param {number} [value=128] Speed
   * @returns {Promise<Motor>}
   */
  var speed = function speed(value) {
    value = _.isUndefined(value) ? DEFAULT_SPEED : value;
    motor.board.info('Motor', 'Setting speed to ' + value);
    return Q(motor.speed(value));
  };

  /**
   * Stops running motor.
   * @returns {Promise<Motor>}
   */
  var stop = function stop() {
    motor.board.info('Motor', 'Stopping');
    return Q(motor.stop());
  };

  this.repl.inject({
    start: start,
    stop: stop,
    speed: speed,
    demo: demo,
    slower: slower,
    faster: faster,
    motor: motor
  });

});
