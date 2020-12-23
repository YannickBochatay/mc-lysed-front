import React, {useState, useEffect} from "react";
import api from "api/APIHandler";

import Loader from 'react-loader-spinner'
import IndicatorMain from "../components/partials/IndicatorMain";
import IndicatorSecondary from "../components/partials/IndicatorSecondary";
import ParametersDistributionBox from "../components/partials/ParametersDistributionBox";
import ParametersTables from "../components/partials/ParametersTables";
import WSTable from "../components/partials/WSTable";

import { getValuesFormatted } from "utils/getValuesFormatted";
import "../styles/workshop_infos.css";


const aggregatorInfos = {
    "lysed" : {
        "front" : "http://localhost:3000",
        "back" : "http://localhost:4000",
        "spreadsheetId" : "1aXmD5u-MIiRPq0MYZ2DPFR7TWOVQezS8zJkgTLN-zHk"
    },
    "national" : {
        "front" : "http://mission-climat.io/",
        "back" : "https://mission1degre5server.herokuapp.com",
        "spreadsheetId" : "1aXmD5u-MIiRPq0MYZ2DPFR7TWOVQezS8zJkgTLN-zHk"
    }
};

function median(values){
    if(values.length ===0) return 0;
  
    values.sort(function(a,b){
      return a-b;
    });
  
    var half = Math.floor(values.length / 2);
  
    if (values.length % 2)
      return values[half];
  
    return (values[half - 1] + values[half]) / 2.0;
  }
  
  
  function standardDeviation(values){
    var avg = average(values);
    
    var squareDiffs = values.map(function(value){
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });
    
    var avgSquareDiff = average(squareDiffs);
  
    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  }
  
  function average(data){
    var sum = data.reduce(function(sum, value){
      return sum + value;
    }, 0);
  
    var avg = sum / data.length;
    return avg;
  }

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


    const [page, setPage] = useState("Synthèse");


    const [sector, setSector] = useState("Habitat");
    const [sectorTable, setSectorTable] = useState(null);

    const [time, setTime] = useState(Date.now());

    const id = props.match.params.id

    //GET WORKSHOP DATA
    useEffect(()=> {
        
        api
        .get(`/aggregator/workshop/${id}/`)
        .then((res) => {
            console.log(res)
            setWorkshopDataData(res.data)

            console.log("wokshopdata loaded", Date.now()-time)

            // getMissionClimatVersion
            for (const aggregator in aggregatorInfos) {
                if (res.data.results[0].url.includes(aggregatorInfos[aggregator]["front"])) {
                    setMissionClimatVersion(aggregator);
                    break;
                }
            }

            console.log("MC version identified", Date.now()-time)

        ;})
        .catch((err) => console.log(err));        
    },[])

    //GET JSON DATA
    useEffect(()=> {
        api
        .get('/sheet/jsonfile')
        .then((res) => {
            console.log("json", res)
            console.log("json loaded",Date.now()-time)
            setJsonFile(res.data)
            
            const computedDatasTemp = computeData(workshopData, res.data)
            setComputedDatas(computedDatasTemp)
            console.log("data computed",Date.now()-time)

            setMedianParams(computedDatasTemp.parameters.map(v => [v.median]))

        ;})
        .catch((err) => console.log(err));  
    },[missionClimatVersion])

    //GET RESULTS DATA
    useEffect(()=> {
        if (medianParams && missionClimatVersion) {
            const valuesFormatted = getValuesFormatted(medianParams, jsonFile.options.unit);
            api
            .patch("/sheet/update/" + aggregatorInfos[missionClimatVersion].spreadsheetId, { values: valuesFormatted })
            .then((res) => {
                const resTemp = res.data.results;
                // resTemp.url = getUrl(values, jsonFile.parameters);
                //correction des data area pour affichage ok
                // handleAreaData(resTemp.emiSecteurGnl);
                console.log(res)
                setResults(resTemp);
                console.log("results received",Date.now()-time)

                let indicatorsTemps = [];
                for (const area in resTemp.indicators) {
                    for (const degree in resTemp.indicators[area]) {
                        resTemp.indicators[area][degree].map(v => indicatorsTemps.push(v))
                    }
                }
                setIndicators(indicatorsTemps)
            })
            .catch((err) => console.log(err));
        }
        
            
        
    },[medianParams, missionClimatVersion])

    const computeData = (wsData, jsonData) => {

        // function used to get all datas needed to display 
        //     - mean, median, stdev, ambitious, used, isComplete

        //TODO : handle list type parameter
        //TODO : calculate the ambition

        

        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }

        const categories = [];
        wsData.results.map(res => res.parameters.map(param => categories.push(param.category)))
        const uniqueCategories= categories.filter(onlyUnique)

        const isComplete = jsonData.categories.map(category => uniqueCategories.includes(category.data.name)).filter(v => !v).length > 0 ? false : true

        let finalDatas = {
            "parameters": [],
            uniqueCategories,
            isComplete
        };
        const wsParams = wsData.results
            .map(result => result.parameters)
            .reduce((a,v) => [...a, ...v])

        jsonData.categories.map((category,i) => {

            if (uniqueCategories.includes(category.data.name)) {

                category.parameters.map((param,j) => {
                    
                    finalDatas.parameters.push({
                        "category" : category.data.name,
                        "color" : category.data.color,
                        "colorHover" : category.data.colorHover,
                        ...param.type,
                        ...param.data
                        // "parametersInfos" : {...param.type,...param.data}
                    })

                    let wsValues= wsParams
                        .filter(v => v.index ===param.data.index)
                        .map(v => v.value)

                    finalDatas.parameters[finalDatas.parameters.length-1].wsValues = wsValues
                    finalDatas.parameters[finalDatas.parameters.length-1].median = Math.round(median(wsValues),1)
                    finalDatas.parameters[finalDatas.parameters.length-1].average = Math.round(average(wsValues),1)
                    finalDatas.parameters[finalDatas.parameters.length-1].stdev = Math.round(standardDeviation(wsValues),1)
                    finalDatas.parameters[finalDatas.parameters.length-1].stdevRel = Math.round(finalDatas.parameters[finalDatas.parameters.length-1].stdev/finalDatas.parameters[finalDatas.parameters.length-1].average*100, 1)
                    finalDatas.parameters[finalDatas.parameters.length-1].nbModif = wsValues.filter(v => v!==param.data.value).length
                    finalDatas.parameters[finalDatas.parameters.length-1].nbResults = wsValues.length
                    //ambition to add

                })

            }
        })


        const setTableDatas = (data, type, key) => {
            let table = {"titles": ["Category", "Parameter", type]}
            let tableRev = {"titles":table.titles}
        
            let tableData=[];
            data.parameters.map(param => {
                tableData.push([param.category, param.name,param[key]])
            })
            
            table.data = [...tableData.sort((a,b)=>b[2] - a[2])]
            tableRev.data = [...tableData.sort((a,b)=>a[2] - b[2])]

            return [ {...table}, {...tableRev}]
        }

        const [nbModifTable, nbModifRevTable] = setTableDatas(finalDatas, "Nb de modifications", "nbModif")
        const [consensusTable, consensusRevTable] = setTableDatas(finalDatas, "Ecart type relatif", "stdevRel")

        //set data for nbModified tables
        // let nbModifTable = {"titles": ["Category", "Parameter", "Nb of modifications"]}
        // let nbModifRevTable = {"titles":nbModifTable.titles}
    
        // let tableData=[];
        // finalDatas.parameters.map(param => {
        //     tableData.push([param.category, param.name,param.nbModif])
        // })
        
        // nbModifTable.data = [...tableData.sort((a,b)=>b[2] - a[2])]
        // nbModifRevTable.data = [...tableData.sort((a,b)=>a[2] - b[2])]

        finalDatas.nbModifTable = nbModifTable
        finalDatas.nbModifRevTable = nbModifRevTable
        finalDatas.consensusTable = consensusTable
        finalDatas.consensusRevTable = consensusRevTable

        return finalDatas


    }

    //GET SECTOR TABLE (PARAMETERS)
    useEffect(()=> {

        if (computedDatas) {
            let tableTemp={
                "titles" : ['Paramètre', 'Valeur médiane', 'Valeur moyenne', 'Ecart type', 'Ecart type relatif', "Nb modifications", 'Nb résultats'],
                data: []
            };
            computedDatas.parameters.map(param => {
                if (param.category===sector) {
                    tableTemp.data.push([param.name, param.median, param.average, param.stdDev, param.stdevRel, param.nbModif, param.nbResults])
                }
            })
            setSectorTable({...tableTemp})
        }
        
    },[computedDatas, sector])


    console.log(indicators)

    return (
        <div id="workshop_infos">

            {!results && <div id="sim_loader" className="modal-parent">
                <div id="sim_loader_content" className="modal-content">
                    <Loader type={"Oval"} color="#163E59" height={100} width={100} />
                </div>
            </div>}

            {workshopData && 
            <div className="main_container">
                <h1 className="container_title">{workshopData.workshop_name}</h1>
                <p>Nombre de contributions : {workshopData.results.length}</p>
                <div>
                    <button onClick={()=>setPage("Synthèse")}>Synthèse</button>
                    <button onClick={()=>setPage("Secteurs")}>Secteurs et Paramètres</button>
                </div>
                {page==="Secteurs" && <div>
                    {computedDatas.uniqueCategories.map((cat,i) => (
                        <button id={i} onClick={()=>setSector(cat)}>{cat}</button>
                    ))}
                </div>}
            </div>
            }

            {page==="Synthèse" &&
            <>
            {indicators && 
            <div className="main_container">
                <h1 className="container_title">Résultats</h1>

                <h3 className="container_secondary_title">Impacts généraux</h3>
                <div className="indicator_box">
                    {indicators.filter(v=>v.impactGnl === "1").map(indicator => (
                        <IndicatorMain value={indicator.value} unit={indicator.unit} description={indicator.name}></IndicatorMain>
                    ))}
                </div>
                <WSTable table={results.aggregator.impactGnlTable} numberDisplayed="all" />

                <h3 className="container_secondary_title">Impacts sur le territoire</h3>
                <div className="indicator_box">
                    {indicators.filter(v=>v.impactLcl === "1").map(indicator => (
                        <IndicatorSecondary value={indicator.value} unit={indicator.unit} description={indicator.name}></IndicatorSecondary>
                    ))}
                </div>

            </div>}

            {indicators && 
            <div className="main_container">
                <h1 className="container_title">Paramètres clés</h1>

                <h3 className="container_secondary_title">Contributions</h3>
                <ParametersTables title="les plus utilisés" table={computedDatas.nbModifTable} numberDisplayed={3} />
                <ParametersTables title="les moins utilisés" table={computedDatas.nbModifRevTable} numberDisplayed={3} />

                <h3 className="container_secondary_title">Consensus</h3>
                <ParametersTables title="les plus consensuels" table={computedDatas.consensusRevTable} numberDisplayed={3} />
                <ParametersTables title="les moins consensuels" table={computedDatas.consensusTable} numberDisplayed={3} />

            </div>}
            </>}

            {page==="Secteurs" && <>
                {computedDatas && 
                <div className="main_container">
                    <h1 className="container_title">Détails par secteur</h1>

                    <h3 className="container_secondary_title">Paramètres / Résumé</h3>

                    {sectorTable && <WSTable table={sectorTable} numberDisplayed="all" />}

                    <h3 className="container_secondary_title">Paramètres / Distribution</h3>

                    <div id="parameters_distribution_container">
                    {computedDatas.parameters.filter(param=>param.category===sector).map(param => (
                        <ParametersDistributionBox data={param}/>
                    ))}
                    </div>
                    
                </div>}
            </>}
            
            
        </div>
    )
}

export default WorkshopInfos
