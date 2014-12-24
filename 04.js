'use strict';

var five = require('johnny-five'),
  Board = five.Board,
  Pin = five.Pin,
  Q = require('q'),
  Random = require('random-js'),
  _ = require('lodash-node');

require('q-foreach')(Q);


var MS = 50,
  pins_high = {},
  MAX_PINS_HIGH = 4;

function marquee(pins, iterations) {
  iterations = typeof iterations === 'undefined' ? 8 : iterations;
  return Q.forEach(_.range(0, 4), function (idx) {
    pins[idx].high();
    pins[idx + 4].high();
    return Q.delay(MS)
      .then(function () {
        pins[idx].low();
        pins[idx + 4].low();
      });
  })
    .then(function () {
      if (iterations) {
        return marquee(pins, --iterations);
      }
      return pins;
    });
}

function backAndForth(pins, iterations) {
  iterations = typeof iterations === 'undefined' ? 4 : iterations;
  return Q.forEach(pins, function (pin) {
    pin.high();
    return Q.delay(MS)
      .then(function () {
        pin.low();
      });
  })
    .then(function () {
      if (iterations) {
        return backAndForth(pins.reverse(), --iterations);
      }
      return pins;
    });
}

function blinkenLights(pins) {
  var engine = Random.engines.mt19937().autoSeed(),
    pinDistribution = Random.integer(0, pins.length - 1),
    temporalDistribution = Random.integer(0, 200),
    randomPin = function () {
      return Q(pins[pinDistribution(engine)]);
    },
    randomDelay = function (thing) {
      return Q.delay(temporalDistribution(engine))
        .then(function () {
          return thing;
        });
    },
    high = function (pin) {
      pins_high[pin.addr] = true;
      pin.high();
      return Q(pin);
    },
    low = function (pin) {
      pin.low();
      return randomDelay()
        .then(function () {
          delete pins_high[pin.addr];
          return pin;
        });
    },
    checkPins = function (pin) {
      if (pins_high[pin.addr] || _.keys(pins_high).length === MAX_PINS_HIGH) {
        return Q.reject();
      }
      return Q(pin);
    };

  randomPin()
    .then(checkPins)
    .tap(function () {
      randomDelay()
        .then(function () {
          blinkenLights(pins);
        });
    })
    .then(high)
    .then(randomDelay)
    .then(low)
    .then(function () {
      blinkenLights(pins);
    });
}

new Board()
  .on('ready', function () {
    var pins = _.map(_.range(2, 10), function (addr) {
      return new Pin(addr);
    });

    backAndForth(pins)
      .then(marquee)
      .then(blinkenLights);
  });
