'use strict';

var five = require("johnny-five"),
  Led = five.Led,
  Board = five.Board;

new Board().on("ready", function() {

  // Create an Led on pin 13 and strobe it on/off
  // Optionally set the speed; defaults to 100ms
  (new Led(13)).strobe();

});
