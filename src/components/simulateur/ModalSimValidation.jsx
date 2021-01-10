import React from "react";
import { Link } from "react-router-dom";

const ModalVSWorkshopType = ({ closeModal, onClick, results }) => {
  return (
    <div className="modal-sim modal-validate flex-column">
      <h2 className="container_title">Que voulez-vous faire ?</h2>

      <Link className="btn primary-btn" to={{ pathname: "/results", state: { results } }}>
        Voir les résultats complets
      </Link>

      <button
        type="button"
        className="btn primary-btn"
        onClick={() => {
          closeModal();
          onClick();
        }}
      >
        Envoyer mes données
      </button>

      <button
        type="button"
        className="btn primary-btn"
        onClick=""
      >
        Partager mon scénario
      </button>

      <button className="btn secondary-btn close-btn" type="button" onClick={() => closeModal()}>
        Annuler
      </button>
    </div>
  );
};

export default ModalVSWorkshopType;
