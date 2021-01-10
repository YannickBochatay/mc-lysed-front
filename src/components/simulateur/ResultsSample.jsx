import React, { useState, useContext } from "react";
import { GlobalContext } from "Contexts/GlobalContext";
import * as actions from "Contexts/actions";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faCog, faLink } from "@fortawesome/free-solid-svg-icons";

import ResultsIndicator from "./ResultsIndicator";
import CompoChart from "../resultats/compoChart";
// import AreaChart from "../resultats/Area";

// MODALS
import Modal from "../partials/Modal";
import ModalVSWorkshopType from "../Workshops/ModalVSWorkshopType";
import ModalVSConfigureScenario from "../Workshops/ModalVSConfigureScenario";
import ModalVSGeneralConfirmation from "../Workshops/ModalVSGeneralConfirmation";
import ModalVSConfirmationSent from "../Workshops/ModalVSConfirmationSent";
import ModalSimValidation from "./ModalSimValidation";

import { RESULTS_TITLE, RESULTS_SAMPLE_DISPLAY } from "config";

const ResultsSample = ({ jsonFile }) => {
  const { globalState } = useContext(GlobalContext);

  const results = globalState.results;
  const values = globalState.values;

  const [modal, setModal] = useState("");

  const [modalVSWorkshopType, setModalVSWorkshopType] = useState(false);
  const [modalVSConfigureScenario, setModalVSConfigureScenario] = useState(false);
  const [modalVSGeneralConfirmation, setModalVSGeneralConfirmation] = useState(false);
  const [modalVSConfirmationSent, setModalVSConfirmationSent] = useState(false);
  const [modalSimValidation, setModalSimValidation] = useState(false);

  const width = window.innerWidth;

  const secondaryColor = "var(--lightgrey)";
  const fontColor = "black";

  const indicatorObjectives = { climate: -50, energy: -50, air: [-70, -70] };

  const setWorkshopType = (type) => {
    // setModal(type);

    if (type == "workshop") {
      setModalVSWorkshopType(false);
      setModalVSConfigureScenario(true);
    }
    if (type == "general") {
      setModalVSWorkshopType(false);
      setModalVSGeneralConfirmation(true);
    }
  };

  const handleValidateScenario = () => {
    // setModal("worksho");
    setModalVSWorkshopType(true);
  };

  function handleIndicatorColor(data, objective) {
    const obj = Array.isArray(objective) ? objective[0] : objective;

    const objReached = (data / obj) * 100;
    return objReached >= 100
      ? "#B0E440"
      : objReached >= 50 && objReached < 100
      ? "#FFF176"
      : "#EB1818";
  }

  function handleIndicatorWidth(length) {
    return `calc(${100 / length}% - ${((length - 1) * 10) / 3}px`;
  }

  if (width > 600) {
    return (
      <section className="sim-results-box">
        <Modal
          isOpen={modalVSWorkshopType}
          closeModal={() => setModalVSWorkshopType(false)}
          okButton={false}
        >
          <ModalVSWorkshopType
            closeModal={() => setModalVSWorkshopType(false)}
            setWorkshopType={setWorkshopType}
          />
        </Modal>

        <Modal
          isOpen={modalVSGeneralConfirmation}
          closeModal={() => setModalVSGeneralConfirmation(false)}
          okButton={false}
        >
          <ModalVSGeneralConfirmation
            closeModal={() => setModalVSGeneralConfirmation(false)}
            results={results}
            val={values}
            jsonFile={jsonFile}
          />
        </Modal>

        <Modal
          isOpen={modalVSConfigureScenario}
          closeModal={() => setModalVSConfigureScenario(false)}
          okButton={false}
        >
          <ModalVSConfigureScenario
            results={results}
            val={values}
            jsonFile={jsonFile}
            closeModal={() => setModalVSConfigureScenario(false)}
            setModalVSConfirmationSent={setModalVSConfirmationSent}
          />
        </Modal>

        <Modal
          isOpen={modalVSConfirmationSent}
          closeModal={() => setModalVSConfirmationSent(false)}
          okButton={false}
        >
          <ModalVSConfirmationSent closeModal={() => setModalVSConfirmationSent(false)} />
        </Modal>

        <Modal
          isOpen={modalSimValidation}
          closeModal={() => setModalSimValidation(false)}
          okButton={false}
        >
          <ModalSimValidation
            closeModal={() => setModalSimValidation(false)}
            onClick={handleValidateScenario}
            results={results}
          />
        </Modal>

        <div id="results-top-box" className="title">
          <h1>{RESULTS_TITLE}</h1>
        </div>

        {RESULTS_SAMPLE_DISPLAY.map((item) => {
          const title = item.title;
          const subtitle = item.subtitle;
          const indicators = results.indicators;
          const graphs = results.graphs[item.key];

          return (
            <div key={item.key} id="results-climat-box" className="flex-item flex-column">
              <h4>{title}</h4>
              <div className="results-content-box">
                <div className="graph-box">
                  {subtitle && <p>{subtitle}</p>}
                  <div className="graph-compo">
                    {item.graphType && <CompoChart datas={graphs} />}
                  </div>
                </div>
                <div className="indicators-box">
                  {indicators[item.key].main && (
                    <div className="indicators-main-box">
                      <ResultsIndicator
                        indicator={indicators[item.key].main[0]}
                        backgroundColor={handleIndicatorColor(
                          indicators[item.key].main[0].value,
                          indicatorObjectives[item.key],
                        )}
                        color={fontColor}
                        width="100%"
                      />
                    </div>
                  )}

                  <div className="indicators-secondary-box">
                    {indicators[item.key].secondary.map((indicator, i) => {
                      return (
                        <ResultsIndicator
                          key={indicator.name}
                          i={i}
                          indicator={indicator}
                          backgroundColor={
                            item.priority === "secondary"
                              ? handleIndicatorColor(
                                  indicator.value,
                                  indicatorObjectives[item.key][i],
                                )
                              : secondaryColor
                          }
                          color={fontColor}
                          width={handleIndicatorWidth(indicators[item.key].secondary.length)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button type="button" className="btn primary-btn sim-main-btn" onClick={() => setModalSimValidation(true)}>
          Valider mon scénario
        </button>
      </section>
    );
  }

  // if (width > 600) {
  //   return (
  //     <section className="sim-results-box flex-item flex-column">
  //       <div id="results-top-box" className="flex-item flex-column">
  //         <h1>Impacts sur le territoire - 2030</h1>
  //         <div id="results-impacts-box" className="flex-item">
  //           <p className="results-title n1">Températures</p>
  //           <div
  //             className="results-figure n2 flex-item"
  //             style={{ backgroundImage: tempColor(), color: "white" }}
  //           >
  //             +{results.impacts.temperature}°C
  //           </div>
  //           <p className="results-legend n3">
  //             Hausse moy. mondiale / 2100 (de {results.impacts.temperatureRange})
  //           </p>
  //           <p className="results-title n4">Scénario GIEC</p>
  //           <div className="results-figure n5 flex-item" style={{ backgroundColor: "#e9e7ec" }}>
  //             {results.impacts.RCP}
  //           </div>
  //           <p className="results-legend n6">
  //             Scénario GIEC de vos mesures (
  //             <a
  //               href="https://leclimatchange.fr/les-elements-scientifiques/"
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               style={{ fontWeight: "bold", color: "#DB7093" }}
  //             >
  //               Plus d'infos
  //             </a>
  //             )
  //           </p>
  //           <p className="results-title n7">Empreinte carbone</p>
  //           <div className="results-figure n8 flex-item" style={{ backgroundColor: "#eda54e" }}>
  //             {results.impacts.empreinteMonde}t
  //           </div>
  //           <p className="results-legend n9">tCO2e / an / hab. en 2030</p>
  //         </div>
  //       </div>

  //       <div id="results-bottom-box" className="flex-item flex-column">
  //         <div id="results-emissions" className="flex-item flex-column">
  //           <h1>Ma projection française</h1>
  //           <div id="results-impacts-box2" className="flex-item">
  //             <p className="results-title b1">Évolution émissions</p>
  //             <div
  //               className="results-figure b2 flex-item"
  //               style={{ backgroundColor: "#40E0D0", color: "#163E59" }}
  //             >
  //               {results.impacts.reductionEmission2030}
  //             </div>
  //             <p className="results-legend b3">Entre 2020 et 2030</p>

  //             <p className="results-title b4">Émissions annuelles</p>
  //             <div
  //               className="results-figure b5 flex-item flex-column"
  //               style={{ backgroundColor: "#40E0D0", color: "#163E59" }}
  //             >
  //               <p>{results.impacts.emissionMoy}</p>
  //               <p className="figure-unit">MtCO2</p>
  //             </div>
  //             <p className="results-legend b6">Entre 2020 et 2030</p>

  //             <p className="results-title b7">Empreinte carbone</p>
  //             <div className="results-figure b8 flex-item" style={{ backgroundColor: "#eda54e" }}>
  //               {results.impacts.empreinteFr}t
  //             </div>
  //             <p className="results-legend b9">tCO2e / an / hab. en 2030</p>
  //           </div>
  //         </div>

  //         <div id="results-emissions-charts-container">
  //           <div className="chart g1">
  //             <AreaChart datas={results.emiSecteurGnl} xOffset={0} yOffset={-150} />
  //           </div>
  //           <p className="g2">Emissions Totales</p>

  //           <div className="chart g3">
  //             <Sunburst datas={results.emiSecteurPie.graph} />
  //           </div>
  //           <p className="g4">Par Secteur / 2030</p>
  //         </div>

  //         <div id="results-button" className="flex-item">
  //           <Link to={{ pathname: "/results", state: { results: results } }}>
  //             <button className="blue-btn">Résultats complets</button>
  //           </Link>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }
  if (width <= 600) {
    return (
      <>
        <section>
          <div id="results-emissions" className="flex-item flex-column">
            <h1>Ma projection française</h1>
            <div id="results-impacts-box2" className="flex-item">
              <p className="results-title b1">Évolution émissions</p>
              <div
                className="results-figure b2 flex-item"
                style={{ backgroundColor: "#40E0D0", color: "#163E59" }}
              >
                {results.impacts.reductionEmission2030}
              </div>
              <p className="results-legend b3">Entre 2020 et 2030</p>

              <p className="results-title b4">Émissions annuelles</p>
              <div
                className="results-figure b5 flex-item flex-column"
                style={{ backgroundColor: "#40E0D0", color: "#163E59" }}
              >
                <p>{results.impacts.emissionMoy}</p>
                <p className="figure-unit">MtCO2</p>
              </div>
              <p className="results-legend b6">Entre 2020 et 2030</p>

              <p className="results-title b7">Empreinte carbone</p>
              <div className="results-figure b8 flex-item" style={{ backgroundColor: "#eda54e" }}>
                {results.impacts.empreinteFr}t
              </div>
              <p className="results-legend b9">tCO2e / an / hab. en 2030</p>
            </div>
            <div id="results-button" className="flex-item">
              <Link to={{ pathname: "/results", state: { results } }}>
                <button type="button" className="blue-btn">
                  Résultats complets
                </button>
              </Link>
            </div>
          </div>
          <div id="results-top-box" className="flex-item flex-column">
            <h1>Ma projection mondiale</h1>
          </div>
        </section>
        <div id="results-impacts-box" className="flex-item">
          <p className="results-title n1">Températures</p>
          <div className="results-figure n2 flex-item" style={{ color: "white" }}>
            +{results.impacts.temperature}
            °C
          </div>
          <p className="results-legend n3">
            Hausse moy. mondiale / 2100 (de {results.impacts.temperatureRange})
          </p>
          <p className="results-title n4">Scénario GIEC</p>
          <div className="results-figure n5 flex-item" style={{ backgroundColor: "#e9e7ec" }}>
            {results.impacts.RCP}
          </div>
          <p className="results-legend n6">
            Scénario GIEC de vos mesures (
            <a
              href="https://leclimatchange.fr/les-elements-scientifiques/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: "bold", color: "#DB7093" }}
            >
              Plus d'infos
            </a>
            )
          </p>
          <p className="results-title n7">Empreinte carbone</p>
          <div className="results-figure n8 flex-item" style={{ backgroundColor: "#eda54e" }}>
            {results.impacts.empreinteMonde}t
          </div>
          <p className="results-legend n9">tCO2e / an / hab. en 2030</p>
        </div>
      </>
    );
  }
};

export default ResultsSample;
