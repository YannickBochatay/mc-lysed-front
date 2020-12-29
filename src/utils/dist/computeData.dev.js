"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeData = computeData;

var _median = require("utils/median");

var _average = require("utils/average");

var _standardDeviation = require("utils/standardDeviation");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function computeData(wsData, jsonData) {
  // function used to get all datas needed to display
  //     - mean, median, stdev, ambitious, used, isComplete
  //TODO : handle list type parameter
  //TODO : calculate the ambition
  var onlyUnique = function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  };

  var categories = [];
  wsData.results.map(function (res) {
    return res.parameters.map(function (param) {
      return categories.push(param.category);
    });
  });
  var uniqueCategories = categories.filter(onlyUnique);
  var isComplete = jsonData.categories.map(function (category) {
    return uniqueCategories.includes(category.data.name);
  }).filter(function (v) {
    return !v;
  }).length > 0 ? false : true;
  var finalDatas = {
    parameters: [],
    uniqueCategories: uniqueCategories,
    isComplete: isComplete
  };
  var wsParams = wsData.results.map(function (result) {
    return result.parameters;
  }).reduce(function (a, v) {
    return [].concat(_toConsumableArray(a), _toConsumableArray(v));
  });
  jsonData.categories.map(function (category, i) {
    if (uniqueCategories.includes(category.data.name)) {
      category.parameters.map(function (param, j) {
        finalDatas.parameters.push(_objectSpread({
          category: category.data.name,
          color: category.data.color,
          colorHover: category.data.colorHover
        }, param.type, {}, param.data));
        var wsValues = wsParams.filter(function (v) {
          return v.index === param.data.index;
        }).map(function (v) {
          return v.value;
        });
        finalDatas.parameters[finalDatas.parameters.length - 1].wsValues = wsValues;
        finalDatas.parameters[finalDatas.parameters.length - 1].median = Math.round((0, _median.median)(wsValues), 1);
        finalDatas.parameters[finalDatas.parameters.length - 1].average = Math.round((0, _average.average)(wsValues), 1);
        finalDatas.parameters[finalDatas.parameters.length - 1].stdev = Math.round((0, _standardDeviation.standardDeviation)(wsValues), 1);
        finalDatas.parameters[finalDatas.parameters.length - 1].stdevRel = Math.round(finalDatas.parameters[finalDatas.parameters.length - 1].stdev / finalDatas.parameters[finalDatas.parameters.length - 1].average * 100, 1);
        finalDatas.parameters[finalDatas.parameters.length - 1].nbModif = wsValues.filter(function (v) {
          return v !== param.data.value;
        }).length;
        finalDatas.parameters[finalDatas.parameters.length - 1].nbResults = wsValues.length; //ambition to add
      });
    }
  });

  var setTableDatas = function setTableDatas(data, type, key) {
    var table = {
      titles: ["Category", "Parameter", type]
    };
    var tableRev = {
      titles: table.titles
    };
    var tableData = [];
    data.parameters.map(function (param) {
      tableData.push([param.category, param.name, param[key]]);
    });
    table.data = _toConsumableArray(tableData.sort(function (a, b) {
      return b[2] - a[2];
    }));
    tableRev.data = _toConsumableArray(tableData.sort(function (a, b) {
      return a[2] - b[2];
    }));
    return [_objectSpread({}, table), _objectSpread({}, tableRev)];
  };

  var _setTableDatas = setTableDatas(finalDatas, "Nb de modifications", "nbModif"),
      _setTableDatas2 = _slicedToArray(_setTableDatas, 2),
      nbModifTable = _setTableDatas2[0],
      nbModifRevTable = _setTableDatas2[1];

  var _setTableDatas3 = setTableDatas(finalDatas, "Ecart type relatif", "stdevRel"),
      _setTableDatas4 = _slicedToArray(_setTableDatas3, 2),
      consensusTable = _setTableDatas4[0],
      consensusRevTable = _setTableDatas4[1];

  finalDatas.nbModifTable = nbModifTable;
  finalDatas.nbModifRevTable = nbModifRevTable;
  finalDatas.consensusTable = consensusTable;
  finalDatas.consensusRevTable = consensusRevTable;
  return finalDatas;
}

;