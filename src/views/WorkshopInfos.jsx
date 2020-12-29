import React, { useState, useEffect } from "react";
import api from "api/APIHandler";

import Loader from "react-loader-spinner";
import IndicatorMain from "../components/partials/IndicatorMain";
import IndicatorSecondary from "../components/partials/IndicatorSecondary";
import ParametersDistributionBox from "../components/partials/ParametersDistributionBox";
import ParametersTables from "../components/partials/ParametersTables";
import WSTable from "../components/partials/WSTable";
import Modal from "components/partials/Modal";
import ModalDeleteWorkshop from "components/Workshops/ModalDeleteWorkshop";
import Participants from "components/Workshops/Participants";

import { getValuesFormatted } from "utils/getValuesFormatted";
import { getUrl } from "utils/getUrl";
import { computeData } from "utils/computeData";
import "../styles/workshop_infos.css";


//TO DO : put in a config js
const aggregatorInfos = {
  lysed: {
    front: "http://localhost:3000",
    back: "http://localhost:4000",
    spreadsheetId: "1aXmD5u-MIiRPq0MYZ2DPFR7TWOVQezS8zJkgTLN-zHk",
  },
  national: {
    front: "http://mission-climat.io/",
    back: "https://mission1degre5server.herokuapp.com",
    spreadsheetId: "1aXmD5u-MIiRPq0MYZ2DPFR7TWOVQezS8zJkgTLN-zHk",
  },
};


