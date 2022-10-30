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
    dataSets: {
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
    let mergedData = data.dataSets.dataSetElements.map( d => {
        let matchedValue = data.dataValueSets.dataValues.filter( (dataValues) => {
            return dataValues.dataElement === d.dataElement.id 
        })
        ///Consumption ID: J2Qf1jtZuj8
        // Quantity to be ordered ID:KPP63zJPkOu
        // Inventory (End Balance) ID: rQLFnNXXIL0
        return {
            Commodity: d.dataElement.name,
            Consumption: d.dataElement.id,
            Inventory: matchedValue.categoryCombo.categoryOptionCombo.id
        }
    })
    console.log("Here it is: ",mergedData)
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
        console.log("After processing: ",mergedData)
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
                            <TableRow key={row.id}>
                                <TableCell>{row.displayName}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>{row.id}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }
}
