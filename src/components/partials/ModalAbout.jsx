import React from "react";

const ModalAbout = () => {
  return (
    <div id="intro-modal">
      <h3>
        Bienvenue sur <b>Mission Climat Territoires</b>
      </h3>

      <p>
        Mission Climat Territoires permet de s'approprier les enjeux énergie / climat :
        <ul>
          <li>
            conceptuellement : c'est un <b>outil de sensibilisation, de formation</b>
          </li>
          <li>
            collectivement : c'est un <b>outil d'aide à la concertation, à la codécision</b>
          </li>
        </ul>
      </p>

      <p>
        Il s'adresse{" "}
        <b>
          aux citoyens, aux élus, à tout acteur prenant une part active à la transition des
          territoires
        </b>
        , et à ceux qui s'adressent à eux et se prête particulièrement bien à des{" "}
        <b>animations en atelier</b>
      </p>

      <p>
        Il peut se <b>décliner simplement à l'échelle de tout territoire</b> : communauté de
        commune, département, région (dans le cadre d'un PCAET, d'un SRADDET, etc.), dans son modèle
        de calcul et graphiquement.
      </p>

      <p>
        Pour toute question, manifestation d'intérêt, notre contact :{" "}
        <span id="modal_contact">contact@mission-climat.io</span>
      </p>

      <p>
        Comme toute production Mission Climat, Mission Climat Territoires est disponible en open
        source.
      </p>

      <p>
        L'équipe :
        <ul>
          <li>
            <b>Pilotage</b> : Pascal Besson et Guillaume Martin
          </li>
          <li>
            <b>Modèle de calcul</b> : BL Evolution
          </li>
          <li>
            <b>Conception UX-UI</b> : Oriana Berthomieu, Nina Gautreau
          </li>
          <li>
            <b>Développement web</b> : Pascal Besson, Nina Gautreau et Franck-Olivier Marmier
          </li>
        </ul>
      </p>
    </div>
  );
};

export default ModalAbout;
