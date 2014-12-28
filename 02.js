'use strict';

var five = require("johnny-five"),
  Board = five.Board,
  Sensor = five.Sensor,
  Led = five.Led;

new Board().on("ready", function () {

  var pot = new Sensor('A0'),
    led = new Led(13);

  pot.on('change', function() {
    led.strobe(this.value);
  });

});
