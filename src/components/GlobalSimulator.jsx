import React, {useState, useEffect} from 'react'
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import jsonFile from "../utils/historicEmissions.json";
import "../styles/globalsimulator.css";

import {
    AreaChart,
    LineChart,
    Area,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
  } from "recharts";
  
  


//TO DO : 
// calculer la T°
//  - extrapoler les données > 2100
//   - avoir les bonnes données (budgets, émissions historiques)
//   - récit
//   - Données FR 
//  - ajouter la config de la séquestration de carbone
//  - pouvoir simuler une descente à partir d'années futures (ce qui suppose d'extrapoler les émissions d'ici là)
//  - et on pourrait avoir des boutons pour calculer la baisse annuelle nécessaire pour faire 1.5 ou 2 degrés à partir de l'année sur laquelle on souhaite la baisse. Et inversement.


const GlobalSimulator = () => {

    const [year, setYear] = useState(2018); 
    const [evolution, setEvolution] = useState(-5); 
    const [dataH, setDataH] = useState(jsonFile.data)
    const [dataS, setDataS] = useState(null)
    const [emissionsCumulated, setEmissionsCumulated] = useState(null)
    const [indicators, setIndicators] = useState(null)
    
    //CONFIG
    const currentYear = 2020;
    const budget15 = 2200;
    const budget2 = 2800;

    const sliderEvolution = {
        "min": -20,
        "max": 20,
        "step" : 0.5,
        "unit" : "%"
    }

    const sliderYear = {
        "min": 1850,
        "max": 2100,
        "step" : 1,
        "unit" : ""
    }


    useEffect(() => {
        const dataTemp = getEmissions(year,evolution)
        setDataS(dataTemp)
        let emissionsTemp = [];
        let cumul = 0;
        dataTemp.map(d => {
            emissionsTemp.push({"year": d.year, "emissions": (d.emissions+cumul)/1000})
            cumul += d.emissions
        })
        setEmissionsCumulated(emissionsTemp)
    }, [year, evolution])

    useEffect(() => {
        if (dataS) {
            let total = getTotalEmissions(dataS.map(v => v.emissions))
            setIndicators({
                "total": Math.round(total/1000),
                "reduction2030": getReduction(2030),
                "reduction2050": getReduction(2050)
            })
        }
    }, [dataS])

    //UTILS

    const getEmissions = (year, evolution) => {
        let data = [];
        let firstEmissions = 0;
        dataH.map(d => {
            let emissions=0;
            if (d.year <= year) {
                emissions = d.emissions
                firstEmissions = Math.round(d.emissions)
            }
            else if (d.year > year) {
                emissions = Math.round(firstEmissions * Math.pow((1+evolution/100),d.year -year))
            }
            data.push({"year": d.year, "emissions": emissions})
        })
        return data
    }

    const getTotalEmissions = (values) => {
        return values.reduce((a,v)=> a+v, 0)
    }

    const getEmissionsOfYear = (year) => {
        return dataS.filter(d =>d.year ==year)[0].emissions
    }

    const setDataFromDataToMatchBudgetLOL = (budget, from) => {

        let slider = {}
        if (from === "year") { slider = sliderEvolution;  }
        else if (from === "evolution") { slider = sliderYear; }

        let dataTab = [];
        for (let i=slider.min; i<=slider.max;i+=slider.step) {
            dataTab.push(i)
        }        
        let emiDeviationMin = 10000000000;
        let iMin = 0
        let emi=[];
        dataTab.map((data,i) => {
            if (from === "year") { emi = getEmissions(year, data);}
            else if (from === "evolution") { emi = getEmissions(data, evolution); }
            
            let emiDeviation = Math.abs(budget*1000 - getTotalEmissions(emi.map(v=>v.emissions)))
            if ( emiDeviation < emiDeviationMin ) {
                emiDeviationMin = emiDeviation
                iMin = i
            }
        })
        if (from === "year") { setEvolution(dataTab[iMin]);}
        else if (from === "evolution") { setYear(dataTab[iMin]) }
        
    }

    const getMarks = (slider) => {

        return [
            {
            value: slider.min,
            label: `${slider.min}${slider.unit}`,
            },
            {
            value: slider.max,
            label: `${slider.max}${slider.unit}`,
            },
        ]
    }

    const getReduction = (year) => {
        return Math.round((getEmissionsOfYear(year)/getEmissionsOfYear(currentYear) - 1)*100) + " %"
    }


    return (
        <div id="global_simulator">
            <h3>Simulateur retro/pro-spectif des émissions mondiales en fonction des évolutions annuelles</h3>
            <p>Et si on s'y prenait maintenant ? Et si on s'y était pris hier ?</p>
            
            {indicators && <div>
                <h5>Total émissions simulées : {indicators.total} MtCO2eq</h5>
                <h5>Evolution de {currentYear} à 2030 : {indicators.reduction2030}</h5>
                <h5>Evolution de {currentYear} à 2050 : {indicators.reduction2050}</h5>
            </div>}
            <div className="graph_box">

                <ResponsiveContainer>
                    <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                        <CartesianGrid />
                        <XAxis dataKey="year" type="year" />
                        <YAxis />
                        <Tooltip />
                        <Line data={dataS} dataKey="emissions" stroke="#8884d8" strokeWidth={3} dot={false} />
                        <Line data={dataH} dataKey="emissions" stroke="black"  dot={false} />
                        
                    </LineChart>
                </ResponsiveContainer>

                <ResponsiveContainer>
                    <AreaChart data={emissionsCumulated} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="year"/>
                        <YAxis domain={[0, 3000]} />
                        <Tooltip/>
                        <Area type='monotone' dataKey='emissions' stroke='#8884d8' fill='#8884d8' />
                        <ReferenceLine y={budget15} label="Budget 1,5°C" stroke="green" strokeDasharray="3 3" />
                        <ReferenceLine y={budget2} label="Budget 2°C" stroke="red" strokeDasharray="3 3" />
                    </AreaChart>
                </ResponsiveContainer>

            </div>

            <div className="slider_box">

                <div>

                    <h4>Année du début de l'évolution</h4>

                    <Slider
                        onChange={(e, val)=>setYear(val)}
                        value={year}
                        step={sliderYear.step}
                        min={sliderYear.min}
                        max={sliderYear.max}
                        marks={getMarks(sliderYear)}
                        valueLabelDisplay="on"
                    />

                    <Button variant="outlined" color="primary" onClick={()=>setDataFromDataToMatchBudgetLOL(budget2, "evolution")}>
                        Quelle année pour 2°C ?
                    </Button>

                    <Button variant="outlined" color="primary" onClick={()=>setDataFromDataToMatchBudgetLOL(budget15, "evolution")}>
                        Quelle année pour 1.5°C ?
                    </Button>

                </div>
                
                <div>

                    <h4>Evolution</h4>

                    <Slider
                        onChange={(e, val)=>setEvolution(val)}
                        value={evolution}
                        valueLabelDisplay="auto"
                        step={sliderEvolution.step}
                        min={sliderEvolution.min}
                        max={sliderEvolution.max}
                        marks={getMarks(sliderEvolution)}
                        scale={(x) => x + "%"}
                        valueLabelDisplay="on"
                    />

                    <Button variant="outlined" color="primary" onClick={()=>setDataFromDataToMatchBudgetLOL(budget2, "year")}>
                        Quelle évolution pour 2°C ?
                    </Button>

                    <Button variant="outlined" color="primary" onClick={()=>setDataFromDataToMatchBudgetLOL(budget15, "year")}>
                        Quelle évolution pour 1.5°C ?
                    </Button>

                </div>

            </div>

            

            
        </div>
    )
}

export default GlobalSimulator
