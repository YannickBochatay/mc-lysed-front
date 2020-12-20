import React, {useState, useEffect} from "react";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import api from "api/APIHandler";
import { createEagerFactory } from "recompose";


const ModalVSConfigureScenario = ({closeModal, jsonExportString}) => {

    const [values, setValues] = useState({
        "workshop_code": '',
        "user_email": '',
        "group_name": ''
      });

    const [checkboxValues, setCheckBoxValues] = useState({"Tous" : true})

    //initialize checkboxValues
    useEffect(()=> {
        let checkboxValuesTemp= checkboxValues
        jsonExportString.categories.map(category => {
            checkboxValuesTemp[category.data.name]=false
        })
        setCheckBoxValues(checkboxValuesTemp)
    },[])

    const getKeys = (checkboxValues) => {
        if (checkboxValues["Tous"]) {
            return 'all'
        }
        let keys = [];
        for (const [key, value] of Object.entries(checkboxValues)) {
            if (value) {keys.push(key)}
        }
        return keys
    }

    const filterJSONwithCategory = (json, keys) => {

        if (keys==='all') {
            return json
        }
    
        let jsonTemp = {};
        jsonTemp.results={...json.results}
        jsonTemp.validation={...json.validation}
        jsonTemp.categories = json.categories.filter(category => keys.includes(category.data.name))
        // jsonTemp.parameters = json.parameters.filter(parameter => keys.includes(parameter.category.name))
        
        return jsonTemp
        
    }

    const handleChange = e => {
        if (e.target.type==="text") {
            setValues({...values, [e.target.id]: e.target.value})
        }
        else if (e.target.type==="checkbox") {
            setCheckBoxValues({...checkboxValues, [e.target.name]: e.target.checked })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const keys = getKeys(checkboxValues)
        const data = filterJSONwithCategory(jsonExportString, keys)
        api
        .post("/aggregator/result/",{...values, data})
        .then((res) => {
            console.log(res)
            //ADD CONFIRMATION MODAL
        ;})
        .catch((err) => console.log(err));
    }

    return (
        <div className="validate_scenario">

            <h3>Entrez les informations de votre scénario</h3>
            <p>Cette étape vous permet de blablabla</p>

            <form className="form" onSubmit={e=>handleSubmit(e)}>

                <FormControl>
                    <InputLabel htmlFor="group_name">Nom du participant / du groupe</InputLabel>
                    <Input id="group_name" onChange={e=>handleChange(e)} required/>
                </FormControl>

                <FormControl>
                    <InputLabel htmlFor="user_email">email du participant / du groupe</InputLabel>
                    <Input id="user_email" onChange={e=>handleChange(e)}/>
                    <FormHelperText>Facultatif. Si vous souhaitez obtenir les résultats</FormHelperText>
                </FormControl>

                <FormGroup>

                    <FormControlLabel
                        control={<Checkbox checked={checkboxValues["Tous"]} onChange={handleChange} name="Tous" />}
                        label="Tous"
                    />
                    {jsonExportString.categories.map(category => (
                        <FormControlLabel
                            control={<Checkbox checked={checkboxValues[category.data.name]} onChange={handleChange} name={category.data.name} />}
                            label={category.data.name}
                            disabled={checkboxValues["Tous"]===true}
                        />
                    ))}

                </FormGroup>

                <FormControl>
                    <InputLabel htmlFor="workshop_code">Code atelier</InputLabel>
                    <Input id="workshop_code" onChange={e=>handleChange(e)} required/>
                    <FormHelperText>Ce code vous a normalement été transmis par l'animateur.</FormHelperText>
                </FormControl>

                <Button onClick={()=>closeModal()}>Annuler</Button>
                <Button type="submit">Ok</Button>
            
            </form>
            
        </div>
    )
}

export default ModalVSConfigureScenario