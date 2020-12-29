import React from 'react'

const ModalVSWorkshopType = ({setWorkshopType, closeModal}) => {
    return (
        <div>
            <h2 className="container_title">Valider mon scénario</h2>
            <button onClick={()=>setWorkshopType("workshop")}>Je suis dans le cadre d'un atelier</button>
            <p>Munissez vous de votre code atelier, partagé par l'animateur</p>
            <button onClick={()=>setWorkshopType("general")}>Je suis un utilisateur classique</button>
            <p>Validez votre scénario et comparez le aux autres !</p>
            <button onClick={()=>closeModal()}>Annuler</button>
            
        </div>
    )
}

export default ModalVSWorkshopType
