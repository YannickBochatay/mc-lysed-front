import React, { useEffect } from "react";

import api from "../../api/APIHandler";
import { getDataToExport } from "../../utils/getDataToExport";

const ModalVSGeneralConfirmation = ({ closeModal, results, val, jsonFile }) => {
  // post scenario to general workshop
  useEffect(() => {
    const data = getDataToExport(jsonFile, val, results, "all");

    // TO DO : add to config var
    const WSInfos = {
      workshop_code: "418999",
      user_email: "fake_email@mission-climat.io",
      group_name: "n/a",
    };

    api
      .post("/aggregator/result/", { ...WSInfos, data })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);

  // TO DO : add to config var
  const urlWorkshopGnl = process.env.REACT_APP_URL_WORKSHOP_GNL
  const idWorkshopsGnl = JSON.parse(process.env.REACT_APP_ID_WORKSHOP_GNL)

  return (
    <div className="modal-sim modal-confirm flex-column acenter jcenter">
      <h2 className="container_title">Scénario validé !</h2>

      <p>Votre scénario a bien été validé</p>
      <p>Merci pour le partage à la communauté !</p>

      <div className="button-box flex-item">
        <button className="btn secondary-btn" type="button" onClick={() => closeModal()}>
          Retour au simulateur
        </button>

        <a
          className="btn primary-btn"
          href={urlWorkshopGnl + idWorkshopsGnl.lysed}
          target="_blank"
          rel="noreferrer"
        >
          Consulter les résultats globaux
        </a>
      </div>
    </div>
  );
};

export default ModalVSGeneralConfirmation;
