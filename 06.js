'use strict';

var five = require('johnny-five'),
  partialRight = require('lodash-node').partialRight,
  Pin = five.Pin,
  Led = five.Led,
  Board = five.Board,

  MAX = 1023,
  MIN = 0,
  BUFFER = 30,
  SCALE = [0, 255],

  constrain = partialRight(Board.constrain, SCALE[0], SCALE[1]),
  fmap = partialRight(Board.fmap, SCALE[0], SCALE[1]);

new Board().on('ready', function () {
  var photo = new Pin('A0'),
    led = new Led(9),
    max = MAX,
    min = MIN,

    /**
     * Given value in the range MIN to MAX:
     * - Adjust the known min and max values
     * - Remap `value` in range MIN to MAX against known min to known max
     * - Constrain this to the LED brightness scale, which is 0-255
     * @summary Normalize the photodiode output
     * @param {number} value Photodiode value
     * @returns {number} Normalized value for use by LED
     */
    normalize = function normalize(value) {
      return constrain(fmap(value, (min = Math.min(min, value)) + BUFFER,
        (max = Math.max(max, value)) - BUFFER));
    };

  photo.read(function(value) {
    led.brightness(normalize(value));
  });
});

