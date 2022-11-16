import React, { useState, useEffect } from "react";
import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import { InputField } from '@dhis2/ui'
import { Button, ButtonStrip} from '@dhis2-ui/button'
import { DataTable, DataTableColumnHeader, DataTableRow, DataTableCell} from '@dhis2-ui/table'
import { Modal, ModalContent, ModalActions} from '@dhis2-ui/modal'
import { SingleSelectOption,  SingleSelect, SingleSelectField} from '@dhis2-ui/select'
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
    "localUsers": {
        "resource": "/users",
        "params": {
            "paging": "false",
            "userOrgUnits": true
        }
    },
    "allUsers": {
        "resource": "/users",
        "params": {
            "paging": "false",
        }
    }      
  };
  function postDispenseMutationQuery() {
    return {
      resource: "dataValueSets",
      type: "create",
      dataSet: "ULowA8V3ucd",
      data: ({ dispenseMutation }) => ({
        dataValues: dispenseMutation,
      }),
    };
  }

//console.log("Data query: ",dataQuery)
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
    const [mutate, { mutateLoading, mutateError }] = useDataMutation(
        postDispenseMutationQuery()
    );
    const [mutationArray, setMutationArray] = useState([])
    const [hideModal, setHideModal] = useState(true)
    const [dispenser, setDispenser] = useState('')
    const [recipient, setRecipient] = useState('')
    const [commodity, setCommodity] = useState('')
    const [commodityID, setCommodityID] = useState('')    
    const [amount, setAmount] = useState()
    const [addedTable, setAddedTable] = useState([])
    
    function clearState(){
        setAddedTable([])
        setHideModal(true)
        setRecipient('')
        setCommodity('')
        setAmount()
        setMutationArray([])
    }
    //console.log("Recieved Data: ", data)

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {

        let mergedData = mergeData(data)
        let counter = 0
        //console.log(mergedData)
        return (
            <div>
                <h3>Dispenser</h3>
                <SingleSelectField type="text" filterable 
                selected={dispenser} key={counter++} 
                value={dispenser} 
                onChange={e => setDispenser(e.selected)} 
                placeholder="Select Dispensee" 
                className="Dispensee"
                noMatchText="No user by that name">
                {data.localUsers.users.map( users => {
                    if(users.id != undefined && users.displayName !=undefined){
                        return (
                            <SingleSelectOption key={users.id} label={users.displayName} value={users.displayName}/>
                            )
                        }
                    }
                )}
                </SingleSelectField>
                <h3>Recipient</h3>
                <SingleSelectField type="text" filterable 
                selected={recipient} key={counter++} 
                value={recipient} 
                onChange={e => setRecipient(e.selected)} 
                placeholder="Select recipient" 
                className="Recipient"
                noMatchText="No user by that name">
                {data.allUsers.users.map( users => {
                    if(users.id != undefined && users.displayName !=undefined){
                        return (
                            <SingleSelectOption key={users.id} label={users.displayName} value={users.displayName}/>
                            )
                        }
                    }
                )}
            </SingleSelectField>
            <h3>Choose Commodity to Dispense</h3>
            <div>
            <SingleSelectField type="text" filterable 
                selected={commodity} key={counter++} 
                value={commodity} 
                onChange={e => {setCommodity(e.selected)}} 
                placeholder="Select Commodity" 
                className="Commodity"
                noMatchText="No commodity by that name">
                {mergedData.map( commodity => {
                    //console.log(commodity)
                        return (
                            <SingleSelectOption key={commodity.id} label={String(commodity.displayName.split(" - ")[1])} 
                            value={String(commodity.id)}/>
                            )
                        }
                )}
            </SingleSelectField>
            <InputField type="number" value={amount} onChange={(e => setAmount(e.value) )} placeholder="Amount"/>
            <Button onClick={(e) => {
                console.log("pressed confirm")
                setAddedTable(current => [...current, {
                    recipient: recipient,
                    dispenser: dispenser,
                    amount: amount,
                    commodity: commodity,
                    commodityID: commodityID
                    }])
                setMutationArray([...mutationArray,{
                    categoryOptionCombo: "J2Qf1jtZuj8",
                    dataElement: commodity,
                    period: "202110",
                    orgUnit: "uPshwz3B3Uu",
                    value: amount,
                }])
                console.log("mutationArray: ",mutationArray)  
            }} primary>
                Add
            </Button>
            </div>
            <DataTable>
                <TableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>Commodity</DataTableColumnHeader>
                        <DataTableColumnHeader>Amount</DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>
                <TableBody key={counter++}>
                    {addedTable.map((row, index) => {
                        return (
                            <DataTableRow key={index}>
                                <DataTableCell >{row.commodity}</DataTableCell>
                                <DataTableCell key={counter++}>
                                {row.amount}
                                </DataTableCell>
                                <DataTableCell key={counter++}> 
                                <Button onClick={() => console.log(index)} destructive>
                                    Remove
                                </Button>
                                </DataTableCell>
                            </DataTableRow>
                        )
                    })}
                </TableBody>
                <TableFoot>
                <DataTableRow>
                    <DataTableCell colSpan="4">
                    <Button name="Dispense button" onClick={() => setHideModal(false)} 
                    primary value="default">
                        Dispense
                    </Button>
                    </DataTableCell>
                </DataTableRow>
                </TableFoot>
            </DataTable>
            <Modal hide={hideModal} small>
                <ModalContent>
                    Verification box
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={(e)=> {
                        setHideModal(true)}} destructive>
                                Cancel
                        </Button>
                        <Button onClick={(e) => {
                        let success = true
                        console.log("this is the array I am sendiong: ", mutationArray)
                        mutate({
                            dispenseMutation: mutationArray,
                        }).then(function (response) {
                                if (response.response.status !== "SUCCESS") {
                                    success = false
                                    console.log(response);
                                }
                            })
                        if(success) {
                            clearState()
                        }
                        }} primary>
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
function deleteRow(index, oldArray){
    let newArray = oldArray.splice(index, 1)
    return newArray
}

//Made this to get the period we want in a query
function getPeriod(date){
    //console.log("Input date",date)
    //console.log("Modified date",date.split('-').join('').slice(0, -2))
    return date.split('-').join('').slice(0, -2)
}