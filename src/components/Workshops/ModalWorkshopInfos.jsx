import React from "react";

//TO DO : url fonction de la version

const ModalWorkshopInfos = ({ workshopInfos, closeModal }) => {

  return (
    <div id="modal-confirm" className="flex-column jcenter">
      <h2 className="container_title">Atelier créé !</h2>

      <p>
        L'atelier 
        {' '}
        <b>{workshopInfos.workshop_name}</b>
        {' '}
        a bien été créé. Les résultats seront visibles ici :
        <br />
        <span>
          <a href={`https://mc-lysed.herokuapp.com/workshop/${workshopInfos.id}`}>
            {`https://mc-lysed.herokuapp.com/workshop/${workshopInfos.id}`}
          </a>
        </span>
      </p>

      <p>
        Le code atelier à transmettre aux participants, utile au moment de la validation du scénario (afin de lier leur travail à votre atelier) : 
        {' '}
        <b>{workshopInfos.workshop_code}</b>
      </p>

      <p>
        Le code administrateur, utile pour éditer ou supprimer l'atelier, à ne pas partager :
        <br />
        <b>{workshopInfos.admin_code}</b>
      </p>

      <p>Ces informations vous sont également transmises par e-mail.</p>

      <button className="btn primary-btn" type="button" onClick={() => closeModal()}>
        Ok
      </button>
    </div>
  );
};

export default ModalWorkshopInfos;
