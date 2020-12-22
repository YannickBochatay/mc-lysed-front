import React, {useState, useEffect} from "react";
import api from "api/APIHandler";

import { getValuesFormatted } from "utils/getValuesFormatted";


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
    const [isComplete, setIsComplete] = useState(null);
    const [results, setResults] = useState(null);

    const [indicators, setIndicators] = useState(null);
    
    const [medianParams, setMedianParams] = useState(null);
    const [meanParams, setMeanParams] = useState(null);
    const [missionClimatVersion, setMissionClimatVersion] = useState(null);

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
            
            const [isCompleteTemp, computedDatasTemps] = computeData(workshopData, res.data)
            setIsComplete(isCompleteTemp)
            setComputedDatas(computedDatasTemps)
            console.log("data computed",Date.now()-time)

            setMedianParams(computedDatasTemps.map(v => [v.median]))

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
        //     - mean, median
        //     - ambitious
        //     - used
        //     - isComplete

        //TODO : handle list type parameter
        //TODO : calculate the ambition

        

        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }

        const categories = [];
        wsData.results.map(res => res.parameters.map(param => categories.push(param.category)))
        const uniqueCategories= categories.filter(onlyUnique)

        const isComplete = jsonData.categories.map(category => uniqueCategories.includes(category.data.name)).filter(v => !v).length > 0 ? false : true

        let finalDatas = [];
        const wsParams = wsData.results
            .map(result => result.parameters)
            .reduce((a,v) => [...a, ...v])

        jsonData.categories.map((category,i) => {

            if (uniqueCategories.includes(category.data.name)) {

                category.parameters.map((param,j) => {
                    
                    finalDatas.push({
                        "name" : category.data.name,
                        "color" : category.data.color,
                        "colorHover" : category.data.colorHover,
                        "parametersInfos" : {...param.type,...param.data}
                    })

                    let wsValues= wsParams
                        .filter(v => v.index ===param.data.index)
                        .map(v => v.value)

                    finalDatas[finalDatas.length-1].wsValues = wsValues
                    finalDatas[finalDatas.length-1].median = median(wsValues)
                    finalDatas[finalDatas.length-1].average = average(wsValues)
                    finalDatas[finalDatas.length-1].nbModif = wsValues.filter(v => v!==param.value).length
                    //ambition to add
                })

            }
        })



        return [isComplete, finalDatas]


    }


    console.log(indicators)

    return (
        <div>
            {workshopData && 
                <>
                <h1>{workshopData.workshop_name}</h1>
                <p>{workshopData.results.length} participants</p>
                </>
            }

            {indicators && indicators.filter(v=>v.impactGnl === "1").map(indicator => (
                <p>{indicator.name} / {indicator.value}</p>
            ))}
            
        </div>
    )
}

export default WorkshopInfos
