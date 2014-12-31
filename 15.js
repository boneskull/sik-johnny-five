'use strict';

var five = require('johnny-five'),
  Board = five.Board,
  LCD = five.LCD;

new Board().on('ready', function () {
  var lcd = new LCD({
    pins: [12, 11, 5, 4, 3, 2]
  }).on('ready', function () {
      this.clear();
      this.print('Hello, world!');
    });
  this.repl.inject({
    lcd: lcd
  });
});
