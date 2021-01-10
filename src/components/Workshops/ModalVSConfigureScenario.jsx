import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Loader from "react-loader-spinner";

import { getDataToExport } from "../../utils/getDataToExport";
import { getKeys } from "../../utils/getKeys";

import api from "../../api/APIHandler";

const ModalVSConfigureScenario = ({
  closeModal,
  results,
  val,
  jsonFile,
  setModalVSConfirmationSent,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    workshop_code: "",
    user_email: "",
    group_name: "",
  });

  const [checkboxValues, setCheckBoxValues] = useState({ Tous: true });

  // initialize checkboxValues with list of sectors + "Tous"
  useEffect(() => {
    const checkboxValuesTemp = checkboxValues;
    jsonFile.categories.map((category) => {
      checkboxValuesTemp[category.data.name] = false;
    });
    setCheckBoxValues(checkboxValuesTemp);
  }, []);

  const handleChange = (e) => {
    if (e.target.type === "text") {
      setValues({ ...values, [e.target.id]: e.target.value });
    } else if (e.target.type === "checkbox") {
      setCheckBoxValues({ ...checkboxValues, [e.target.name]: e.target.checked });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const keys = getKeys(checkboxValues);
    const data = getDataToExport(jsonFile, val, results, keys);

    api
      .post("/aggregator/result/", { ...values, data })
      .then((res) => {
        setIsLoading(false);
        closeModal();
        setModalVSConfirmationSent(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="modal-sim modal-workshop">
      {isLoading && (
        <div id="sim_loader" className="modal-parent">
          <div id="sim_loader_content" className="modal-content">
            <Loader type="Oval" color="#163E59" height={100} width={100} />
          </div>
        </div>
      )}

      <h2 className="container_title">Valider (atelier)</h2>

      <p>Entrez les informations nécessaires pour valider votre scénario</p>

      <form className="form flex-column" onSubmit={(e) => handleSubmit(e)}>
        <div className="input-box">
          <div className="columns">
            <FormControl>
              <InputLabel htmlFor="group_name">Nom du participant / groupe</InputLabel>
              <Input id="group_name" onChange={(e) => handleChange(e)} required />
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="workshop_code">Code de l'atelier</InputLabel>
              <Input id="workshop_code" onChange={(e) => handleChange(e)} required />
              <FormHelperText>il vous a été transmis par l'animateur.</FormHelperText>
            </FormControl>
          </div>

          <FormControl>
            <InputLabel htmlFor="user_email">E-mail du participant / groupe</InputLabel>
            <Input id="user_email" onChange={(e) => handleChange(e)} />
            <FormHelperText>facultatif : Si vous souhaitez obtenir les résultats</FormHelperText>
          </FormControl>

          <div className="cloud">
            <FormGroup>
              <InputLabel htmlFor="sectors">Sélectionnez vos secteurs :</InputLabel>

              <div className="group">
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={checkboxValues["Tous"]}
                      onChange={handleChange}
                      name="Tous"
                    />
                  )}
                  label="Tous"
                />
                {jsonFile.categories.map((category) => (
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={checkboxValues[category.data.name]}
                        onChange={handleChange}
                        name={category.data.name}
                      />
                    )}
                    label={category.data.name}
                    disabled={checkboxValues["Tous"] === true}
                  />
                ))}
              </div>
            </FormGroup>
          </div>
        </div>

        <div className="button-box flex-item">
          <button className="btn secondary-btn" type="button" onClick={() => closeModal()}>
            Annuler
          </button>
          <button className="btn primary-btn" type="submit">
            Ok
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalVSConfigureScenario;
