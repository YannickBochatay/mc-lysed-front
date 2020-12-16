import React, {useState} from "react";
import "../../styles/header.css";
import { Link, withRouter } from "react-router-dom";
import Modal from 'components/partials/Modal';
import ModalAbout from 'components/partials/ModalAbout';
import ModalHelp from 'components/partials/ModalHelp';
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({background }) => {

  let backgroundColor = ""
  let color = ""
  let logo = ""
  if (background==="color") {
    backgroundColor = "transparent"
    color = "white"
    logo = "../../../images/LYSED.jpg"
  }
  else {
    backgroundColor = "white"
    color = "var(--mainColor)"
    logo = "../../../images/LYSED.jpg"
  }

  const [openAbout, setOpenAbout] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  
  return (
    <header style={{backgroundColor:backgroundColor}}>
      
      <Modal 
        isOpen={openAbout}
        closeModal={()=>setOpenAbout(false)}
        children={<ModalAbout></ModalAbout>}>
      </Modal>
      
      <Modal 
        isOpen={openHelp}
        closeModal={()=>setOpenHelp(false)}
        children={<ModalHelp></ModalHelp>}>
      </Modal>
      <Link className="header-link flex-item" to="/">
          <img src={logo} alt="Home logo" className="header-logo" />
          <h4 style={{color:color}}>mission climat <span>#Lysed</span></h4>
        </Link>
      <p>beta</p>
      <div id="indicator_box">
        <div className="indicator" onClick={()=>setOpenAbout(true)}>
          <span className="indicator-tooltip">
              <FontAwesomeIcon icon={faQuestionCircle} />
          </span>
          A propos
        </div>
        <div className="indicator" onClick={()=>setOpenHelp(true)}>
          <span className="indicator-tooltip">
              <FontAwesomeIcon icon={faQuestionCircle} />
          </span>
          Aide
        </div>
      </div>
    </header>
  );
};

export default withRouter(Header);
