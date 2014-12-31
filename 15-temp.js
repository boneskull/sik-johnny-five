'use strict';

var five = require('johnny-five'),
  format = require('util').format,
  Board = five.Board,
  LCD = five.LCD,
  Temperature = five.Temperature;

new Board().on('ready', function () {
  var lcd = new LCD({
      pins: [12, 11, 5, 4, 3, 2]
    }),
    tmp = new Temperature({
      pin: 'A0',
      freq: 5000,
      controller: 'tmp36'
    });

  lcd.on('ready', function () {
    lcd.createChar('deg', [12,18,18,18,12,0,0]);
    lcd.print('Ready!');
    tmp.on('change', function () {
      var f = Math.floor(tmp.fahrenheit * 100) / 100,
        c = Math.floor(tmp.celsius * 100) / 100;
      lcd.clear();
      lcd.cursor(0, 0);
      lcd.print(format('%d :deg:F', f));
      lcd.cursor(1, 0);
      lcd.print(format('%d :deg:C', c));
    });
  });
  this.repl.inject({
    lcd: lcd
  });
});
