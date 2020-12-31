import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import GlobalContext from "Contexts/GlobalContext";

import Theme from "components/Theme";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <Theme>
      <GlobalContext>
        <App />
      </GlobalContext>
    </Theme>
  </BrowserRouter>,
  document.getElementById("root"),
);
