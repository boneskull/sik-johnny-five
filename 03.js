'use strict';

var five = require("johnny-five"),
  makepins = require('./lib/makepins'),
  Pin = five.Pin,
  Q = require('q'),
  _ = require('lodash-node'),
  board = new five.Board();

require('q-foreach')(Q);

var MS = 200;

var demoColors = function demoColors() {
  var pins = makepins.call(this, {
      red: 9,
      green: 10,
      blue: 11,
      yellow: ['red', 'green'],
      cyan: ['green', 'blue'],
      purple: ['red', 'blue'],
      white: ['red', 'green', 'blue']
    }),

    /**
     * Returns a function which will toggle Pin `on` to the "HIGH" position.  If the function receives
     * a Pin parameter, `off`, it will first be turned to the "LOW" position.
     * @param {Pin} [on] Pin to toggle on
     * @returns Function
     */
    toggle = function toggle(on) {
      
      /**
       * Delay `MS` ms, turn Pin `off` to "LOW" (if present), then turn Pin `on` "HIGH".
       * @param {Pin} [off] Pin to toggle off
       * @returns Promise<Pin>
       */
      return function (off) {
        return Q.delay(MS)
          .then(function () {
            if (off) {
              off.low();
            }
            if (on) {
              on.high();
            }
            return on;
          });
      };
    };

  // toggle all pins off
  _.each(pins, function (pin) {
    pin.low();
  });

  // toggle each pin, one at a time, then toggle the final pin off.
  return toggle(pins.red)()
    .then(toggle(pins.green))
    .then(toggle(pins.blue))
    .then(toggle(pins.yellow))
    .then(toggle(pins.cyan))
    .then(toggle(pins.purple))
    .then(toggle());
};

/**
 * Given an value in range 0-1023, return appropriate RGB decimal values.
 * @param {number} color Color value
 * @returns Array<number>
 */
var getValues = function getValues(color) {
  var redVal, greenVal, blueVal;
  if (color <= 255) {
    redVal = 255 - color;
    greenVal = color;
    blueVal = 0;
  } else if (color <= 511) {
    redVal = 0;
    greenVal = 255 - color - 256;
    blueVal = color - 256;
  } else {
    redVal = color - 512;
    greenVal = 0;
    blueVal = 255 - color - 512;
  }
  return [redVal, greenVal, blueVal];
};

/**
 * Display a spectrum of pretty rainbow colors
 * @param {boolean} [rgbMode] If this is present, use the johnny-five Led.RGB API instead, which is a lot easier.
 */
var spectrum = function spectrum(rgbMode) {
  var show, hide, rgb, pins;
  if (rgbMode) {
    rgb = new five.Led.RGB([9, 10, 11]);
    show = function showRGB(color) {
      rgb.color(getValues(color));
    };
    hide = function hideRGB() {
      rgb.off();
    };
  } else {
    pins = {
      red: new Pin({addr: 9}),
      green: new Pin({addr: 10}),
      blue: new Pin({addr: 11})
    };
    show = function showPins(color) {
      var colors = getValues(color);
      _.each(_.keys(pins), function (name, idx) {
        var pin = pins[name];
        pin.mode = pin.io.MODES.PWM;
        pin.io.analogWrite(pin.addr, colors[idx]);
      });
    };
    hide = function hidePins() {
      _.each(pins, function(pin) {
        pin.mode = pin.io.MODES.PWM;
        pin.io.analogWrite(pin.addr, 0);
      });
    };
  }
  
  // TODO not sure why this only goes to 768; read example again
  Q.forEach(_.range(0, 768), function (color) {
    show(color);
    return Q.delay(10);
  }).then(hide);

};

board.on("ready", function () {

  // demo the basic colors then do a spectrum.
  demoColors().then(spectrum);

});
