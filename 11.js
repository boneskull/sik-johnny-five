'use strict';

var five = require('johnny-five'),
  Piezo = five.Piezo,
  Board = five.Board;

var QRTR = 1/4,
  HALF = 1/2,
  WHOL = 1,
  C = 'C4',
  D = 'D4',
  F = 'F4',
  A = 'A4',
  G = 'G4';

new Board().on('ready', function() {
  var buzz = new Piezo(9);

  buzz.play({
    song: [
      [C, QRTR],
      [D, QRTR],
      [F, QRTR],
      [D, QRTR],
      [A, QRTR],
      [null, QRTR],
      [A, WHOL],
      [G, WHOL],
      [null, HALF],
      [C, QRTR],
      [D, QRTR],
      [F, QRTR],
      [D, QRTR],
      [G, QRTR],
      [null, QRTR],
      [G, WHOL],
      [F, WHOL],
      [null, HALF]
    ],
    tempo: 113 // the tempo of this song is actually 113 bpm.
  });
});
