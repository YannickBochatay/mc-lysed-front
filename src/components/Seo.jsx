import React from "react";
import { Helmet } from "react-helmet";

const Seo = (props) => {
  const { title } = props;

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>Mission Climat | {title}</title>
      <meta name="description" content="Simulateur de scénarios climat à l'échelle nationale" />
      <link rel="canonical" href="http://mission-climat.io/simulator/" />
    </Helmet>
  );
};

export default Seo;
