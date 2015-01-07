'use strict';

var five = require('johnny-five'),
  _ = require('lodash-node'),
  Q = require('q'),
  Board = five.Board,
  ShiftRegister = five.ShiftRegister,

  DELAY = 1000;

require('q-foreach')(Q);

new Board().on('ready', function () {
  /**
   * This is a 74HC595 shift register
   * @type {ShiftRegister}
   */
  var ic = new ShiftRegister({
      pins: {
        data: 2,
        clock: 3,
        latch: 4
      }
    }),
    segments = _.mapValues(_.object(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp'], _.range(0, 8)),
      function (seg) {
        return 1 << seg;
      }),

    digits = [
      segments.f | segments.e | segments.d | segments.c | segments.b | segments.a,
      segments.c | segments.b,
      segments.g | segments.e | segments.d | segments.a | segments.b,
      segments.g | segments.d | segments.c | segments.b | segments.a,
      segments.g | segments.f | segments.c | segments.b,
      segments.g | segments.f | segments.d | segments.c | segments.a,
      segments.g | segments.f | segments.e | segments.d | segments.c | segments.a,
      segments.c | segments.b | segments.a,
      segments.g | segments.f | segments.e | segments.d | segments.c | segments.b | segments.a,
      segments.g | segments.f | segments.d | segments.c | segments.b | segments.a
    ];

  this.repl.inject({
    ic: ic,
    segments: segments,
    digits: digits
  });

  Q.forEach(digits, function (digit) {
    ic.send(0);
    return Q(ic.send(digit))
      .delay(DELAY);
  })
    .then(function () {
      ic.send(0);
    });

});
