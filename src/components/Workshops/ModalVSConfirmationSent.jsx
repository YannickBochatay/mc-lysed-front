import React from "react";

const ModalVSConfigureScenario = ({ closeModal }) => {
  return (
    <div className="modal-sim modal-confirm flex-column acenter jcenter">
      <h2 className="container_title">Scénario validé !</h2>

      <p>Les données de votre scénario ont bien été envoyées, merci !</p>

      <button className="btn primary-btn" type="button" onClick={() => closeModal()}>Ok</button>
    </div>
  );
};

export default ModalVSConfigureScenario;
