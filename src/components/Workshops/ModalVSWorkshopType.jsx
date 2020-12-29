import React from "react";

const ModalVSWorkshopType = ({ setWorkshopType, closeModal }) => {
  return (
    <div className="modal-sim modal-validate">
      <h2 className="container_title">Valider mon scénario</h2>

      <button className="btn primary-btn" type="button" onClick={() => setWorkshopType("workshop")}>
        Je fais partie d'un atelier
      </button>
      <p>munissez-vous du code atelier partagé par l'animateur</p>

      <button className="btn primary-btn" type="button" onClick={() => setWorkshopType("general")}>
        Je suis un utilisateur classique
      </button>
      <p>validez votre scénario et comparez-le aux autres !</p>

      <button className="btn secondary-btn" type="button" onClick={() => closeModal()}>
        Annuler
      </button>
    </div>
  );
};

export default ModalVSWorkshopType;
