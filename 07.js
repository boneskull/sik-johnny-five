'use strict';

var five = require('johnny-five'),
  Sensor = five.Sensor,
  Board = five.Board,
  format = require('util').format,

  /**
   * Voltage multiplier for TMP32 temperature sensor.
   * @type {number}
   */
  TMP36_CONSTANT = 0.004882814,

  /**
   * How often to ping the temp sensor (ms).
   * @type {number}
   */
  FREQ = 1000,

  /**
   * Address of output pin from TMP36
   * @type {string}
   */
  ADDR = 'A0',
  /**
   * Given value in range 0-1023, return voltage.
   * @param {number} value Analog value
   * @returns {number}
   */
  analogToVoltage = function analogToVoltage(value) {
    return TMP36_CONSTANT * value;
  },

  /**
   * Given voltage, return celsius
   * @param {number} voltage Voltage value
   * @returns {number}
   */
  voltageToCelsius = function voltageToCelsius(voltage) {
    return (voltage - 0.5) * 100.0;
  },

  /**
   * Given celsius, return fahrenheit
   * @param {number} celsius Celsius value
   * @returns {number}
   */
  celsiusToFahrenheit = function celsiusToFahrenheit(celsius) {
    return celsius * (9.0 / 5.0) + 32.0;
  },

  /**
   * Round a number to `places` decimal places.
   * @param {number} value Value to round
   * @param {number} [places=2] How many places to round to
   * @returns {number}
   */
  round = function round(value, places) {
    var multiplier;
    places = places || 2;
    multiplier = Math.pow(10, places);
    return Math.round(value * multiplier) / multiplier;
  };

// this is pretty similar to johnny-five/eg/sensor-temperature-tmp36.js
new Board().on('ready', function () {
  var tmp = new Sensor({
    pin: ADDR,
    freq: FREQ
  });

  tmp.on('data', function () {
    var voltage = analogToVoltage(this.value),
      celsius = voltageToCelsius(voltage),
      fahrenheit = celsiusToFahrenheit(celsius);

    console.info.apply(console, ['%dV  %d℃  %d℉'].concat([voltage, celsius, fahrenheit].map(round)));

  });
});

