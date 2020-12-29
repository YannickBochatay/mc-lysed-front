import React from "react";


const ModalVSConfigureScenario = ({closeModal}) => {

    return (
        <div>
            <h3>Scénario validé !</h3>
            <p>Les données de votre scénario ont bien été envoyées, merci.</p>
            <button onClick={()=>closeModal()}>Ok</button>
        </div>
    )
}

export default ModalVSConfigureScenario
