import { average } from "utils/average";

export function standardDeviation(values) {
    var avg = average(values);
  
    var squareDiffs = values.map(function (value) {
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });
  
    var avgSquareDiff = average(squareDiffs);
  
    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  }