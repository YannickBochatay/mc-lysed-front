import React, { useReducer, useEffect } from "react";
import * as actions from "./actions";
import { globalReducer } from "./reducers";
import jsonFile from "ressources/initialDatas.json";
import { GSHEET_NAME } from "config";
import { getValuesFromUrl } from "utils/getValuesFromUrl";
import { getValuesFormatted } from "utils/getValuesFormatted";
import { getUrl } from "utils/getUrl";
import { useLocation } from "react-router-dom";
import api from "../api/APIHandler";

const initialData = {
  values: jsonFile.options.vInit,
  categories: jsonFile.categories,
  results: [],
};

export const GlobalContext = React.createContext();

const ValuesProvider = (props) => {
  const { children } = props;
  const location = useLocation();
  const [globalState, dispatch] = useReducer(globalReducer, initialData);

  //Gestion d'une route avec paramêtres spécifiques
  //url test : favorites/p0=100&&p1=0&&p2=56&&p3=99&&p4=30&&p5=18&&p6=52&&p7=35&&p8=57&&p9=2&&p10=80&&p11=82&&p12=3000000&&p13=73&&p14=35&&p15=30&&p16=50&&p17=100&&p18=85&&p19=85&&p20=85&&p21=1&&p22=2

  // Fonction appellée à la première exécution. Permet de :
  //   - créer une spreadsheet si non créée,
  //   - charger les valeurs de la spreadsheet créée si existante, et les afficher,
  //   - charger les valeurs d'un scénario enregistré, dans le cas d'un appel via url spécifique,
  useEffect(() => {
    async function initDatas() {
      var valuesURL = [];
      // cas où une sheet est déjà en dans le localstorage
      const idSheet = localStorage.getItem(GSHEET_NAME);

      if (idSheet) {
        console.log("SHEET ALREADY CREATED, ID:", idSheet);
        //cas où appel normal de la page simulateur
        if (!location.pathname.includes("favorites")) {
          const response = await api.get("/sheet/values/" + idSheet);
          dispatch({
            type: actions.LOAD_VALUES,
            values: response.data.values,
          });
        } else {
          // cas où appel via url spécifique /save/p=1&&p=3.....
          const startIndex = location.pathname.indexOf("p0=");
          const url = location.pathname.substr(startIndex);
          valuesURL = getValuesFromUrl(url);
          dispatch({
            type: actions.LOAD_VALUES,
            values: valuesURL,
          });
        }
      } else {
        // cas où aucune sheet n'a été créée
        //création d'une copie de la sheet master
        const response = await api.get("/sheet/");
        const idSheet = response.data.id;
        localStorage.setItem("idSheet-Lysed", idSheet);
        console.log("SHEET CREATED! ID:", idSheet);

        // cas où appel via url spécifique /save/p=1&&p=3.....
        if (location.pathname.includes("favorites")) {
          const startIndex = location.pathname.indexOf("p0=");
          const url = location.pathname.substr(startIndex);
          valuesURL = getValuesFromUrl(url);
          dispatch({
            type: actions.LOAD_VALUES,
            values: valuesURL,
          });
        } else {
          // already has an initial state
          // cas où appel normal (on initialise tout de même les valeurs ici pour le loader)
          //   setValues(initialData);
        }
      }
    }

    initDatas();

    //nettoyage du results de local storage
    if (localStorage.getItem("results")) {
      localStorage.removeItem("results");
    }
  }, [location.pathname]);

  //Fonction appellée à chaque actualisation de la variable state "values". Permet d'actualiser les résultats correpondant aux nouvelles values
  useEffect(() => {
    if (globalState.values) {
      const idSheet = localStorage.getItem("idSheet-Lysed");
      const valuesFormatted = getValuesFormatted(globalState.values, jsonFile.options.unit);
      if (idSheet) {
        api
          .patch("/sheet/update/" + idSheet, { values: valuesFormatted })
          .then((res) => {
            const resTemp = res.data.results;
            resTemp.url = getUrl(globalState.values, jsonFile.parameters);
            //correction des data area pour affichage ok
            // handleAreaData(resTemp.emiSecteurGnl);
            dispatch({ type: actions.UPDATE_RESULTS, results: resTemp });
          })
          .catch((err) => console.log(err));
      }
    }
  }, [globalState.values]);

  return (
    <GlobalContext.Provider
      value={{
        globalState,
        dispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ValuesProvider;
