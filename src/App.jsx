/// BASIC
import React, { useState} from "react";
import { Route, Switch } from "react-router-dom";
import api from "api/APIHandler";

/// PAGES
import Simulator from "views/Simulator";
import Results from "views/Results";
import Workshops from "views/Workshops";
import NotFound from "views/NotFound";

/// COMPONENTS
import Modal from 'components/partials/Modal';
import ModalAbout from 'components/partials/ModalAbout';

/// STYLES
import "./styles/app.css";
import "./styles/Reset.css";

/// GOOGLE ANALYTICS
import ReactGA from "react-ga";

if (window.location.hostname !== "localhost") {
  ReactGA.initialize("G-2ZWYF277Q1");
  ReactGA.pageview(window.location.pathname + window.location.search);
}

ReactGA.event({
  category: "Screens",
  action: window.screen.width + ":" + window.screen.height,
});

function App() {
  const width = window.innerWidth;

  // function deleteSheet(e) {
  //   //e.preventDefault();
  //   console.log(localStorage.getItem("idSheet-VSGP"));
  //   if (localStorage.getItem("idSheet-VSGP")) {
  //     var idSheet = localStorage.getItem("idSheet-VSGP");
  //     localStorage.removeItem("idSheet-VSGP");
  //     api
  //       .delete("/sheet/delete", idSheet)
  //       .then((res) => {
  //         console.log("SHEET DELETED!", res);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }

  // // useBeforeunload((e) => deleteSheet(e))
  // window.addEventListener("beforeunload", (e) => deleteSheet(e));

  const Mobile = () => {
    return (
      <div id="mobile-message">
        <div>
          <p>
            La version mobile n'est pas encore disponible. Nous vous recommandons de toutes façons
            l'utilisation d'une tablette ou d'un ordinateur pour profiter pleinement des
            fonctionnalités du site. A bientôt !
          </p>
        </div>
      </div>
    );
  };

  const Desktop = () => {

    const [open, setOpen] = useState(false); //pass to true for production

    return (
      <main id="content-main">
        <Modal 
        isOpen={open}
        closeModal={()=>setOpen(false)}
        children={<ModalAbout></ModalAbout>}>
      </Modal>
        <Switch>
          {/* BASIC */}
          <Route exact path="/" component={Simulator} />
          {/* SIMULATOR */}
          <Route path="/simulator" component={Simulator} />
          <Route path="/results" component={Results} />
          <Route path="/workshops" component={Workshops} />
          {/* NOT FOUND */}
          <Route path="*" component={NotFound} />
        </Switch>
      </main>
    );
  };

  return width > 0 ? <Desktop /> : <Mobile />;
}

export default App;
