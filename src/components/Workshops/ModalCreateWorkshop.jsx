import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";

import api from "../../api/APIHandler";

const ModalCreateWorkshop = ({ closeModal, setWorkshopInfos, setModalWorkshopInfos }) => {
  const [values, setValues] = useState({
    workshop_name: "",
    admin_name: "",
    participants_nb: "",
    admin_email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post("/aggregator/workshop/", { ...values })
      .then((res) => {
        console.log(res);
        closeModal();
        setWorkshopInfos(res.data);
        setModalWorkshopInfos(true);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  return (
    <div id="modal-create">
      <h2 className="container_title">Créer mon atelier</h2>

      <p>Entrez les informations nécessaires pour lancer votre atelier</p>

      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="input-box">
          <FormControl>
            <InputLabel htmlFor="workshop_name">Nom de l'atelier</InputLabel>
            <Input id="workshop_name" onChange={(e) => handleChange(e)} required />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="admin_name">Nom du responsable / animateur</InputLabel>
            <Input id="admin_name" onChange={(e) => handleChange(e)} />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="participants_nb">Nombre de participants</InputLabel>
            <Input id="participants_nb" onChange={(e) => handleChange(e)} />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="admin_email">E-mail</InputLabel>
            <Input id="admin_email" type="email" required onChange={(e) => handleChange(e)} />
            <FormHelperText>Nous ne partagerons jamais votre adresse e-mail</FormHelperText>
          </FormControl>
        </div>

        <div className="button-box flex-item">
          <button type="button" className="btn secondary-btn" onClick={() => closeModal()}>
            Annuler
          </button>
          <button type="submit" className="btn primary-btn">
            Valider
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalCreateWorkshop;
