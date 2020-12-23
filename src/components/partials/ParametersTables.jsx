import React from 'react'
import WSTable from "./WSTable";

const ParametersTables = ({title, table, numberDisplayed}) => {
    return (
        <div className="parameters_table">
            <p>{title}</p>
            <WSTable table={table} numberDisplayed={numberDisplayed}/>
        </div>
    )
}

export default ParametersTables
