'use strict';

var five = require('johnny-five'),
  _ = require('lodash-node'),
  Q = require('q'),
  Random = require('random-js'),
  Board = five.Board,
  ShiftRegister = five.ShiftRegister,
  Led = five.Led,

  DELAY = 100;

require('q-foreach')(Q);

new Board().on('ready', function () {
  var ic = new ShiftRegister({
      pins: {
        data: 2,
        clock: 3,
        latch: 4
      }
    }),

    pingPong = function pingPong() {
      var range = _.range(0, 8);
      return Q.forEach(range, function (idx) {
        ic.send(ic.value | (1 << idx));
        return Q.delay(DELAY);
      })
        .then(function() {
          return Q.forEach(range, function () {
            ic.send(ic.value >> 1);
            return Q.delay(DELAY);
          });
        });
    },

    oneAfterAnother = function oneAfterAnother() {
      var range = _.range(0, 8);
      return Q.forEach(range, function (idx) {
        ic.send(ic.value | (1 << idx));
        return Q.delay(DELAY);
      })
        .then(function() {
          return Q.forEach(range, function () {
            ic.send(ic.value << 1);
            return Q.delay(DELAY);
          });
        });
    },

    oneAtATime = function oneAtATime() {
      return Q.forEach(_.range(1, 8), function (idx) {
        ic.send(1 << idx);
        return Q.delay(DELAY);
      });
    },

    blinkenLights = function blinkenLights() {
      var engine = Random.engines.mt19937().autoSeed(),
        pinDistribution = Random.integer(0, 7),
        temporalDistribution = Random.integer(0, 500),
        pins = [],
        dfrd = Q.defer(),

        randomDelay = function randomDelay() {
          return temporalDistribution(engine);
        },

        randomPin = function randomPin() {
          return pinDistribution(engine);
        };

      // there are more efficient ways to do this, but whatever.
      for(var i=0; i < 100; i++) {
        pins.push(randomPin());
      }

      Q.forEach(pins, function(pin) {
        ic.send(ic.value | (1 << pin));
        Q.delay(randomDelay())
          .then((function(pin) {
              return function() {
                ic.send(ic.value ^ (1 << pin));
              };
            })(pin));
        return Q.delay(randomDelay());
      }).then(function() {
        dfrd.resolve();
      });

      return dfrd.promise;
    },

    reset = function reset() {
      ic.send(0);
      return Q();
    };

  this.repl.inject({
    ic: ic
  });

  oneAfterAnother()
    .then(reset)
    .then(oneAtATime)
    .then(reset)
    .then(pingPong)
    .then(reset)
    .then(blinkenLights)
    .then(reset);
});
