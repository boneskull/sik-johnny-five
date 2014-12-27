'use strict';

var five = require('johnny-five'),
  Sensor = five.Sensor,
  Led = five.Led,
  Board = five.Board;

new Board().on('ready', function () {
  var photo = new Sensor('A0'),
    led = new Led(9);

  // the Sensor class handles all sorts of fussiness so it's probably better
  // to just use that instead ofa trying to do it yourself.
  photo.scale().on('change', function(err, value) {
    // see https://github.com/rwaldron/johnny-five/issues/553
    led.brightness(value);
  });
});

