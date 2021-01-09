import React from "react";

const ModalVSWorkshopType = ({ setWorkshopType, closeModal }) => {
  return (
    <div className="modal-sim modal-validate">
      <h2 className="container_title">Valider mon scénario</h2>

      <button className="btn primary-btn" type="button" onClick={() => setWorkshopType("workshop")}>
        Je suis dans le cadre d'un atelier
      </button>
      <p>munissez-vous du code atelier partagé par l'animateur de l'atelier</p>

      <button className="btn primary-btn" type="button" onClick={() => setWorkshopType("general")}>
        Je suis un utilisateur classique
      </button>
      <p>validez votre scénario et comparez-le aux autres internautes !</p>

      <button className="btn secondary-btn" type="button" onClick={() => closeModal()}>
        Annuler
      </button>
    </div>
  );
};

export default ModalVSWorkshopType;
