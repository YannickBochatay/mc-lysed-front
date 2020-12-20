import React from 'react'
import Button from '@material-ui/core/Button';

const ModalWorkshopInfos = ({workshopInfos, closeModal}) => {

    console.log(workshopInfos)

    return (
        <div>
            <h3>Atelier créé !</h3>
            <p>L'atelier <b>{workshopInfos.workshop_name}</b> a bien été créé.
            <br/><br/>
            Le <b>lien de consultation des résultats de l'atelier</b> :<br/>
            {`http://mission-climat.io/ateliers/${workshopInfos.id}`}
            <br/><br/>
            Le <b>code atelier</b> à partager aux participants de l'atelier :<br/>
            {workshopInfos.workshop_code}
            <br/><br/>
            Le <b>code administrateur</b> à conserver (pour supprimer l'atelier ou certains résultats) :<br/>
            {workshopInfos.admin_code}
            <br/><br/>
            Un email vous a été envoyé pour vous permettre de conserver ces informations.</p>
            <Button onClick={()=>closeModal()}>Ok</Button>
        </div>
    )
}

export default ModalWorkshopInfos
