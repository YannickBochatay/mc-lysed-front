import React from "react";

import SimulatorResultsAreaChart from "../simulateur/SimulatorResultsAreaChart";
import Sunburst from "../simulateur/SunburstChart";
import LineChart from "./resGenLinearChart";
import CompoChart from "./compoChart";

const Graph = ({ type, datas }) => {
  const types = {
    Sunburst,
    Line: LineChart,
    CompoChart,
    AreaChart: SimulatorResultsAreaChart,
  };

  const Component = types[type];

  return <Component datas={datas} isXAxis isYAxis />;
};

const ChartContainer = ({
  title,
  subtitle,
  graphData,
  graphType,
  graphText,
  legendData,
  sourceData,
}) => {
  function handleInnerHTML(text) {
    return { __html: text };
  }
  return (
    <div className="flex-item flex-column res-emi-fr-box">
      <h3 dangerouslySetInnerHTML={handleInnerHTML(title)} />

      <p dangerouslySetInnerHTML={handleInnerHTML(subtitle)} />

      <div className="flex-column acenter">
        <div className="top-zone flex-item jbetween acenter">
          <div className="res-chart flex-column">
            <Graph type={graphType} datas={graphData} />
          </div>

          <div className="res-chart-infos flex-column">
            <p dangerouslySetInnerHTML={handleInnerHTML(graphText)} />

            <p className="res-chart-source" dangerouslySetInnerHTML={handleInnerHTML(sourceData)} />
          </div>
        </div>

        <div className="res-chart-legend flex-item jcenter">
          {legendData.map((data, i) => (
            <div key={i} className="flex-item">
              <div className="legend-point" style={{ backgroundColor: data.color }} />

              <div>
                <p>{data.dataKey}</p>
                <p>{data.subText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
