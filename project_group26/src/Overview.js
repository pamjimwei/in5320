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
    DataTableCell
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
      "params": ({period}) => ({
        "orgUnit": "uPshwz3B3Uu",
        "dataSet": "ULowA8V3ucd",
        "period": String(period).replace("-", ''),
      }),
    },
    "profile": {
        "resource": "/me"
    }
  };



  //({period}) => period

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

        ///Consumption ID: J2Qf1jtZuj8
        // Quantity to be ordered ID:KPP63zJPkOu
        // Inventory (End Balance) ID: rQLFnNXXIL
    return mergedData
}
export function Overview() {
    const [period, setPeriod] = useState('202110')

    const { loading, error, data, refetch} = useDataQuery(dataQuery, {
        variables: {
            period: period,
        }
    })
    //const { isLoading, isError, data } = useQuery(dataQuery, () => fetch(`https://test.com?param=${param}`))
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
        console.log(data.profile.name)
        let counter = 0
        return (
            <div>
            <InputField 
            min="2021-01" 
            max="2021-12" 
            label="Period" 
            value={period} 
            type="month" 
            name="Period" 
            onChange={(e) => {setPeriod(e.value)
            refetch({period: e.value})}} />
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