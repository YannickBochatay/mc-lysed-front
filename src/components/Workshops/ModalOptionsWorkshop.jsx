import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash, faLink, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const ModalOptionsWorkshop = ({ openDelete, closeModal, url }) => {
  

  return (
    <div className="workshop-options flex-column acenter">
      <h2 className="container_title">Que voulez-vous faire ?</h2>

      <div className="workshop-specs flex-item acenter">
        <FontAwesomeIcon icon={faLink} />
        <a href={url} target="_blank" rel="noreferrer">
          Voir le simulateur avec scénario médian
        </a>
      </div>

      {/* <div className="workshop-specs flex-item acenter">
        <FontAwesomeIcon icon={faCalendarAlt} />
        <p>
          Filtrer du <input type="date" name="startDate" id="startDate" /> au{" "}
          <input type="date" name="endDate" id="endDate" />
        </p>
      </div> */}

      {/* <button className="btn primary-btn" type="button" onClick="">
        <FontAwesomeIcon icon={faDownload} />
        Télécharger les données
      </button> */}

      <button
        className="btn primary-btn danger-btn"
        type="button"
        onClick={() => {
          closeModal();
          openDelete();
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
        Supprimer l'atelier
      </button>
    </div>
  );
};

export default ModalOptionsWorkshop;
