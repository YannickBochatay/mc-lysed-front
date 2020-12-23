import React from 'react'
import {
    BarChart,
    Label,
    Bar,
    XAxis,
    YAxis,
    ReferenceLine,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  const findI = (value, array) => {
    let diffs = array.map(a=>Math.abs(a-value))
    return array[diffs.indexOf(Math.min(...diffs))]
  }

const ParametersDistributionChart = ({data}) => {

    console.log(data)

    const min=data.min
    const max=data.max
    const median=data.median
    const average=data.average
    const stdev=data.stdev
    const unit = data.unit
    let step  = null;
    step = data.step
    const uniqueKey = slugify(data.name)

    let values = [min];
    let i=0;

    while (values[i] < max) {
    i++
    values.push(min + i*step)
    }

    const sd1 = findI(median - stdev, values) + data.unit
    const sd2 = findI(median + stdev, values) + data.unit
    const medClosest = findI(median, values) + data.unit
    const meanClosest = findI(average, values) + data.unit

    function slugify(text)
    {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    }

    function handleData(data, unit) {

    //1. Build an array with all values possible 
    let values = [min];
    let i=0;

    while (values[i] < max) {
        i++
        values.push(min + i*step)
    }

    console.log(values)

    let barDatas = [];

    //2. Build the expected array
    values.map((value, i, self) => {
        let nbValues = data.filter(v => v > value - step/2 && v < value + step /2).length
        // if (i==self.length-1) {nbValues += datas.data.filter(v => v === value + step /2).length}
        barDatas.push({
        "value": value + unit,
        "nb": nbValues
        })
    })
    return barDatas
    }

    function handleFill(uniqueKey) {
        return `url(#${uniqueKey})`
    }


    return (
        <ResponsiveContainer height="100%" width="100%">
        <BarChart data={handleData(data.wsValues, unit)}>
            <defs>
            <linearGradient id={uniqueKey} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={data.color} stopOpacity={1}/>
            <stop offset="95%" stopColor={data.color} stopOpacity={0.2}/>
            </linearGradient>
            </defs>
            <XAxis dataKey="value" stroke="#BDBFC5" height={40}>
            <Label value={data.description} offset={0} position="insideBottom" style={{ textAnchor: 'middle', fill: '#163E595' }}></Label> 
            </XAxis>
            
            <YAxis stroke="#BDBFC5" interval={1}>
            <Label value='Nb Résultats' offset={0} position="center" style={{ textAnchor: 'middle', fill: '#163E595' }} angle={-90}></Label> 
            </YAxis>
            
            <Tooltip />
            
            <Bar
            type="basis"
            fillOpacity="1"
            dataKey="nb"
            stroke="none"
            fill={handleFill(uniqueKey)}
            />
            <ReferenceLine x={sd1} stroke="rgb(176, 224, 230)" strokeWidth={3} strokeDasharray="5 5" />
            <ReferenceLine x={medClosest} stroke="rgb(64, 224, 208)" strokeWidth={5} strokeDasharray="5 5"/>
            <ReferenceLine x={sd2} stroke="rgb(176, 224, 230)" strokeWidth={3} strokeDasharray="5 5" />
        </BarChart>
        </ResponsiveContainer>
    );
};

export default ParametersDistributionChart
