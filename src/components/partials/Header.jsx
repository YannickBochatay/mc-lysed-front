import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Modal from "./Modal";
import ModalAbout from "./ModalAbout";
import ModalHelp from "./ModalHelp";

import "../../styles/Nav.css";

const Header = () => {
  const [openAbout, setOpenAbout] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  return (
    <nav>
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
          <button className="btn secondary-btn" type="button" onClick={() => setOpenAbout(true)}>
            <span className="indicator-tooltip">
              <FontAwesomeIcon icon={faQuestionCircle} />
            </span>
            A propos
          </button>
        </li>
        <li>
          <button className="btn secondary-btn" type="button" onClick={() => setOpenHelp(true)}>
            <span className="indicator-tooltip">
              <FontAwesomeIcon icon={faQuestionCircle} />
            </span>
            Aide
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default withRouter(Header);
