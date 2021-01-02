import React from "react";

import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ModalHelp = () => {
  return (
    <div id="intro-modal">
      <h2 className="container_title">Aide</h2>

      <p>
        Avec <b>Mission Climat Territoires</b>, imaginez le futur de votre territoire grâce à l’<b>évolution des mesures prises</b> dans les différents <b>secteurs d’actions</b> (bâtiment, tertiaire, transports, industrie ou énergie).
      </p>

      <p>
        En <b>déplaçant les curseurs</b>, vous visualiserez les effets sur le territoire à horizon 2030 pour tester votre niveau d’ambition par rapport aux <b>objectifs</b>. Il s’agit d’un <b>véritable simulateur climat</b>, permettant de <b>visualiser les efforts</b> à réaliser pour <b>atténuer le réchauffement climatique</b>.
      </p>

      <ol>
        <li>
          Dans un premier temps, <b>prenez connaissance des différents paramètres modifiables</b>{" "}
          des secteurs d’actions. Pour une meilleure compréhension, cliquez sur le symbole <FontAwesomeIcon icon={faQuestionCircle} /> si vous avez
          besoin de précisions.{" "}
        </li>
        <li>
          Puis, réalisez votre scénario en{" "}
          <b>déplaçant les curseurs des différents paramètres d’actions</b> pour que{" "}
          <b>les indicateurs d’impacts apparaissent en vert.</b> Cela signifiera que les objectifs
          ont été atteints.{" "}
        </li>
        <li>
          Enfin, cliquez sur <b>« Résultats »</b> afin de prendre connaissance des impacts de votre scenario de manière plus détaillée.{" "}
        </li>
      </ol>
    </div>
  );
};

export default ModalHelp;
