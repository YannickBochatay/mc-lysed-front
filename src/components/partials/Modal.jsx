import React from "react";
import "../../styles/modal.css";

const Modal = ({ isOpen, closeModal, children, okButton }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-parent">
      <div className="modal-content">
        {children}
        {okButton && (
          <button type="button" className="close-btn" onClick={closeModal}>
            Ok
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
