import React from 'react'

const ModalWorkshopType = ({setWorkshopType, closeModal}) => {
    return (
        <div>
            <h2>Êtes vous dans le cadre d'un atelier ?</h2>
            <button onClick={()=>closeModal()}>Annuler</button>
            <button onClick={()=>setWorkshopType("general")}>Non</button>
            <button onClick={()=>setWorkshopType("workshop")}>Oui</button>
        </div>
    )
}

export default ModalWorkshopType
