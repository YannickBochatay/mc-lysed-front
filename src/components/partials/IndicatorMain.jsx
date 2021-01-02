import React from "react";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IndicatorMain = ({ icon, value, unit, description }) => {
  return (
    <div className="indicator_main flex-column acenter">
      <FontAwesomeIcon icon={faQuestionCircle} />
      
      <p>
        {value}
        <span>{unit}</span>
      </p>

      <p>{description}</p>
    </div>
  );
};

export default IndicatorMain;
