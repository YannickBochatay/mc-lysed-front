import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const ResultsIndicator = ({ indicator, i, color }) => {
  return (
    <div key={i} className="indicator flex-column acenter">
      <div className="results-figure flex-item" style={{ color }}>
        {indicator.value}
        {indicator.unit}

        {indicator.infos && (
          <LightTooltip title={<>{parse(indicator.infos)}</>}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </LightTooltip>
        )}
      </div>

      <p className="results-title">{indicator.name}</p>
    </div>
  );
};

export default ResultsIndicator;
