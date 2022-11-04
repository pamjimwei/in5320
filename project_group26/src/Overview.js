import React, { useState, useEffect } from "react";
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
export function Overview() {
    const [period, setPeriod] = useState('202110')
    const { loading, error, data } = useDataQuery(dataQuery)
    console.log("Recieved Data: ", data)
    console.log("Recieved period: ", period)
    useEffect(() => {
        highlightLowInventory()
       }, [data]); // <-- empty array means 'run once'
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
            <InputField
                label="Select month to view"
                type="date"
                value={period}
                max="2021-12-31"
                min="2021-01-01"
                onChange={({ value }) => setPeriod(getPeriod(value))}
            />
            <Table>
                <TableHead>
                    <TableRowHead >
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Consumption</TableCellHead>
                        <TableCellHead>Inventory</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody key={counter++}>
                    {mergedData.map(row => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell >{row.displayName.split(" - ")[1]}</TableCell>
                                <TableCell key={counter++}> {row.value[0].value} </TableCell>
                                <TableCell className="inventory" key={counter++}> {row.value[1].value} </TableCell>
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

function highlightLowInventory(){
    const result = document.querySelectorAll('[class$=inventory]')
    result.forEach(element => {
        if(Number(element.innerHTML)< 10){
            element.style.background = "red"
        }
    })
    console.log(result)
    }