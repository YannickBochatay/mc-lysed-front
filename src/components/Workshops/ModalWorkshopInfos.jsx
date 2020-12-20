import React from 'react'
import Button from '@material-ui/core/Button';

const ModalWorkshopInfos = ({workshopInfos, closeModal}) => {
    return (
        <div>
            <h3>Atelier créé !</h3>
            <p>L'atelier (nom atelier) a bien été créé.
            <br/><br/>
            Le lien de consultation des résultats de l'atelier :<br/>
            http://mission-climat.io/ateliers/id
            <br/><br/>
            Le *code atelier* à partager aux participants de l'atelier :<br/>
            (code atelier)
            <br/><br/>
            Le *code administrateur* à conserver (pour supprimer l'atelier ou certains résultats) :<br/>
            (code administrateur)
            <br/><br/>
            Un email vous a été envoyé pour vous permettre de conserver ces informations.</p>
            <Button onClick={()=>closeModal()}>Ok</Button>
        </div>
    )
}

export default ModalWorkshopInfos
