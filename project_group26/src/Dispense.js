import React, { useState } from "react";
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import { InputField } from '@dhis2/ui'

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
    "dataSets": {
      "resource": "dataSets/ULowA8V3ucd",
      "params": {
        "fields": [
          "name",
          "id",
          'dataSetElements[dataElement[name,id,dataElementGroups[name,id],categoryCombo[categoryOptionCombos[name,id]',
          ],
      },
    },
    "dataValueSets": {
      "resource": "dataValueSets",
      "params": {
        "orgUnit": "uPshwz3B3Uu",
        "dataSet": "ULowA8V3ucd",
        "period": "202110",
      },
    },
  };
  //({period}) => period
console.log("Data query: ",dataQuery)
function mergeData(data) {
    return data.dataSets.dataSetElements.map(d=> {
        const Mvalue = data.dataValueSets.dataValues.filter((dataValues)=> {
        const dv = dataValues.categoryOptionCombo;
      if (dv !== "HllvX50cXC0" && dv !== "KPP63zJPkOu"){
        return dataValues.dataElement === d.dataElement.id;
      }
      return null;
        });
    return {
      type: distinguishName(d.dataElement.dataElementGroups),
      displayName: d.dataElement.name,
      id: d.dataElement.id,
      value: Mvalue,
    };
    });
    /* let dataValues = data.dataValueSets.dataValues.map(e => {
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
    return mergedData */
}
export function Dispense() {
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
            <div>
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Time</TableCellHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Amount</TableCellHead>
                        <TableCellHead>Dispensed by</TableCellHead>
                        <TableCellHead>Dispensed to</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody key={counter++}>
                    {mergedData.map(row => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell key={counter++}>
                                    <InputField
                                    className="time"
                                    type="time"
                                    value=""
                                    onChange={({ value }) => this.value}/>
                                </TableCell>
                                <TableCell >{row.displayName.split(" - ")[1]}</TableCell>
                                <TableCell key={counter++}>
                                    <InputField
                                    type="number" placeholder="Amount"/>
                                </TableCell>
                                <TableCell key={counter++}> 
                                    <InputField
                                    type="input" placeholder="Dispensee"/>
                                </TableCell>
                                <TableCell key={counter++}> 
                                    <InputField
                                    type="input" placeholder="Dispense to name"/>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            </div>
        )
    }
}

function distinguishName(data) {
    const find = data.find(data => data.id !== "Svac1cNQhRS")
    return find.name.split("Commodities ")[1]
  }

//Made this to get the period we want in a query
function getPeriod(date){
    //console.log("Input date",date)
    //console.log("Modified date",date.split('-').join('').slice(0, -2))
    return date.split('-').join('').slice(0, -2)
}