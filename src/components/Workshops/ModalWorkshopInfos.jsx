import React from "react";

const ModalWorkshopInfos = ({ workshopInfos, closeModal }) => {
  console.log(workshopInfos);

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
          <a href={`http://mission-climat.io/ateliers/${workshopInfos.id}`}>
            {`http://mission-climat.io/ateliers/${workshopInfos.id}`}
          </a>
        </span>
      </p>

      <p>
        Le code à partager avec les participants : 
        {' '}
        <b>{workshopInfos.workshop_code}</b>
      </p>

      <p>
        Le code administrateur à conserver pour éditer ou supprimer l'atelier :
        <br />
        <b>{workshopInfos.admin_code}</b>
      </p>

      <p>Vous recevrez également ces informations par e-mail.</p>

      <button className="btn primary-btn" type="button" onClick={() => closeModal()}>
        Ok
      </button>
    </div>
  );
};

export default ModalWorkshopInfos;
