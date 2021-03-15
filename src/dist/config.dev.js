"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESULTS_SAMPLE_DISPLAY = exports.RESULTS_TITLE = exports.VALUES_TITLE = exports.GSHEET_NAME = void 0;
var GSHEET_NAME = "idSheet-Lysed";
exports.GSHEET_NAME = GSHEET_NAME;
var VALUES_TITLE = "Mesures sur le territoire - 2030";
exports.VALUES_TITLE = VALUES_TITLE;
var RESULTS_TITLE = "Impacts sur le territoire - 2030";
exports.RESULTS_TITLE = RESULTS_TITLE;
var RESULTS_SAMPLE_DISPLAY = [{
  key: "climate",
  subtitle: "Émissions Totales",
  title: "Climat",
  graphType: "Chart",
  priority: "main"
}, {
  key: "energy",
  subtitle: "Consommation",
  title: "Energie",
  graphType: "Compo",
  priority: "main"
}, {
  key: "air",
  title: "Qualité de l'air et consommation foncière",
  graphType: null,
  priority: "secondary"
}];
exports.RESULTS_SAMPLE_DISPLAY = RESULTS_SAMPLE_DISPLAY;