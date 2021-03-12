import React, { useState, useEffect } from "react";

import ReactGA from "react-ga";

import { faLink, faDownload, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";

import ResultsIndicator from "../components/simulateur/ResultsIndicator";
import ChartContainer from "../components/resultats/ChartContainer";
import ResultsSocial from "../components/resultats/ResultsSocial";
import CopyToClipboard from "../components/CopyToClipboard";

import "../styles/results.css";

const Results = (props) => {
  console.log(props)
  const [arrowVisibility, setArrowVisibility] = useState("hidden");
  const [results, setResults] = useState(null);

  const indicatorObjectives = { climate: -27, energy: -11, air: [-70, -57] };

  useEffect(() => {
    let results = null;
    if (localStorage.getItem("results")) {
      results = JSON.parse(localStorage.getItem("results"));
      setResults(results);
    } else {
      results = props.location.state.results;
      localStorage.setItem("results", JSON.stringify(results));
      setResults(props.location.state.results);
    }
  }, []);

  function handleIndicatorColor(data, obj) {
    const objReached = (data / obj) * 100;
    return objReached >= 100
      ? "#B0E440"
      : objReached >= 50 && objReached < 100
      ? "#FFF176"
      : "#EB1818";
  }

  // useEffect(() => {
  //   if (!results) return;

  //   ReactGA.event({
  //     category: "Results",
  //     action: "temp:" + results.impacts.temperature,
  //   });
  // }, [results]);

  function handleClickTracking(type) {
    ReactGA.event({
      category: "Click",
      action: type,
    });
  }

  function handleInnerHTML(text) {
    return { __html: text };
  }

  function areaLegend(datas, type) {
    let dataValues = {};
    let datasKey = "";
    let unit = "";
    if (type === "area") {
      datasKey = "areaDatas";
      dataValues = datas.data.data;
      unit = datas.data.yTitle;
    } else if (type === "line") {
      dataValues = datas.data;
      datasKey = "line";
      unit = datas.yTitle;
    }

    function formatThousands(nb) {
      nb += "";
      if (nb.length > 3) {
        const nbSplitted = nb.split(".");
        nb = nbSplitted[0];

        let finalNb = "";
        for (let i = nb.length - 1; i >= 0; i--) {
          if ((i - nb.length + 1) % 3 === 0 && i - nb.length + 1 !== 0) {
            finalNb = `${nb[i]} ${finalNb}`;
          } else {
            finalNb = nb[i] + finalNb;
          }
        }
        return nbSplitted.length > 1 ? `${finalNb}.${nbSplitted[1]}` : finalNb;
      }
      return nb;
    }

    datas[datasKey].map((data) => {
      data.subText = `${formatThousands(
        dataValues[dataValues.length - 1][data.dataKey],
      )} ${unit} / Evolution : `;
      const evolution = Math.round(
        ((dataValues[dataValues.length - 1][data.dataKey] - dataValues[0][data.dataKey]) /
          dataValues[0][data.dataKey]) *
          100,
      );
      dataValues[0][data.dataKey] === 0
        ? (data.subText += " n/a")
        : evolution >= 0
        ? (data.subText += `+${evolution}%`)
        : (data.subText += `${evolution}%`);
      return data;
    });

    const dataReversed = [...datas[datasKey]];
    dataReversed.reverse();

    return dataReversed;
  }

  function pieLegend(datas) {
    datas.data01.map((data) => {
      data.dataKey = data.name;
      data.subText = `${Math.round(data.value)} MtCO2`;
      return data;
    });

    return datas.data01;
  }

  window.addEventListener("scroll", handleArrowVisibility);

  function handleArrowVisibility() {
    window.scrollY / window.innerHeight > 1
      ? setArrowVisibility("visible")
      : setArrowVisibility("hidden");
  }

  if (!results) return null;

  return (
    <div className="results-page flex-column acenter jcenter">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Mission Climat / Résultats</title>
        <meta name="description" content="Résultats complets de votre simulation Mission Climat" />
        <link rel="canonical" href="http://mission-climat.io/licenses" />
      </Helmet>

      <button type="button" className="btn blinking-btn" style={{ visibility: arrowVisibility }}>
        <a href="#res-synthese">
          <FontAwesomeIcon icon={faAngleUp} />
        </a>
      </button>

      <section className="main_container">
        <h1 className="container_title">Résultats</h1>
        <p>
          Retrouvez sur cette page une synthèse de vos résultats et des graphiques vous permettant
          de visualiser les conséquences de votre scénario.
        </p>
      </section>

      <section id="res-synthese" className="main_container flex-column">
        <h2 className="container_title">Synthèse</h2>

        <div className="flex-item jcenter">
          <ResultsIndicator
            indicator={results.indicators.climate.main[0]}
            color={handleIndicatorColor(
              results.indicators.climate.main[0].value,
              indicatorObjectives.climate,
            )}
          />

          <ResultsIndicator
            indicator={results.indicators.energy.main[0]}
            color={handleIndicatorColor(
              results.indicators.energy.main[0].value,
              indicatorObjectives.energy,
            )}
          />

          {results.indicators.air.secondary.map((indicator, i) => (
            <ResultsIndicator
              indicator={indicator}
              color={handleIndicatorColor(indicator.value, indicatorObjectives.air[i])}
            />
          ))}

          {/* <div id="res-synthese-buttons" className="flex-item">
              <div title="Copier l'url avec mes paramètres">
                <CopyToClipboard text={results.url} fn={handleClickTracking.bind(null, "copyURL")}>
                  <FontAwesomeIcon icon={faLink} />
                </CopyToClipboard>
              </div>

              <div title="Télécharger le modèle de calcul des données">
                <a
                  href="./2020-04-09_Scenario1.5.xlsx"
                  download
                  onClick={() => handleClickTracking("modelDownloadResults")}
                >
                  <FontAwesomeIcon icon={faDownload} />
                </a>
              </div>

              <ResultsSocial
                results={results}
                fillColor="#34244E"
                handleClickTracking={handleClickTracking}
              />
            </div> */}
        </div>
      </section>

      <div id="res-emi-fr">
        {Object.keys(results.completeResults).map((key, i) => (
          <section className="main_container flex-column">
            <h2 className="container_title">{results.completeResults[key].title}</h2>

            <p dangerouslySetInnerHTML={handleInnerHTML(results.completeResults[key].intro)} />

            {results.completeResults[key].graphs.map((graph, i) => (
              <ChartContainer {...graph} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};

export default Results;
