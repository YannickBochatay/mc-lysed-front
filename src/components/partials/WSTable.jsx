import React from "react";
import "../../styles/table.css";

const WSTable = ({ table, numberDisplayed }) => {
  if (!table) {
    return <></>;
  }

  if (numberDisplayed === "all") {
    numberDisplayed = 10000;
  }

  return (
    <table>
      <thead>
        <tr>
          {table.titles.map((cell, i) => (
            <th key={i}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.data.map(
          (line, i) =>
            i < numberDisplayed && (
              <tr key={i}>
                {line.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ),
        )}
      </tbody>
    </table>
  );
};

export default WSTable;
