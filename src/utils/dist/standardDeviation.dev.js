"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.standardDeviation = standardDeviation;

var _average = require("utils/average");

function standardDeviation(values) {
  var avg = (0, _average.average)(values);
  var squareDiffs = values.map(function (value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  var avgSquareDiff = (0, _average.average)(squareDiffs);
  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}