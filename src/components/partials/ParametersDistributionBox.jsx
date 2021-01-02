import React from "react";
import ParametersDistributionChart from "./ParametersDistributionChart";

const ParametersDistributionBox = ({ data }) => {
  return (
    <div className="parameter_distribution_box">
      <h4 className="tab-btn active">{data.name}</h4>
      <p>{data.description}</p>

      <ParametersDistributionChart data={data} />
    </div>
  );
};

export default ParametersDistributionBox;
