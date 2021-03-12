import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLongArrowAltUp,
  faLongArrowAltDown,
} from "@fortawesome/free-solid-svg-icons";

import api from "../api/APIHandler";
import IndicatorMain from "../components/partials/IndicatorMain";
import ParametersDistributionBox from "../components/partials/ParametersDistributionBox";
import ParametersTables from "../components/partials/ParametersTables";
import WSTable from "../components/partials/WSTable";
import Modal from "../components/partials/Modal";
import ModalOptionsWorkshop from "../components/Workshops/ModalOptionsWorkshop";
import ModalDeleteWorkshop from "../components/Workshops/ModalDeleteWorkshop";
import Participants from "../components/Workshops/Participants";

import { getValuesFormatted } from "../utils/getValuesFormatted";
import { getUrl } from "../utils/getUrl";
import { computeData } from "../utils/computeData";
import "../styles/workshop_infos.css";

// TO DO : put in a config js
const aggregatorInfos = {
  // TO DO : gérer le https
  lysed: {
    front: [
      "http://localhost:3000",
      "http://lysed.mission-climat.io/",
      "https://lysed.mission-climat.io/",
    ],
    back: "http://localhost:4000",
    spreadsheetId: "1PwIpCzK59DMAn2pMWTwfR96iX2RxVNSkLcU5wt9BqeE",
  },
  lysed_prod_heroku: {
    front: ["https://mc-lysed.herokuapp.com/", "http://mc-lysed.herokuapp.com//"],
    back: "https://mc-lysed.herokuapp.com",
    spreadsheetId: "1PwIpCzK59DMAn2pMWTwfR96iX2RxVNSkLcU5wt9BqeE",
  },
  national: {
    front: ["http://mission-climat.io/", "https://mission-climat.io/"],
    back: "https://mission1degre5server.herokuapp.com",
    spreadsheetId: "1aXmD5u-MIiRPq0MYZ2DPFR7TWOVQezS8zJkgTLN-zHk",
  },
};

const addNonDisplayedValues = (values, jsonFile) => {
  let finalValues = [];
  let counter = 0;
  jsonFile.categories.map(cat => {
    cat.parameters.map(param => {
      if (param.data.displayed) {
        finalValues.push(values[counter])
        counter ++
      }
      else {
        finalValues.push([param.data.value])
      }
    })
  })
  return finalValues
}

