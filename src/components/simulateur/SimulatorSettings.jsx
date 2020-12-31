import React from "react";
import SimulatorCategory from "components/simulateur/SimulatorCategory";
import SimulatorParameterList from "components/simulateur/SimulatorParameterList";
import SimulatorParameterSlider from "components/simulateur/SimulatorParameterSlider";
import { makeStyles } from "@material-ui/core";

const SimulatorSettings = ({ categories, results, values, modeExpert, handleValue }) => {
  function handleParameterType(cat, param, key, values) {
    // TODO New implementation of handleParameterType
    // issue: param.type needs to be a string eg: "list", "slider"
    // for now the object is as follows: {param.type.list: 1, param.type.slider: 0}

    const parameterProps = {
      key: key,
      data: param.data,
      value: values[param.data.index],
      setOneValue: handleValue,
      cat: cat.data,
    };

    const paramComponent = {
      list: <SimulatorParameterList {...parameterProps} />,
      slider: <SimulatorParameterSlider {...parameterProps} />,
    };

    //gestion mode expert
    if (!param.data.expert || (param.data.expert && modeExpert)) {
      //gestion type de paramètre
      const type = param.type;
      // TODO if param.type resolves to a string, we can access the component with paramComponent[param.type]
      return paramComponent[type.list ? "list" : type.slider ? "slider" : null];
    }
  }

  return categories.map((category, i) => {
    return (
      <div
        key={category.data.name}
        className="sim-cat-params-box"
        style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#E5EAEC" }}
      >
        <SimulatorCategory
          key={category.data.index}
          data={category.data}
          index={i}
          results={results.jaugeDatas[i]}
        />
        <div className="sim-param-box grid-item">
          {category.parameters.map((parameter) => {
            const { data, type } = parameter;
            const parameterProps = { value: values[data.index], category: category.data, data };
            return type.list ? (
              <SimulatorParameterList key={data.name} {...parameterProps} />
            ) : type.slider ? (
              <SimulatorParameterSlider key={data.name} {...parameterProps} />
            ) : null;
          })}
        </div>
      </div>
    );
  });
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.main,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.secondary,
    },
  },
}));

export default SimulatorSettings;
