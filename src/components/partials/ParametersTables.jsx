import React, {useState, useEffect} from "react";
import WSTable from "./WSTable";
import Modal from "components/partials/Modal";

const ParametersTables = ({title, table, numberDisplayed}) => {

    const [isViewAll, setIsViewAll] = useState(false);
    const [table2, setTable2] = useState(table)

    console.log(isViewAll)

    return (

        <div className="parameters_table">
            <Modal
                isOpen={isViewAll}
                closeModal={() => setIsViewAll(false)}
                okButton={false}
                children={
                    <WSTable table={table2} numberDisplayed="all"/>
                }
                ></Modal>
            <p>{title}</p>
            <WSTable table={table} numberDisplayed={numberDisplayed}/>
            <button onClick={()=>setIsViewAll(true)}>Voir tous</button>
        </div>
    )
}

export default ParametersTables
