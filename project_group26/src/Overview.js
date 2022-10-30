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
    let mergedData = data.dataSets1.dataSets.map( d => {
       let mergedData2 = d.dataSetElements.map(e => {
            let matchedValue = data.dataValueSets.dataValues.find(dataValues => {
                if (dataValues.dataElement == d.id) {
                    return true
                }
            })
            console.log("e : ", e)
            return {
                displayName: e.dataElement.name,
                id: e.dataElement.id,
                value: e.dataElement.id
            }
            
        })
        console.log("Here it is2: ",mergedData2)
        return mergedData2
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
        console.log("After processing: ",mergedData)
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
                        console.log("this is my row: ", row)
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
