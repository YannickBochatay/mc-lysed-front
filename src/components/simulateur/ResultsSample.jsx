import React, { useState } from "react";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faCog, faLink } from "@fortawesome/free-solid-svg-icons";

import Title from "../partials/Title";
import ResultsIndicator from "./ResultsIndicator";
import CompoChart from "../resultats/compoChart";

// MODALS
import Modal from "../partials/Modal";
import ModalVSWorkshopType from "../Workshops/ModalVSWorkshopType";
import ModalVSConfigureScenario from "../Workshops/ModalVSConfigureScenario";
import ModalVSGeneralConfirmation from "../Workshops/ModalVSGeneralConfirmation";
import ModalVSConfirmationSent from "../Workshops/ModalVSConfirmationSent";

const ResultsSample = ({ results, values, jsonFile }) => {
  const [modalVSWorkshopType, setModalVSWorkshopType] = useState(false);
  const [modalVSConfigureScenario, setModalVSConfigureScenario] = useState(false);
  const [modalVSGeneralConfirmation, setModalVSGeneralConfirmation] = useState(false);
  const [modalVSConfirmationSent, setModalVSConfirmationSent] = useState(false);

  const width = window.innerWidth;

  const secondaryColor = "var(--lightgrey)";
  const fontColor = "black";

  const indicatorObjectives = { climate: -50, energy: -50, air: [-70, -70] };

  const setWorkshopType = (type) => {
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
    setModalVSWorkshopType(true);
  };

  function handleIndicatorColor(data, obj) {
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
      <section className="sim-results-box flex-item flex-column">
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

        <Title id="results-top-box">Impacts sur le territoire - 2030</Title>

        <div id="results-climat-box" className="flex-item flex-column">
          <h4>Climat</h4>
          <div className="results-content-box">
            <div className="graph-box">
              <p>Émissions Totales</p>
              <div className="graph-compo">
                <CompoChart datas={results.graphs.climate} />
              </div>
            </div>
            <div className="indicators-box">
              <div className="indicators-main-box">
                <ResultsIndicator
                  indicator={results.indicators.climate.main[0]}
                  backgroundColor={handleIndicatorColor(
                    results.indicators.climate.main[0].value,
                    indicatorObjectives.climate,
                  )}
                  color={fontColor}
                  width="100%"
                />
              </div>

              <div className="indicators-secondary-box">
                {results.indicators.climate.secondary.map((indicator, i) => {
                  return (
                    <ResultsIndicator
                      key={indicator.name}
                      i={i}
                      indicator={indicator}
                      backgroundColor={secondaryColor}
                      color={fontColor}
                      width={handleIndicatorWidth(results.indicators.climate.secondary.length)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div id="results-energie-box">
          <h4>Énergie</h4>
          <div className="results-content-box">
            <div className="graph-box">
              <p>Consommation</p>
              <div className="graph-compo">
                <CompoChart datas={results.graphs.energy} isXAxis={false} isYAxis={false} />
              </div>
            </div>
            <div className="indicators-box">
              <div className="indicators-main-box">
                <ResultsIndicator
                  indicator={results.indicators.energy.main[0]}
                  backgroundColor={handleIndicatorColor(
                    results.indicators.energy.main[0].value,
                    indicatorObjectives.energy,
                  )}
                  color={fontColor}
                  width="100%"
                />
              </div>

              <div className="indicators-secondary-box">
                {results.indicators.energy.secondary.map((indicator, i) => {
                  return (
                    <ResultsIndicator
                      key={indicator.name}
                      i={i}
                      indicator={indicator}
                      backgroundColor={secondaryColor}
                      color={fontColor}
                      width={handleIndicatorWidth(results.indicators.energy.secondary.length)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div id="results-air-box">
          <h4>Qualité de l'Air</h4>
          <div className="results-content-box">
            <div className="graph-box"></div>
            <div className="indicators-box">
              <div className="indicators-secondary-box">
                {results.indicators.air.secondary.map((indicator, i) => {
                  return (
                    <ResultsIndicator
                      key={indicator.name}
                      indicator={indicator}
                      backgroundColor={handleIndicatorColor(
                        indicator.value,
                        indicatorObjectives.air[i],
                      )}
                      color={fontColor}
                      width={handleIndicatorWidth(results.indicators.air.secondary.length)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div id="results-button-box" className="flex-item acenter jbetween">
          <div className="tool-box flex-item acenter">
            {/* options */}
            <button className="icon-btn" type="button">
              <FontAwesomeIcon icon={faCog} />
            </button>
            {/* download */}
            <button className="icon-btn" type="button">
              <FontAwesomeIcon icon={faDownload} />
            </button>
            {/* share link */}
            <button className="icon-btn" type="button">
              <FontAwesomeIcon icon={faLink} />
            </button>
          </div>

          <div className="button-box flex-item acenter">
            <Link className="btn simulator-btn" to={{ pathname: "/results", state: { results } }}>
              Résultats
            </Link>

            <button
              type="button"
              className="btn simulator-btn"
              onClick={() => handleValidateScenario()}
            >
              Valider
            </button>
          </div>
        </div>
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
