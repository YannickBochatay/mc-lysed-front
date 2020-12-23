import React from 'react'
import ParametersDistributionChart from "./ParametersDistributionChart";

const ParametersDistributionBox = ({data}) => {
    return (
        <div className="parameter_distribution_box">
            <h5>{data.name}</h5>
            <h5>{data.description}</h5>
            <ParametersDistributionChart data={data} />
        </div>
    )
}

export default ParametersDistributionBox
