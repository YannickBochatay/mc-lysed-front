import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import Modal from "./Modal";
import ModalAbout from "./ModalAbout";
import ModalHelp from "./ModalHelp";

import "../../styles/Nav.css";

const Header = () => {
  const [openAbout, setOpenAbout] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  return (
    <nav className="main-nav">
      <Modal isOpen={openAbout} closeModal={() => setOpenAbout(false)} okButton>
        <ModalAbout />
      </Modal>

      <Modal isOpen={openHelp} closeModal={() => setOpenHelp(false)} okButton>
        <ModalHelp />
      </Modal>

      <Link className="flex-item acenter" to="/">
        <img src="/images/logo/missionclimat_blue.svg" alt="Logo" />
        <h4>
          mission climat <span>#Lysed</span>
        </h4>
      </Link>

      <p>beta</p>

      <ul className="flex-item acenter">
        <li>
          <Link to="/workshops">
           <button className="btn secondary-btn" type="button">Ateliers</button></Link>
        </li>
        <li>
          <button className="btn secondary-btn" type="button" onClick={() => setOpenAbout(true)}>
            À propos
          </button>
        </li>
        <li>
          <button className="btn secondary-btn" type="button" onClick={() => setOpenHelp(true)}>
            Aide
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default withRouter(Header);
