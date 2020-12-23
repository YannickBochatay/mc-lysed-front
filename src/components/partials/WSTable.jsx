import React from 'react'

const WSTable = ({table, numberDisplayed}) => {

    if (numberDisplayed==="all") {numberDisplayed=10000}

    return (
        <table>
            <thead>
                <tr>
                    {table.titles.map(cell => (
                        <th>{cell}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {table.data.map((line,i)=> (
                    i<numberDisplayed && <tr>
                        {line.map(cell=>(
                            <td>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default WSTable
