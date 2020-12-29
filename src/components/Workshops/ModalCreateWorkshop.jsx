import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import Loader from "react-loader-spinner";

import api from "../../api/APIHandler";

const ModalCreateWorkshop = ({ closeModal, setWorkshopInfos, setModalWorkshopInfos }) => {
  const [values, setValues] = useState({
    workshop_name: "",
    admin_name: "",
    participants_nb: 0,
    admin_email: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    api
      .post("/aggregator/workshop/", { ...values })
      .then((res) => {
        setIsLoading(false)
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

      {isLoading && (
        <div id="sim_loader" className="modal-parent">
          <div id="sim_loader_content" className="modal-content">
            <Loader type="Oval" color="#163E59" height={100} width={100} />
          </div>
        </div>
      )}

      <h2 className="container_title">Créer mon atelier</h2>

      <p>Entrez les informations nécessaires pour lancer votre atelier</p>

      <form className="form flex-column" onSubmit={(e) => handleSubmit(e)}>
        <div className="input-box">
          <FormControl>
            <InputLabel htmlFor="workshop_name">Nom de l'atelier*</InputLabel>
            <Input id="workshop_name" onChange={(e) => handleChange(e)} required />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="admin_name">Nom du responsable / animateur</InputLabel>
            <Input id="admin_name" onChange={(e) => handleChange(e)} />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="participants_nb">Nombre de participants</InputLabel>
            <Input id="participants_nb" type="number" onChange={(e) => handleChange(e)} />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="admin_email">E-mail*</InputLabel>
            <Input id="admin_email" type="email" required onChange={(e) => handleChange(e)} />
            <FormHelperText>Utile pour vous envoyer les codes d'administration de votre atelier. Il ne sera jamais utilisé à d'autres fins.</FormHelperText>
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
