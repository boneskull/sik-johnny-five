'use strict';

var five = require("johnny-five"),
  board = new five.Board();

board.on("ready", function () {

  var pin = new five.Pin('A0'),
    led = new five.Led(13);

  setInterval(function() {
    pin.query(function(data) {
      led.strobe(data.value);
    });
  }, 1000);

});
