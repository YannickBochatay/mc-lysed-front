import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

// TODO See if it can be async

const theme = createMuiTheme({});

const Theme = (props) => {
  const { children } = props;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