const WorkshopInfos = (props) => {
  // data got from the workshop api
  const [workshopData, setWorkshopDataData] = useState(null);

  // initial data from the MC version used for the workshop
  // (with parameters & categories infos (colors, step, min, max....))
  const [jsonFile, setJsonFile] = useState({});

  // data computed from workshop & json with average, median, etc.
  const [computedDatas, setComputedDatas] = useState(null);

  // true if all the sectors have been worked during workshop
  // (if not, there is no relevant complete result)
  const [results, setResults] = useState(null);

  const [indicators, setIndicators] = useState(null);

  const [medianParams, setMedianParams] = useState(null);
  const [meanParams, setMeanParams] = useState(null);
  const [missionClimatVersion, setMissionClimatVersion] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [page, setPage] = useState("Synthèse");
  const [sector, setSector] = useState("Habitat"); // TO DO : generic init
  const [sectorTable, setSectorTable] = useState(null);

  // MODALS
  const [modalOptionsWS, setModalOptionsWS] = useState(false);
  const [modalDeleteWS, setModalDeleteWS] = useState(false);


  const [time, setTime] = useState(Date.now());

  const id = props.match.params.id;

  // GET WORKSHOP DATA
  useEffect(() => {
    api
      .get(`/aggregator/workshop/${id}/`)
      .then((res) => {
        setWorkshopDataData(res.data);

        console.log("wokshopdata loaded", Date.now() - time);

        // handle case if results
        if (res.data.results.length !== 0) {
          // getMissionClimatVersion
          for (const aggregator in aggregatorInfos) {
            aggregatorInfos[aggregator]["front"].map((version) => {
              if (res.data.results[0].url.includes(version)) {
                setMissionClimatVersion(aggregator);
              }
            });
          }
          console.log("MC version identified", Date.now() - time);
        } else {
          // handle case no results yes
          setIsLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // GET JSON DATA
  useEffect(() => {
    api
      .get("/sheet/jsonfile")
      .then((res) => {
        console.log("json loaded", Date.now() - time);
        setJsonFile(res.data);
        const computedDatasTemp = computeData(workshopData, res.data);
        setComputedDatas(computedDatasTemp);
        console.log("data computed", Date.now() - time);

        setMedianParams(computedDatasTemp.parameters.map((v) => [v.median]));
      })
      .catch((err) => console.log(err));
  }, [missionClimatVersion]);

  // GET RESULTS DATA
  useEffect(() => {
    if (medianParams && missionClimatVersion) {
      const valuesFormatted = getValuesFormatted(medianParams, jsonFile.options.unit);
      api
        .patch(`/sheet/update/${aggregatorInfos[missionClimatVersion].spreadsheetId}`, {
          values: valuesFormatted,
        })
        .then((res) => {
          const resTemp = res.data.results;
          setResults(resTemp);
          console.log("results received", Date.now() - time);
          const medianParamsComplete = addNonDisplayedValues(medianParams, jsonFile)
          setUrl(getUrl(medianParamsComplete, jsonFile.parameters));
          setIsLoading(false);

          const indicatorsTemps = [];
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

  // GET SECTOR TABLE (PARAMETERS)
  useEffect(() => {
    if (computedDatas) {
      const tableTemp = {
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
            `${((param.nbModif / param.nbResults) * 100).toFixed(2)} %`,
          ]);
        }
      });
      setSectorTable({ ...tableTemp });
    }
  }, [computedDatas, sector]);

  const handleSectorsDetailTable = (table, sector) => {
  
    const titlesFinal = [];
    table.titles.map((v,i)=>{
      if (i>0) {titlesFinal.push(v)}
    })
  

    let sectorData = [...table.data.filter((line) => line[0] === sector)];
    if (sectorData.length === 0) {
      return null;
    }

    let dataFinal=[];
    sectorData.map((line) => {
      let data=[];
      line.map((v,i)=>{
        if (i>0) {data.push(v)}
      })
      dataFinal.push(data)
    });

    return { titles: titlesFinal, data: dataFinal };
  };

  const handleDeleteOption = () => {
    setModalDeleteWS(true);
  }

  const handleDeleteWS = (admin_code) => {
    api
      .delete(`/aggregator/workshop/`, `${id}/?admin_code=${admin_code}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };



  return (
    <div id="workshop_infos" className="flex-column acenter">
      {isLoading && (
        <div id="sim_loader" className="modal-parent flex-item jcenter acenter">
          <Loader type="Oval" color="var(--mainColor)" height={100} width={100} />
        </div>
      )}

      <Modal isOpen={modalOptionsWS} closeModal={() => setModalOptionsWS(false)} cancelButton>
        <ModalOptionsWorkshop
          openDelete={handleDeleteOption}
          closeModal={() => setModalOptionsWS(false)}
          url={url}
          api={api}
          id={id}
        />
      </Modal>

      <Modal isOpen={modalDeleteWS} closeModal={() => setModalDeleteWS(false)}>
        <ModalDeleteWorkshop
          closeModal={() => setModalDeleteWS(false)}
          handleDeleteWS={handleDeleteWS}
        />
      </Modal>

      {/* /// HEADER /// */}
      {workshopData && (
        <div className="main_container workshop-summary">
          {/* 1 : NAME */}
          <h1 className="workshop-name">{workshopData.workshop_name}</h1>

          {/* 2 : NAV */}
          {workshopData.results.length > 0 && (
            <div className="workshop-nav flex-item acenter jcenter">
              <button
                className={page === "Synthèse" ? "btn tab-btn active" : "btn tab-btn"}
                type="button"
                onClick={() => setPage("Synthèse")}
              >
                Synthèse
              </button>
              <button
                className={page === "Secteurs" ? "btn tab-btn active" : "btn tab-btn"}
                type="button"
                onClick={() => setPage("Secteurs")}
              >
                Secteurs et Paramètres
              </button>
              <button
                className={page === "Participants" ? "btn tab-btn active" : "btn tab-btn"}
                type="button"
                onClick={() => setPage("Participants")}
              >
                Participants
              </button>
            </div>
          )}

          {/* 3 : SPECS + MENU */}
          <div className="workshop-header-right flex-item acenter">
            <div className="workshop-specs flex-item acenter">
              <FontAwesomeIcon icon={faUser} />
              <p>{workshopData.results.length}</p>
            </div>

            <button className="btn primary-btn" type="button" onClick={() => setModalOptionsWS(true)}>
              Options
            </button>
          </div>
        </div>
      )}

      {/* /// SYNTHESE /// */}
      {page === "Synthèse" && (
        <>
          {/* >> RESULTATS */}
          {indicators && (
            <div className="main_container result-box">
              <h2 className="container_title">Résultats</h2>

              <h3 className="container_secondary_title">Impacts généraux</h3>

              {/* BADGES */}
              <div className="indicator_box main-box flex-item">
                {indicators
                  .filter((v) => v.impactGnl === "1")
                  .map((indicator, i) => (
                    <IndicatorMain
                      key={i}
                      icon={i}
                      value={indicator.value}
                      unit={indicator.unit}
                      description={indicator.name}
                    />
                  ))}
              </div>

              {/* TABLE */}
              <WSTable table={results.aggregator.impactGnlTable} numberDisplayed="all" />

              <h3 className="container_secondary_title">Impacts sur le territoire</h3>

              {/* BADGES */}
              <div className="indicator_box secondary-box flex-item">
                {indicators
                  .filter((v) => v.impactLcl === "1")
                  .map((indicator,i) => (
                    <IndicatorMain
                      key={i}
                      value={indicator.value}
                      unit={indicator.unit}
                      description={indicator.name}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* >> PARAMETRES */}
          {indicators && (
            <div className="main_container">
              <h2 className="container_title">Paramètres clés</h2>

              <h3 className="container_secondary_title">Contributions</h3>

              <div className="param-box flex-item acenter jbetween">
                <ParametersTables
                  title={
                    <h4 className="tab-btn active">
                      <FontAwesomeIcon icon={faLongArrowAltUp} />
                      Les plus utilisés
                    </h4>
                  }
                  table={computedDatas.nbModifTable}
                  numberDisplayed={3}
                />
                <ParametersTables
                  title={
                    <h4 className="tab-btn active">
                      <FontAwesomeIcon icon={faLongArrowAltDown} />
                      Les moins utilisés
                    </h4>
                  }
                  table={computedDatas.nbModifRevTable}
                  numberDisplayed={3}
                />
              </div>

              <h3 className="container_secondary_title">Consensus</h3>

              <div className="param-box flex-item acenter jbetween">
                <ParametersTables
                  title={
                    <h4 className="tab-btn active">
                      <FontAwesomeIcon icon={faLongArrowAltUp} />
                      Les plus consensuels
                    </h4>
                  }
                  table={computedDatas.consensusRevTable}
                  numberDisplayed={3}
                />
                <ParametersTables
                  title={
                    <h4 className="tab-btn active">
                      <FontAwesomeIcon icon={faLongArrowAltDown} />
                      Les moins consensuels
                    </h4>
                  }
                  table={computedDatas.consensusTable}
                  numberDisplayed={3}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* /// SECTEURS /// */}
      {page === "Secteurs" && (
        <>
          {computedDatas && (
            <div className="main_container sector-page">
              {page === "Secteurs" && (
                <div className="sectors-menu flex-item acenter jcenter">
                  {computedDatas.uniqueCategories.map((cat, i) => (
                    <button
                      className={sector === cat ? "btn tab-btn active-bis" : "btn tab-btn"}
                      type="button"
                      id={i}
                      onClick={() => setSector(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <h2 className="container_title">Détails par secteur</h2>

              <h3 className="container_secondary_title">Secteurs - Résumé</h3>

              {results && (
                <WSTable
                  table={handleSectorsDetailTable(
                    { ...results.aggregator.sectorsDetailTable },
                    sector,
                  )}
                  numberDisplayed="all"
                />
              )}

              <h3 className="container_secondary_title">Paramètres - Résumé</h3>

              {sectorTable && <WSTable table={sectorTable} numberDisplayed="all" />}

              <h3 className="container_secondary_title">Paramètres - Distribution</h3>

              <div id="parameters_distribution_container" className="flex-item jbetween">
                {computedDatas.parameters
                  .filter((param) => param.category === sector)
                  .map((param, i) => (
                    <ParametersDistributionBox key={i} data={param} />
                  ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* /// PARTICIPANTS /// */}
      {page === "Participants" && (
        <Participants
          medianParams={medianParams}
          jsonFile={jsonFile}
          computedDatas={computedDatas}
          results={results}
          id={id}
        />
      )}
    </div>
  );
};

export default WorkshopInfos;
