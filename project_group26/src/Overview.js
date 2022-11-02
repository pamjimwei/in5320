import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'

import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableFoot,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui'

const dataQuery = {
    dataSets1: {
        resource: "/dataSets",
        params: {
          fields: "name, id,dataSetElements[dataElement[name,id,categoryCombo[name,id,categoryOptionCombos[name,id]]]",
          filter: "id:eq:ULowA8V3ucd"
        }
      },
    dataValueSets: {
      resource: "/dataValueSets",
      params: {
        orgUnit: "uPshwz3B3Uu",
        period: "202111",
        dataSet: "ULowA8V3ucd"
      }    
    }
  }

function mergeData(data) {
    let dataValues = data.dataValueSets.dataValues.map(e => {
        return {
            co : e.categoryOptionCombo,
            id: e.dataElement,
            value: e.value
        }
    })
    console.log("this is datavalues", dataValues)
    let mergedData = data.dataSets1.dataSets[0].dataSetElements.map( d => {
        console.log("this is d: ",d)
        return {
            displayName: d.dataElement.name,
            consumption: d.dataElement.categoryCombo.categoryOptionCombos[0].id,
            value: d.dataElement.id
        }
        ///Consumption ID: J2Qf1jtZuj8
        // Quantity to be ordered ID:KPP63zJPkOu
        // Inventory (End Balance) ID: rQLFnNXXIL0

    })
    console.log("Here it is1: ",mergedData)
    return mergedData
}
export function Overview() {
    const { loading, error, data } = useDataQuery(dataQuery)
    console.log("Recieved Data: ", data)
    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
        let mergedData = mergeData(data)
        let counter = 0
        return (
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Consumption</TableCellHead>
                        <TableCellHead>Inventory</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {mergedData.map(row => {
                        return (
                            <TableRow key={counter++}>
                                <TableCell >{row.displayName}</TableCell>
                                <TableCell >{row.id}</TableCell>
                                <TableCell >{row.value}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }
}
