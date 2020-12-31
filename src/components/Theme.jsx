import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

// TODO See if it can be async

const theme = createMuiTheme({
  palette: {
    background: {
      // => You can add any keys you wish overhere
      default: "#FFFFFF",
      secondary: "#E5EAEC",
      toto: "#960000",
    },
  },
});

const Theme = (props) => {
  const { children } = props;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
