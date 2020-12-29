import React, {useEffect} from "react";

import api from "api/APIHandler";
import { getDataToExport } from "utils/getDataToExport";

const ModalVSGeneralConfirmation = ({closeModal, results, val, jsonFile}) => {

    //post scenario to general workshop
    useEffect(()=> {
        const data = getDataToExport(jsonFile, val, results, "all")

        //TO DO : add to config var
        const WSInfos = {
            "workshop_code": '418999',
            "user_email": 'fake_email@mission-climat.io',
            "group_name": 'n/a'
        };

        api
        .post("/aggregator/result/",{...WSInfos, data})
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

    },[])

    //TO DO : add to config var
    const urlWorkshopGnl = "http://localhost:3000/workshop/";
    let idWorkshopsGnl = {};
    idWorkshopsGnl.lysed = "a3af4056-76be-47c5-a4ae-3224461ad18e";    

    return (
        <div>
            <h3>Scénario validé !</h3>
            <p>Votre scénario a bien été validé, merci pour le partage à la communauté.</p>
            <button onClick={()=>closeModal()}>Retour au simulateur</button>
            <a href={urlWorkshopGnl + idWorkshopsGnl.lysed} target="_blank"><button>Consulter les résultats agrégés</button></a>
            
        </div>
    )
}

export default ModalVSGeneralConfirmation
