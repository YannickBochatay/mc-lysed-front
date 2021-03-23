import React, { useContext } from "react";
import { GlobalContext } from "Contexts/GlobalContext";
import * as actions from "Contexts/actions";

import SimulatorCategory from "components/simulateur/SimulatorCategory";
import SimulatorParameterList from "components/simulateur/SimulatorParameterList";
import SimulatorParameterSlider from "components/simulateur/SimulatorParameterSlider";
import { makeStyles } from "@material-ui/core";

const SimulatorParameter = ({ slider, list, ...rest }) => {
  if (list) {
    return <SimulatorParameterList {...rest} />;
  }
  if (slider) {
    return <SimulatorParameterSlider {...rest} />;
  }
  return null;
};

const SimulatorSettings = ({ modeExpert }) => {
  const classes = useStyles();

  const { globalState, dispatch } = useContext(GlobalContext);

  const values = globalState.values;
  const results = globalState.results;
  const categories = globalState.categories;

  const handleValue = (value, index) => {
    dispatch({
      type: actions.UPDATE_VALUE,
      value,
      index,
    });
  };

  return categories.map((category, i) => {
    return (
      <div key={category.data.index} className={`sim-cat-params-box ${classes.container}`}>
        <SimulatorCategory
          key={category.data.index}
          data={category.data}
          index={i}
          results={results.jaugeDatas[i]}
        />
        <div className="sim-param-box grid-item">
          {category.parameters.map(
            (param) =>
              param.data.displayed ? 
                <SimulatorParameter
                  key={param.data.index}
                  setOneValue={handleValue}
                  slider={Boolean(param.type.slider)}
                  list={Boolean(param.type.list)}
                  value={values[param.data.index]}
                  category={category.data}
                  data={param.data}
                />
              :
              <></>,
          )}
        </div>
      </div>
    );
  });
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.secondary,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
  },
}));

export default SimulatorSettings;
