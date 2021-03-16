import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faTimesCircle } from "@fortawesome/free-regular-svg-icons";

import Slider from "@material-ui/core/Slider";
import SimulatorInformationBox from "components/simulateur/SimulatorInformationBox";
import "styles/simParametreSlide.css";

const SimParametreSlide = ({ data, value, setOneValue, category }) => {
  const [componentClass, setComponentClass] = useState("");

  // Classes
  const sliderClasses = useSliderStyles({ backgroundColor: category.colorHover });
  const classesToolTip = useToolTipStyles({ backgroundColor: category.colorHover });

  useEffect(() => {
    if (data.expert) {
      setComponentClass("mode-expert param-container-normal");
    } else setComponentClass("param-container-normal");
  }, [data.expert]);

  const { unit } = data;
  const sliderStep = data.step; // (data.max-data.min)/100
  const classes = useStyles();
  const expanded = componentClass.includes("expanded");

  const getMarks = () => {
    const values = [
      { value: data.min, label: `${data.min}${data.unit}` },
      { value: data.value },
      { value: data.max, label: `${data.max}${data.unit}` },
    ];

    if (data.min === data.value || data.max === data.value) {
      values.splice(1, 1);
    }

    return values;
  };

  const handleChange = (_, val) => {
    setOneValue(val, data.index);
  };

  function toggleClass() {
    let componentClassSt = "";
    if (data.expert) componentClassSt += "mode-expert";
    if (componentClass.includes("param-container-normal")) {
      setComponentClass(`${componentClassSt} param-container-expanded`);
    } else {
      setComponentClass(`${componentClassSt} param-container-normal`);
    }
  }

  function handleValue() {
    if (unit === "%") {
      return Math.round(value);
    }
    return value[0];
  }

  // Memoize component and forward ref in order to be able to pass a prop to the
  // ValueLabelComponent component for the Slider otherwise the Tooltip has it's ref lost
  // resulting in a tooltip that disappears / reappears on mouseup.

  const CustomValueLabel = React.useMemo(() => {
    return React.forwardRef(
      ({ children, value, valueLabelFormat, valueLabelDisplay, ...restProps }, ref) => {
        return (
          <Tooltip
            {...restProps}
            classes={classesToolTip}
            ref={ref}
            enterTouchDelay={0}
            placement="top"
            title={value}
            arrow
          >
            {children}
          </Tooltip>
        );
      },
    );
  }, []);

  return (
    <div className={componentClass} key={data.index}>
      <div className="param-header flex-item nomarge nopad">
        <h6 className="param-name nomarge">{data.name}</h6>

        <button type="button" className="see-more-btn icon-box nomarge nopad" onClick={toggleClass}>
          {!expanded && <FontAwesomeIcon icon={faQuestionCircle} />}
          {expanded && <FontAwesomeIcon icon={faTimesCircle} />}
        </button>
      </div>
      {data.description && <p className="small-param-desc">{data.description}</p>}

      <div className={classes.root}>
        <div className={classes.margin} />
        <Slider
          key={data.index}
          classes={{
            root: sliderClasses.root,
            thumb: sliderClasses.thumb,
            track: sliderClasses.track,
            rail: sliderClasses.rail,
            mark: sliderClasses.mark,
          }}
          defaultValue={handleValue()}
          aria-labelledby="discrete-slider-always"
          min={data.min}
          max={data.max}
          step={sliderStep}
          marks={getMarks()}
          scale={(x) => x + data.unit}
          ValueLabelComponent={CustomValueLabel}
          valueLabelDisplay="auto"
          onChangeCommitted={handleChange}
          track="normal"
        />
      </div>

      {expanded && <SimulatorInformationBox data={data} />}
    </div>
  );
};

/** STYLES HOOKS */
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  margin: {
    height: 0,
  },
}));

const useToolTipStyles = makeStyles((theme) => ({
  tooltip: {
    color: "white",
    fontSize: "1.1em",
    backgroundColor: (props) => props.backgroundColor,
  },
  arrow: {
    color: (props) => props.backgroundColor,
  },
}));

const useSliderStyles = makeStyles({
  root: {
    color: "#E4E4E4",
    height: 8,
  },
  thumb: {
    height: 16,
    width: 16,
    borderRadius: 0,
    border: `2px solid white`,
    backgroundColor: (props) => props.backgroundColor,
    marginTop: -5,
    marginLeft: -7,
    "&:focus,&:hover,&$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {},
  track: {
    height: 5,
    borderRadius: 1,
    color: "#C7C7C7",
  },
  rail: {
    height: 5,
    borderRadius: 1,
  },
  mark: {
    backgroundColor: "#C7C7C7",
    height: 12,
    width: 3,
    marginTop: -2.5,
  },
});

export default SimParametreSlide;
