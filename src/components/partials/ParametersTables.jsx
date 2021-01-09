import React, { useState, useEffect } from "react";
import WSTable from "./WSTable";
import Modal from "./Modal";

const ParametersTables = ({ title, table, numberDisplayed }) => {
  
  const [isViewAll, setIsViewAll] = useState(false);
  const [table2, setTable2] = useState(table);

  return (
    <div className="flex-column acenter">
      <Modal isOpen={isViewAll} closeModal={() => setIsViewAll(false)} okButton>
        <h2 className="container_title">Tous les paramètres</h2>
        <WSTable table={table2} numberDisplayed="all" />
      </Modal>

      {title}

      <WSTable table={table} numberDisplayed={numberDisplayed} />

      <button type="button" className="btn secondary-btn" onClick={() => setIsViewAll(true)}>
        Voir tous
      </button>
    </div>
  );
};

export default ParametersTables;
