'use strict';

var five = require('johnny-five'),
  Q = require('q'),
  Board = five.Board,
  RGB = five.Led.RGB,
  Sensor = five.Sensor;

new Board().on('ready', function () {
  var rgb = new RGB({
      pins: [9, 10, 11]
    }),
    softPot = new Sensor({
      pin: 'A0'
    }),

    getRGB = function getRGB() {
      var value, fmap, constrain, rgbMax, rgbMin, redPeak, greenPeak,
          bluePeak, redVal, greenVal, blueVal, rangeMax;

        if (this.mode === this.io.MODES.INPUT) {
          return this.value ? 'FFFFFF' : '000000';
        }

        value = this.value;
        fmap = Board.fmap;
        constrain = Board.constrain;
        rgbMax = 255;
        rgbMin = 0;
        rangeMax = this.range[1];
        redPeak = this.range[0];
        greenPeak = Math.floor(rangeMax / 3);
        bluePeak = Math.floor(rangeMax / 3 * 2);

        redVal = constrain(fmap(value, redPeak, greenPeak, rgbMax, rgbMin), rgbMin, rgbMax) +
        constrain(fmap(value, bluePeak, rangeMax, rgbMin, rgbMax), rgbMin, rgbMax);

        greenVal = constrain(fmap(value, redPeak, greenPeak, rgbMin, rgbMax), rgbMin, rgbMax) -
        constrain(fmap(value, greenPeak, bluePeak, rgbMin, rgbMax), rgbMin, rgbMax);

        blueVal = constrain(fmap(value, greenPeak, bluePeak, rgbMin, rgbMax), rgbMin,
          rgbMax) -
        constrain(fmap(value, bluePeak, rangeMax, rgbMin, rgbMax), rgbMin, rgbMax);

        return [redVal, greenVal, blueVal].map(function (val) {
          return val.toString(16);
        }).join('');
    };

  softPot.on('touch', function () {
    rgb.color(getRGB.call(this));
  });
});
