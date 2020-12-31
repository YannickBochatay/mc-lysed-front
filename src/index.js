import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import ValuesProvider from "Contexts/ValuesContext";

import Theme from "components/Theme";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <Theme>
      <ValuesProvider>
        <App />
      </ValuesProvider>
    </Theme>
  </BrowserRouter>,
  document.getElementById("root"),
);
