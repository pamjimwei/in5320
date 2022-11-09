import React, { useState } from "react";
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import { InputField } from '@dhis2/ui'
import { Button, ButtonStrip} from '@dhis2-ui/button'
import { DataTable, DataTableColumnHeader, DataTableRow, DataTableCell} from '@dhis2-ui/table'
import { Modal, ModalContent, ModalActions} from '@dhis2-ui/modal'
import {
    TableBody,
    TableCell,
    TableFoot,
    TableHead,
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
}
export function Dispense() {
    const { loading, error, data } = useDataQuery(dataQuery)
    const [showModal, setShowModal] = useState(true)
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
            <DataTable>
                <TableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>Commodity</DataTableColumnHeader>
                        <DataTableColumnHeader>Amount</DataTableColumnHeader>
                        <DataTableColumnHeader>Dispensed by</DataTableColumnHeader>
                        <DataTableColumnHeader>Dispensed to</DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>
                <TableBody key={counter++}>
                    {mergedData.map(row => {
                        return (
                            <DataTableRow key={row.id}>
                                <DataTableCell >{row.displayName.split(" - ")[1]}</DataTableCell>
                                <DataTableCell key={counter++}>
                                    <InputField
                                    type="number" placeholder="Amount"/>
                                </DataTableCell>
                                <DataTableCell key={counter++}> 
                                    <InputField
                                    type="input" placeholder="Dispensee"/>
                                </DataTableCell>
                                <DataTableCell key={counter++}> 
                                    <InputField
                                    type="input" placeholder="Dispense to name"/>
                                </DataTableCell>
                            </DataTableRow>
                        )
                    })}
                </TableBody>
                <TableFoot>
                <DataTableRow>
                    <DataTableCell colSpan="4">
                    <Button name="Dispense button" onClick={(e) => {console.log("pressed dispense")
                setShowModal(false)}} primary value="default">
                        Dispense
                    </Button>
                    </DataTableCell>
                </DataTableRow>
                </TableFoot>
            </DataTable>
            <Modal hide={showModal} small>
                <ModalContent>
                    Verification box
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={(e)=> {console.log("pressed cancel")
                        setShowModal(true)}} destructive>
                                Cancel
                        </Button>
                        <Button onClick={(e) => {console.log("pressed confirm")
                        setShowModal(true)}} primary>
                            Confirm
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
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