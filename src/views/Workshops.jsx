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

          <p>Mission Climat vous permet d'animer des ateliers !<br/><br/>
          Un atelier Mission Climat propose à ses participants (seuls ou en groupes), de discuter et proposer des scénarios de transition permettant de remplir les objectifs du territoire.<br/><br/>
          Notre module permet à l'animateur de cet ateliers de centraliser les propositions des participants et d'en ressortir les statistiques importantes (: )paramètres moyens, médians, écart-types, etc.) et ainsi d'identifier les mesures les plus ambitieuses, les plus partagées, etc. pour outiller l'intelligence collective du groupe.</p>

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
