"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.average = average;

function average(data) {
  var sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);
  var avg = sum / data.length;
  return avg;
}