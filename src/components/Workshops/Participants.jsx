import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";

import { standardDeviation } from "../../utils/standardDeviation";
import api from "../../api/APIHandler";

import { average } from "../../utils/average";
import WSTable from "../partials/WSTable";

const Participants = ({ medianParams, jsonFile, computedDatas, results, id }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [WSResults, setWSResults] = useState(null);
  const [detailsTable, setDetailsTable] = useState(null);

  useEffect(() => {
    api
      .get(`/aggregator/workshopsandresults/`)
      .then((res) => {
        
        const ws = res.data.workshops.filter((w) => w.id === id)[0];
        const resultsTemp = res.data.results.filter((r) => r.workshop_code_id === ws.workshop_code);
  

        const indexDisplayed = computedDatas.parameters.map(param => param.index)

        resultsTemp.map(result => {
          let paramTemp=[];
          result.data.parameters.forEach(param => {
            if (indexDisplayed.includes(param.index)) {paramTemp.push(param)}
          })
          result.data.parameters = paramTemp
        })
        setWSResults(resultsTemp);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  //
  useEffect(() => {
    // Stats à avoir :
    //  - écart type relatif
    //  - nb de modifs
    //  - t°

    if (WSResults) {
      WSResults.map((ws) => {
        // get average of the deviation to median
        const devToMedian = ws.data.parameters.map((param, i) => {
          if (param.value === 0 && medianParams[i] === 0) {
            return 0;
          }
          if (param.value === 0 || medianParams[i] === 0) {
            return 100;
          }
          return Math.round(
            (Math.abs(param.value - medianParams[i]) / medianParams[i]) *
              100,
            1,
          );
        });

        ws.average = Math.round(average(devToMedian), 1);

        // get nbModifs
        ws.nbModifs = ws.data.parameters.filter(
          (param, i) => param.value !== computedDatas.parameters[i].value).length;

        // get nbResults
        ws.nbResults = ws.data.parameters.length;
      });

      const tableTemp = {
        titles: ["Groupe / Participant", "Nb modifications", "Nb résultats", "% modifications", "% Proximité à la médiane"],
        data: WSResults.map((ws) => [
          ws.group_name,
          ws.nbModifs,
          ws.nbResults,
          `${Math.round((ws.nbModifs / ws.nbResults) * 100, 0)}%`,
          ws.average,
        ]),
      };

      setDetailsTable(tableTemp);
    }
  }, [WSResults]);

  return (
    <div className="main_container users-page">
      {isLoading && (
        <div id="sim_loader" className="modal-parent flex-item jcenter acenter">
          <Loader type="Oval" color="var(--mainColor)" height={100} width={100} />
        </div>
      )}

      <h1 className="container_title">Participants</h1>

      <h3 className="container_secondary_title">Détails</h3>

      {detailsTable && <WSTable table={detailsTable} numberDisplayed="all" />}
    </div>
  );
};

export default Participants;