const WorkshopInfos = (props) => {
  //data got from the workshop api
  const [workshopData, setWorkshopDataData] = useState(null);

  //initial data from the MC version used for the workshop (with parameters & categories infos (colors, step, min, max....))
  const [jsonFile, setJsonFile] = useState({});

  //data computed from workshop & json with average, median, etc.
  const [computedDatas, setComputedDatas] = useState(null);

  // true if all the sectors have been worked during workshop (if not, there is no relevant complete result)
  const [results, setResults] = useState(null);

  const [indicators, setIndicators] = useState(null);

  const [medianParams, setMedianParams] = useState(null);
  const [meanParams, setMeanParams] = useState(null);
  const [missionClimatVersion, setMissionClimatVersion] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [page, setPage] = useState("Synthèse");
  const [sector, setSector] = useState("Habitat"); //TO DO : generic init
  const [sectorTable, setSectorTable] = useState(null);

  //MODALS
  const [modalDeleteWS, setModalDeleteWS] = useState(false);

  const [time, setTime] = useState(Date.now());

  const id = props.match.params.id;

  //GET WORKSHOP DATA
  useEffect(() => {
    api
      .get(`/aggregator/workshop/${id}/`)
      .then((res) => {
        
        console.log(res);
        setWorkshopDataData(res.data);

        console.log("wokshopdata loaded", Date.now() - time);

        //handle case if results
        if (res.data.results.length!==0) {
          // getMissionClimatVersion
          for (const aggregator in aggregatorInfos) {
            if (res.data.results[0].url.includes(aggregatorInfos[aggregator]["front"])) {
              setMissionClimatVersion(aggregator);
              break;
            }
          }
          console.log("MC version identified", Date.now() - time);
        }
        else { //handle case no results yes
          setIsLoading(false)
        }

        
      })
      .catch((err) => console.log(err));
  }, []);

  //GET JSON DATA
  useEffect(() => {
    api
      .get("/sheet/jsonfile")
      .then((res) => {
        console.log("json", res);
        console.log("json loaded", Date.now() - time);
        setJsonFile(res.data);

        const computedDatasTemp = computeData(workshopData, res.data);
        setComputedDatas(computedDatasTemp);
        console.log("data computed", Date.now() - time);

        setMedianParams(computedDatasTemp.parameters.map((v) => [v.median]));
      })
      .catch((err) => console.log(err));
  }, [missionClimatVersion]);

  //GET RESULTS DATA
  useEffect(() => {
    if (medianParams && missionClimatVersion) {
      const valuesFormatted = getValuesFormatted(medianParams, jsonFile.options.unit);
      api
        .patch("/sheet/update/" + aggregatorInfos[missionClimatVersion].spreadsheetId, {
          values: valuesFormatted,
        })
        .then((res) => {
          console.log(res);
          const resTemp = res.data.results;
          setResults(resTemp);
          console.log("results received", Date.now() - time);
          setUrl(getUrl(medianParams, jsonFile.parameters))
          setIsLoading(false);

          let indicatorsTemps = [];
          for (const area in resTemp.indicators) {
            for (const degree in resTemp.indicators[area]) {
              resTemp.indicators[area][degree].map((v) => indicatorsTemps.push(v));
            }
          }
          setIndicators(indicatorsTemps);
        })
        .catch((err) => console.log(err));
    }
  }, [medianParams, missionClimatVersion]);

  //GET SECTOR TABLE (PARAMETERS)
  useEffect(() => {
    if (computedDatas) {
      let tableTemp = {
        titles: [
          "Paramètre",
          "Valeur médiane",
          "Valeur moyenne",
          "Ecart type",
          "Ecart type relatif",
          "Nb modifications",
          "Nb résultats",
          "% modifications",
        ],
        data: [],
      };
      computedDatas.parameters.map((param) => {
        if (param.category === sector) {
          tableTemp.data.push([
            param.name,
            param.median,
            param.average,
            param.stdDev,
            param.stdevRel,
            param.nbModif,
            param.nbResults,
            (param.nbModif / param.nbResults) * 100 + " %",
          ]);
        }
      });
      setSectorTable({ ...tableTemp });
    }
  }, [computedDatas, sector]);

  const handleSectorsDetailTable = (table, sector) => {

    let dataFinal = [...table.data];
    let titlesFinal = [...table.titles];
    dataFinal = dataFinal.filter((line) => line[0] === sector);

    if (dataFinal.length === 0) {
      return null;
    }

    dataFinal.map((line) =>
      line.map((val, i) => {
        if (i > 0) {
          return val;
        }
      }),
    );
    titlesFinal.shift();

    return { titles: titlesFinal, data: dataFinal };
  };
  
  const handleDeleteWS = (admin_code) => {
    api
      .delete(`/aggregator/workshop/`,`${id}/?admin_code=${admin_code}`)
      .then((res) => {console.log(res)})
      .catch((err) => console.log(err));
  }

  return (
    <div id="workshop_infos" className="flex-item acenter">
      {isLoading && (
        <div id="sim_loader" className="modal-parent">
          <div id="sim_loader_content" className="modal-content">
            <Loader type={"Oval"} color="#163E59" height={100} width={100} />
          </div>
        </div>
      )}

      <Modal
          isOpen={modalDeleteWS}
          closeModal={() => setModalDeleteWS(false)}
          okButton={false}
          children={
            <ModalDeleteWorkshop
              closeModal={() => setModalDeleteWS(false)}
              handleDeleteWS={handleDeleteWS}
            ></ModalDeleteWorkshop>
          }
        ></Modal>

      {workshopData && (
        <div className="main_container">
          <h1 className="container_title">{workshopData.workshop_name}</h1>
          <p>Nombre de contributions : {workshopData.results.length}</p>
          <button onClick={() => setModalDeleteWS(true)}>Supprimer l'atelier</button>
          <a href={url} target="_blank"><button>Simulateur avec scénario médian</button></a>
          <div>
            <button onClick={() => setPage("Synthèse")}>Synthèse</button>
            <button onClick={() => setPage("Secteurs")}>Secteurs et Paramètres</button>
            <button onClick={() => setPage("Participants")}>Participants</button>
          </div>
          {page === "Secteurs" && (
            <div>
              {computedDatas.uniqueCategories.map((cat, i) => (
                <button id={i} onClick={() => setSector(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {page === "Synthèse" && (
        <>
          {indicators && (
            <div className="main_container">
              <h1 className="container_title">Résultats</h1>

              <h3 className="container_secondary_title">Impacts généraux</h3>
              <div className="indicator_box">
                {indicators
                  .filter((v) => v.impactGnl === "1")
                  .map((indicator) => (
                    <IndicatorMain
                      value={indicator.value}
                      unit={indicator.unit}
                      description={indicator.name}
                    ></IndicatorMain>
                  ))}
              </div>
              <WSTable table={results.aggregator.impactGnlTable} numberDisplayed="all" />

              <h3 className="container_secondary_title">Impacts sur le territoire</h3>
              <div className="indicator_box">
                {indicators
                  .filter((v) => v.impactLcl === "1")
                  .map((indicator) => (
                    <IndicatorSecondary
                      value={indicator.value}
                      unit={indicator.unit}
                      description={indicator.name}
                    ></IndicatorSecondary>
                  ))}
              </div>
            </div>
          )}

          {indicators && (
            <div className="main_container">
              <h1 className="container_title">Paramètres clés</h1>

              <h3 className="container_secondary_title">Contributions</h3>
              <ParametersTables
                title="les plus utilisés"
                table={computedDatas.nbModifTable}
                numberDisplayed={3}
              />
              <ParametersTables
                title="les moins utilisés"
                table={computedDatas.nbModifRevTable}
                numberDisplayed={3}
              />

              <h3 className="container_secondary_title">Consensus</h3>
              <ParametersTables
                title="les plus consensuels"
                table={computedDatas.consensusRevTable}
                numberDisplayed={3}
              />
              <ParametersTables
                title="les moins consensuels"
                table={computedDatas.consensusTable}
                numberDisplayed={3}
              />
            </div>
          )}
        </>
      )}

      {page === "Secteurs" && (
        <>
          {computedDatas && (
            <div className="main_container">
              <h1 className="container_title">Détails par secteur</h1>

              <h3 className="container_secondary_title">Secteurs / Résumé</h3>

              {results && (
                <WSTable
                  table={handleSectorsDetailTable(
                    { ...results.aggregator.sectorsDetailTable },
                    sector,
                  )}
                  numberDisplayed="all"
                />
              )}

              <h3 className="container_secondary_title">Paramètres / Résumé</h3>

              {sectorTable && <WSTable table={sectorTable} numberDisplayed="all" />}

              <h3 className="container_secondary_title">Paramètres / Distribution</h3>

              <div id="parameters_distribution_container">
                {computedDatas.parameters
                  .filter((param) => param.category === sector)
                  .map((param) => (
                    <ParametersDistributionBox data={param} />
                  ))}
              </div>
            </div>
          )}
        </>
      )}


      {page === "Participants" && (
        <Participants medianParams={medianParams} jsonFile={jsonFile} computedDatas={computedDatas} results={results} id={id}/>
      )}


    </div>
  );
};

export default WorkshopInfos;
