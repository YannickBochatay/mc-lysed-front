import React, {useState} from "react";

//COMPONENTS
import Header from "components/partials/Header";
import Modal from 'components/partials/Modal';
import ModalWorkshopType from 'components/Workshops/ModalWorkshopType';
import ModalCreateWorkshop from 'components/Workshops/ModalCreateWorkshop';

//STYLES
import "../styles/workshops.css";

const Workshops = () => {

    const [modalWorkshopType, setModalWorkshopType] = useState(false);
    const [modalCreateWorkshop, setModalCreateWorkshop] = useState(false);
    const [openHelp, setOpenHelp] = useState(false);

    const setWorkshopType = (type) => {
        if (type=="workshop") {
            setModalWorkshopType(false)
            setModalCreateWorkshop(true)
        }
    }

    return (
        <div id="workshops">
            
            <Header />
            
            <Modal 
                isOpen={modalWorkshopType}
                closeModal={()=>setModalWorkshopType(false)}
                okButton={false}
                children={
                    <ModalWorkshopType 
                        closeModal={()=>setModalWorkshopType(false)} 
                        setWorkshopType={setWorkshopType}>
                    </ModalWorkshopType>}>
            </Modal>

            <Modal 
                isOpen={modalCreateWorkshop}
                closeModal={()=>setModalCreateWorkshop(false)}
                okButton={false}
                children={
                    <ModalCreateWorkshop
                        setWorkshopType={setWorkshopType}>
                    </ModalCreateWorkshop>}>
            </Modal>

            <h1>Ateliers Mission Climat</h1>
            <p>Les ateliers MC, c'est vraiment de la boulette</p>
            <button onClick={()=>setModalWorkshopType(true)}>Créer un atelier</button>
            {/* <button onClick={}>Créer un atelier</button>  */}
        </div>
    )
}

export default Workshops
