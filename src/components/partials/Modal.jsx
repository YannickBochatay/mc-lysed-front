import React from "react";
import "../../styles/modal.css";
import "../../styles/sim-modals.css";

const Modal = ({ isOpen, closeModal, children, okButton, cancelButton }) => {
  
  if (!isOpen) return null;

  return (
    <div className="modal-parent flex-item jcenter acenter">
      <div className="modal-content flex-column acenter">
        {children}
        {okButton && (
          <button type="button" className="btn primary-btn close-btn" onClick={closeModal}>
            Ok
          </button>
        )}
        {cancelButton && (
          <button type="button" className="btn secondary-btn close-btn" onClick={closeModal}>
            Annuler
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
