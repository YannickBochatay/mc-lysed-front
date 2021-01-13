import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";

const ModalDeleteWorkshop = ({ handleDeleteWS, closeModal }) => {
  const [values, setValues] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleDeleteWS(values.admin_code);
  };

  return (
    <div className="modal-delete-ws">
      <h2 className="container_title">Suppression de l'atelier</h2>

      <p>
        Êtes-vous sûr(e) de vouloir supprimer cet atelier ? Toutes les informations seront
        définitivement supprimées : ni vous ni les participants de l'atelier ne pourront y accéder à nouveau.
      </p>

      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <FormControl>
          <InputLabel htmlFor="workshop_name">Code administrateur*</InputLabel>
          <Input id="admin_code" onChange={(e) => handleChange(e)} required />
          <FormHelperText>
            Ce code vous a été transmis, si vous êtes bien le créateur de l'atelier, par e-mail.
          </FormHelperText>
        </FormControl>


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

export default ModalDeleteWorkshop;
