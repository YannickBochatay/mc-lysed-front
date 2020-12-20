export function getDataToExport(json, values, results, keys) {

    let jsonFileTemp = JSON.parse(JSON.stringify(json))
    let parameters = [];

    for (const category of jsonFileTemp.categories) {
        category.parameters.map(parameter => {
            let vInit = parameter.data.value
            delete parameter.data.value
            parameter.data.valueInit = vInit
            parameter.data.value = values[parameter.data.index][0]
            parameter.data.category = category.data
            parameters.push({...parameter.data})
            return parameter
        })
    }
    
    const jsonTemp = {
        // parameters: [...parameters],
        categories: [...jsonFileTemp.categories],
        results: results,
        validation: {
            time: Date.now(),
            random: Math.random()
        }
    }

    if (keys==='all') {
        return jsonTemp
    }

    let jsonFinal = {};
    jsonFinal.results={...jsonTemp.results}
    jsonFinal.validation={...jsonTemp.validation}
    jsonFinal.categories = jsonTemp.categories.filter(category => keys.includes(category.data.name))
    // jsonTemp.parameters = json.parameters.filter(parameter => keys.includes(parameter.category.name))
    
    return jsonFinal


  }
  