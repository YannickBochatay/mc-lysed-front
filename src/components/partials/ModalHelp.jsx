import React from "react";

const ModalHelp = () => {
  return (
    <div id="intro-modal">
      <h3>Aide</h3>
      <p>
        <b>
          Avec Mission Climat Territoires, imaginez le futur de votre territoire grâce à l’évolution
          des mesures prises dans les différents secteurs d’actions
        </b>{" "}
        (des bâtiments, de l’énergie, des transports, de l’industrie ou encore des énergies
        renouvelables).
      </p>
      <p>
        <b>En déplaçant les curseurs, vous visualiserez</b> les effets sur le territoire à horizon
        2030 pour tester votre niveau d’ambition par rapport aux objectifs. Il s’agit d’un véritable{" "}
        <b>simulateur climat</b>, permettant de visualiser les efforts à réaliser pour atténuer le
        réchauffement climatique.
      </p>
      <ol>
        <li>
          Dans un premier temps, <b>prenez connaissance des différents paramètres modifiables</b>{" "}
          des 5 secteurs d’actions. Pour une meilleure compréhension, cliquez sur (?) si vous avez
          besoin de précisions.{" "}
        </li>
        <li>
          Puis, réalisez votre scenario en{" "}
          <b>déplaçant les curseurs des différents paramètres d’actions</b> pour que{" "}
          <b>les indicateurs d’impacts apparaissent en vert.</b> Cela signifiera que les objectifs
          ont été atteints.{" "}
        </li>
        <li>
          Enfin, cliquez sur <b>« voir mes résultats complets »</b> afin de prendre connaissance des
          impacts de votre scenario de manière plus détaillée.{" "}
        </li>
      </ol>
    </div>
  );
};

export default ModalHelp;
