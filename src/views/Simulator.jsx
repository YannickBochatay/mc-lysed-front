/// BASIC
import React, { useContext, useState, useEffect } from "react";

import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import jsonFile from "ressources/initialDatas.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

/// COMPONENTS
import SimulatorSettings from "components/simulateur/SimulatorSettings";
import SimulatorNavigation from "components/simulateur/SimulatorNavigation";
import OptionsBox from "components/simulateur/OptionsBox";
import ResultsSample from "components/simulateur/ResultsSample";
import SimulatorLoader from "components/simulateur/SimulatorLoader";
import { useGlobalContext } from "Contexts/GlobalContext";
// Custom Hooks
import { useVisibility } from "hooks/useVisibility";

// Utility functions
import { getUrl } from "utils/getUrl";
import { getValuesFormatted } from "utils/getValuesFormatted";
import { getValuesFromUrl } from "utils/getValuesFromUrl";

import api from "api/APIHandler";
import "styles/simulator.css";
import "styles/app.css";

const Simulator = (props) => {
  // const [values, setValues] = useState(null);
  // const [results, setResults] = useState(null); // jsonFile.results
  const [modeExpert, setModeExpert] = useState(false);
  const [showOptions, hideOptions, isVisible] = useVisibility(false);
  const { globalState } = useGlobalContext();
  const { results, values } = globalState;

  function handleInitValues(e) {
    const values = {
      init: "vInit",
      vMin: "vMin",
      "1degre5": "v15",
      bau: "vBaU",
      vMax: "vMax",
    };

    const initMode = e.target.value;
    const valuesTemp = jsonFile.options[values[initMode]];

    const idSheet = localStorage.getItem("idSheet-Lysed");
    const valuesFormatted = getValuesFormatted(valuesTemp, jsonFile.options.unit);

    api
      .patch("/sheet/updateonly/" + idSheet, { values: valuesFormatted })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }

  // function handleAreaData(datas) {
  //   datas.areaDatas = [...datas.areaDatas].reverse();
  //   return datas;
  // }

  const handleModeExpert = (value) => {
    setModeExpert(value);
  };

  if (!values || !results) {
    return <SimulatorLoader />;
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Mission Climat / Simulateur</title>
        <meta name="description" content="Simulateur de scénarios climat à l'échelle nationale" />
        <link rel="canonical" href="http://mission-climat.io/simulator/" />
      </Helmet>

      <div className="sim-page flex-item">
        <section className="sim-container-box">
          <div id="sim-title" className="title">
            <h1>Mesures sur le territoire - 2030</h1>
            {/* options */}
            <button className="icon-btn flex-item acenter" type="button">
              <FontAwesomeIcon icon={faCog} />
              <span onClick={showOptions}>Options</span>
            </button>
          </div>
          <SimulatorNavigation
            leftNavData={jsonFile.nav[0]}
            showOptions={showOptions}
            isActiveOptions={isVisible}
          />

          <div className="sim-main-box">
            {isVisible && (
              <OptionsBox
                modeExpert={modeExpert}
                hideOptions={hideOptions}
                handleInitValues={handleInitValues}
                handleModeExpert={handleModeExpert}
              />
            )}

            <SimulatorSettings modeExpert={modeExpert} />
          </div>
        </section>

        <ResultsSample jsonFile={jsonFile} />
      </div>
    </>
  );
};
export default Simulator;
