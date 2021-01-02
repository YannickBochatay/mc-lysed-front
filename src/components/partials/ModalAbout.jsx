import React from "react";

const ModalAbout = () => {
  return (
    <div id="intro-modal">
      <h2 className="container_title">Mission Climat Territoires</h2>

      <p>Bienvenue sur Mission Climat Territoires ! </p>
      <p>
        Cet outil permet de s'approprier les enjeux énergie / climat :
        <ul>
          <li>
            conceptuellement : à travers de la <strong>sensibilisation</strong> et de la{" "}
            <strong>formation</strong>
          </li>
          <li>
            collectivement : grâce à la <strong>concertation</strong> et la{" "}
            <strong>co-décision</strong>
          </li>
        </ul>
      </p>

      <p>
        Il s'adresse aux <b>citoyens</b>, aux <b>élus</b>, à{" "}
        <b>tout acteur prenant une part active</b> à la transition des territoires, et à{" "}
        <b>ceux qui s'adressent à eux</b>. Il se prête particulièrement bien à des{" "}
        <b>animations en atelier</b>.
      </p>

      <p>
        Il peut se <b>décliner</b> simplement à l'<b>échelle de tout territoire</b> : commune, département, région (dans le cadre d'un PCAET, d'un SRADDET...) dans son modèle
        de calcul et graphiquement.
      </p>

      <p>
        Comme toute les productions Mission Climat, Mission Climat Territoires est disponible en open source. Pour toute question, manifestation d'intérêt, écrivez-nous :
        {" "}
        <a href="mailto:contact@mission-climat.io">contact@mission-climat.io</a>
      </p>

      <p>
        L'équipe de Mission Climat :
        <ul>
          <li>
            Pilotage : Pascal Besson et Guillaume Martin
          </li>
          <li>
            Modèle de calcul : BL Evolution
          </li>
          <li>
            Conception UX-UI : Oriana Berthomieu, Nina Gautreau
          </li>
          <li>
            Développement web : Pascal Besson, Nina Gautreau et Franck-Olivier Marmier
          </li>
        </ul>
      </p>
    </div>
  );
};

export default ModalAbout;
