import { median } from "utils/median";
import { average } from "utils/average";
import { standardDeviation } from "utils/standardDeviation";

export function computeData(wsData, jsonData) {
    // function used to get all datas needed to display
    //     - mean, median, stdev, ambitious, used, isComplete

    //TODO : handle list type parameter
    //TODO : calculate the ambition

    console.log(jsonData)

    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index;
    }

    const categories = [];
    wsData.results.map((res) => res.parameters.map((param) => categories.push(param.category)));
    const uniqueCategories = categories.filter(onlyUnique);

    const isComplete =
      jsonData.categories
        .map((category) => uniqueCategories.includes(category.data.name))
        .filter((v) => !v).length > 0
        ? false
        : true;

    let finalDatas = {
      parameters: [],
      uniqueCategories,
      isComplete,
    };

    const wsParams = wsData.results
      .map((result) => result.parameters)
      .reduce((a, v) => [...a, ...v]);

    jsonData.categories.map((category, i) => {
      if (uniqueCategories.includes(category.data.name)) {
        category.parameters.map((param, j) => {
          finalDatas.parameters.push({
            category: category.data.name,
            color: category.data.color,
            colorHover: category.data.colorHover,
            ...param.type,
            ...param.data,
          });

          let wsValues = wsParams.filter((v) => v.index === param.data.index).map((v) => v.value);

          finalDatas.parameters[finalDatas.parameters.length - 1].wsValues = wsValues;
          finalDatas.parameters[finalDatas.parameters.length - 1].median = Math.round(
            median(wsValues),
            1,
          );
          finalDatas.parameters[finalDatas.parameters.length - 1].average = Math.round(
            average(wsValues),
            1,
          );
          finalDatas.parameters[finalDatas.parameters.length - 1].stdev = Math.round(
            standardDeviation(wsValues),
            1,
          );
          finalDatas.parameters[finalDatas.parameters.length - 1].stdevRel = Math.round(
            (finalDatas.parameters[finalDatas.parameters.length - 1].stdev /
              finalDatas.parameters[finalDatas.parameters.length - 1].average) *
              100,
            1,
          );
          console.log(param.data.value, wsValues)
          finalDatas.parameters[finalDatas.parameters.length - 1].nbModif = wsValues.filter(
            (v) => v !== param.data.value,
          ).length;
          finalDatas.parameters[finalDatas.parameters.length - 1].nbResults = wsValues.length;
          //ambition to add
        });
      }
    });

    const setTableDatas = (data, type, key) => {
      let table = { titles: ["Secteur", "Paramêtre", type] };
      let tableRev = { titles: table.titles };

      let tableData = [];
      data.parameters.map((param) => {
        tableData.push([param.category, param.name, param[key]]);
      });

      table.data = [...tableData.sort((a, b) => b[2] - a[2])];
      tableRev.data = [...tableData.sort((a, b) => a[2] - b[2])];

      return [{ ...table }, { ...tableRev }];
    };

    const [nbModifTable, nbModifRevTable] = setTableDatas(
      finalDatas,
      "Nb de modifications",
      "nbModif",
    );
    const [consensusTable, consensusRevTable] = setTableDatas(
      finalDatas,
      "Ecart type relatif",
      "stdevRel",
    );

    finalDatas.nbModifTable = nbModifTable;
    finalDatas.nbModifRevTable = nbModifRevTable;
    finalDatas.consensusTable = consensusTable;
    finalDatas.consensusRevTable = consensusRevTable;

    return finalDatas;
  };