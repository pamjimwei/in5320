import React, { useState, useEffect } from "react";
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import { InputField } from '@dhis2/ui'

import {
    DataTable,
    TableHead,
    DataTableRow,
    DataTableColumnHeader,
    TableBody,
    DataTableCell,





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
            <DataTable>
                <TableHead>
                    <DataTableRow >
                        <DataTableColumnHeader
                            name="Commodity" 
                            sortDirection="desc"
                            onSortIconClick={(e) =>console.log("this is the payload: ", e.direction, e.name) }
                            sortIconTitle="Sort by Commodity">
                            Commodity
                        </DataTableColumnHeader>
                        <DataTableColumnHeader
                            name="Consumption" 
                            sortDirection="desc"
                            onSortIconClick={(e) =>console.log("this is the payload: ", e.direction, e.name) }
                            sortIconTitle="Sort by Consumption">
                            Consumption
                        </DataTableColumnHeader>
                        <DataTableColumnHeader
                            name="Inventory" 
                            sortDirection="desc"
                            onSortIconClick={(e) =>console.log("this is the payload: ", e.direction, e.name) }
                            sortIconTitle="Sort by Inventory">
                            Inventory</DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>
                <TableBody key={counter++}>
                    {mergedData.map(row => {
                        return (
                            <DataTableRow key={row.id}>
                                <DataTableCell  >{row.displayName.split(" - ")[1]}</DataTableCell >
                                <DataTableCell  key={counter++}> {row.value[0].value} </DataTableCell >
                                <DataTableCell  className="inventory" key={counter++}> {row.value[1].value} </DataTableCell >
                            </DataTableRow>
                        )
                    })}
                </TableBody>
            </DataTable>
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

    //Checks a threshold for inventory and assigns a colour based on the threshold
function highlightLowInventory(){
    const result = document.querySelectorAll('[class$=inventory]')
    result.forEach(element => {
        if(Number(element.innerHTML)< 10){
            element.style.background = "red"
        }
    })
    }