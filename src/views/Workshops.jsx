import React, {useState} from "react";

//COMPONENTS
import Modal from 'components/partials/Modal';

import ModalCreateWorkshop from 'components/Workshops/ModalCreateWorkshop';
import ModalWorkshopInfos from 'components/Workshops/ModalWorkshopInfos';

//STYLES
import "../styles/workshops.css";

const Workshops = () => {

    const [modalCreateWorkshop, setModalCreateWorkshop] = useState(false);
    const [modalWorkshopInfos, setModalWorkshopInfos] = useState(false);
    const [workshopInfos, setWorkshopInfos] = useState({});

    return (
        <div id="workshops">
            <Modal 
                isOpen={modalCreateWorkshop}
                closeModal={()=>setModalCreateWorkshop(false)}
                okButton={false}
                children={
                    <ModalCreateWorkshop
                        closeModal={()=>setModalCreateWorkshop(false)}
                        setWorkshopInfos={setWorkshopInfos}
                        setModalWorkshopInfos={setModalWorkshopInfos}>
                    </ModalCreateWorkshop>}>
            </Modal>

            <Modal 
                isOpen={modalWorkshopInfos}
                closeModal={()=>setModalWorkshopInfos(false)}
                okButton={false}
                children={
                    <ModalWorkshopInfos
                        workshopInfos={workshopInfos}
                        closeModal={()=>setModalWorkshopInfos(false)}>
                    </ModalWorkshopInfos>}>
            </Modal>

            <h1>Ateliers Mission Climat</h1>
            <p>Les ateliers MC, c'est vraiment de la boulette</p>
            <button onClick={()=>setModalCreateWorkshop(true)}>Créer un atelier</button>
            {/* <button onClick={}>Créer un atelier</button>  */}
        </div>
    )
}

export default Workshops
