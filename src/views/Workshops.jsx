import React, { useState } from "react";

// COMPONENTS
import Modal from "../components/partials/Modal";
import ModalCreateWorkshop from "../components/Workshops/ModalCreateWorkshop";
import ModalWorkshopInfos from "../components/Workshops/ModalWorkshopInfos";

// STYLES
import "../styles/workshops.css";

const Workshops = () => {
  const [modalCreateWorkshop, setModalCreateWorkshop] = useState(false);
  const [modalWorkshopInfos, setModalWorkshopInfos] = useState(false);
  const [workshopInfos, setWorkshopInfos] = useState({});

  return (
    <div id="workshops" className="flex-item jcenter acenter">
      <Modal
        isOpen={modalCreateWorkshop}
        closeModal={() => setModalCreateWorkshop(false)}
        okButton={false}
      >
        <ModalCreateWorkshop
          closeModal={() => setModalCreateWorkshop(false)}
          setWorkshopInfos={setWorkshopInfos}
          setModalWorkshopInfos={setModalWorkshopInfos}
        />
      </Modal>

      <Modal
        isOpen={modalWorkshopInfos}
        closeModal={() => setModalWorkshopInfos(false)}
        okButton={false}
      >
        <ModalWorkshopInfos
          workshopInfos={workshopInfos}
          closeModal={() => setModalWorkshopInfos(false)}
        />
      </Modal>

      <div className="main_container">
        <div className="left-pannel flex-column jcenter acenter">
          <h1 className="container_title">Ateliers Mission Climat</h1>

          <p>Mission Climat vous permet de créer des ateliers. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

          <button type="button" className="btn primary-btn" onClick={() => setModalCreateWorkshop(true)}>
            Créer un atelier
          </button>
        </div>

        <img src="./svg/createWorkshop.svg" alt="people collaborating on graphs" />
      </div>
    </div>
  );
};

export default Workshops;
