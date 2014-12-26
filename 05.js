'use strict';

var five = require('johnny-five'),
  Pin = five.Pin,
  Led = five.Led,
  Board = five.Board;

new Board().on('ready', function () {
  var btn1 = new Pin(2),
    btn2 = new Pin(3),
    led = new Led(13),

    /**
     * Toggle LED on if one button is pushed, otherwise off.
     */
    toggle = function toggle() {
      led[btn1.value ^ btn2.value ? 'on' : 'off']();
    };

  btn1.read(toggle);
  btn2.read(toggle);
});

