import React, { useState, useEffect } from "react";
import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import { InputField } from '@dhis2/ui'
import { Loader, Alert } from "../Layout";
import { Button, ButtonStrip} from '@dhis2-ui/button'
import { DataTable, DataTableColumnHeader, DataTableRow, DataTableCell} from '@dhis2-ui/table'
import { Modal, ModalContent, ModalActions} from '@dhis2-ui/modal'
import { SingleSelectOption,  SingleSelect, SingleSelectField} from '@dhis2-ui/select'
import { mergeData, getInventoryOfCommodity } from "../Helpers/helpers";
import { postDispenseMutationQuery, DispenseCommodityDataQuery, fetchDispenseDataStoreMutationQuery} from "../API/dispenseDataquery";
import {
    TableBody,
    TableCell,
    TableFoot,
    TableHead,
} from '@dhis2/ui'

export default function Dispense(props) {
    const { loading, error, data } = 
    useDataQuery(DispenseCommodityDataQuery(props.me.orgUnit, props.me.currentPeriod));


    const [dataStoreMutate, { mutateDSLoading, mutateDSError }] =
        useDataMutation(fetchDispenseDataStoreMutationQuery());
        
    const [mutate, { mutateLoading, mutateError }] = useDataMutation(
        postDispenseMutationQuery()
    );
    
    const [disabledInput, setDisabledInput] = useState(false)
    const [disabledAdd, setDisabledAdd] = useState(true)
    const [consumptionArray, setConsumptionArray] = useState([])
    const [endBalanceArray, setEndBalanceArray] = useState([])
    const [hideModal, setHideModal] = useState(true)
    const [dispenser, setDispenser] = useState('')
    const [recipient, setRecipient] = useState('')
    const [commodity, setCommodity] = useState('')
    const [maxValue, setMaxValue] = useState()

    const [amount, setAmount] = useState()
    const [addedTable, setAddedTable] = useState([])
    
    function getValueOfCo(data, co, id){
        let oldValue = 0
        data.map((e) => {
            if(e.id == id){
                if(e.value[0].categoryOptionCombo == co){
                    oldValue = e.value[0].value
                }
                if(e.value[1].categoryOptionCombo == co){
                    oldValue = e.value[1].value
                }
            }
        })
        console.log(oldValue)
        return oldValue
    }
    function clearCommodities(){
        setCommodity('')
        setAmount()
    }
    function clearState(){
        setAddedTable([])
        setHideModal(true)
        setRecipient('')
        setCommodity('')
        setAmount()
        setConsumptionArray([])
        setEndBalanceArray([])
    }

    function checkDisabledDispenser(){
        if(addedTable.length > 0){
            setDisabledInput(true)
        }

        else{
            setDisabledInput(false)
        }
    }
    function checkDisabledAdd(){
        if(dispenser =='' || recipient =='' || commodity =='' || amount == null || amount == undefined ){
            setDisabledAdd(true)
        }
        else{
            setDisabledAdd(false)
        }
    }

    //console.log("Recieved Data: ", data)
    useEffect(() => {
        checkDisabledDispenser()
        checkDisabledAdd()
       }, [addedTable, amount, commodity, maxValue])
    if (error) {
        return (
            <Alert variant={"critical"} message={error.message} />
        )
    }

    if (loading) {
        return (
            <Loader />
        )
    }

    if (data) {
        let mergedData = mergeData(data, true);
        let counter = 0
        console.log(data)

        return (
            <div>
                <h3>Dispensed by:</h3>
                <SingleSelectField 
                required 
                disabled={disabledInput} 
                initialFocus={true} 
                inputWidth="300px" type="text" filterable 
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
                <h3>Dispensed to:</h3>
                <SingleSelectField required  disabled={disabledInput} inputWidth="300px" type="text" filterable 
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
            <SingleSelectField  required  type="text" filterable 
                inputWidth="300px"
                selected={commodity} key={counter++} 
                value={commodity} 
                onChange={e => {setCommodity(e.selected)
                setMaxValue(getInventoryOfCommodity(mergedData, commodity,"J2Qf1jtZuj8" ))}} 
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
            {commodity !='' &&
            <div>
            <InputField  inputWidth="300px"required type="number" min={0}  value={amount} onChange={(e) => {
             setAmount(e.value)
             }} placeholder={"Amount to Dispense"}/>
            </div>
            }
            <Button disabled={disabledAdd} onClick={(e) => {
                setAddedTable(current => [...current, {
                    recipient: recipient,
                    dispenser: dispenser,
                    amount: amount,
                    commodity: commodity,
                    commodityID: commodity
                    }])

                let oldValueConsumption = getValueOfCo(mergedData, "J2Qf1jtZuj8", commodity)
                let newValueConsumption = parseInt(oldValueConsumption)+ parseInt(amount)

                let oldValueEndBalance = getValueOfCo(mergedData, "rQLFnNXXIL0", commodity)
                let newValueEndBalance  = parseInt(oldValueEndBalance)-parseInt(amount)



                setConsumptionArray([...consumptionArray,{
                    categoryOptionCombo: "J2Qf1jtZuj8",
                    dataElement: commodity,
                    period: "202110",
                    orgUnit: "uPshwz3B3Uu",
                    value: newValueConsumption
                }])


                setEndBalanceArray([...consumptionArray,{
                    categoryOptionCombo: "rQLFnNXXIL0",
                    dataElement: commodity,
                    period: "202110",
                    orgUnit: "uPshwz3B3Uu",
                    value: newValueEndBalance
                }])

                clearCommodities()
            }} primary>
                Add
            </Button>
        {addedTable.length > 0 &&
            <DataTable>
                <TableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>Commodity</DataTableColumnHeader>
                        <DataTableColumnHeader>Amount</DataTableColumnHeader>
                        <DataTableColumnHeader>Actions</DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>
                <TableBody key={counter++}>
                    {addedTable.map((row, index) => {
                        return (
                            <DataTableRow key={index}>
                                <DataTableCell >{getDisplayName(mergedData,row.commodity)}</DataTableCell>
                                <DataTableCell key={counter++}>
                                {row.amount}
                                </DataTableCell>
                                <DataTableCell key={counter++}> 
                                <Button name="delete_button" value={index} onClick={(e) => {
                                    let arr = [...addedTable]
                                    arr.splice(index, 1)
                                    setAddedTable(arr)}} destructive>
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
                    <Button name="Dispense button" onClick={() => {
                        setHideModal(false)}} 
                        primary value="default">
                        Dispense
                    </Button>
                    </DataTableCell>
                </DataTableRow>
                </TableFoot>
            </DataTable>
            }

            <Modal hide={hideModal} small>
                <ModalContent>
                    <h3>Dispensing from {dispenser} to {recipient}</h3>
                {addedTable.map((row, index) => {
                        return (
                            <DataTableRow key={index}>
                                <DataTableCell >{getDisplayName(mergedData,row.commodity)}</DataTableCell>
                                <DataTableCell key={counter++}>
                                {row.amount}
                                </DataTableCell>
                                <DataTableCell key={counter++}> 

                                </DataTableCell>
                            </DataTableRow>
                        )
                    })}
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={(e)=> {
                        setHideModal(true)}} destructive>
                                Cancel
                        </Button>
                        <Button onClick={(e) => {
                        let success = true

                        //Our setup that gathers a previous datastore results and appends them
                        let datastoreData = []
                        datastoreData.push(data.DSDispense.transactions)
                        datastoreData.push(addedTable)

                        mutate({
                            dispenseMutation: endBalanceArray,
                        }).then(function (response) {
                                if (response.response.status !== "SUCCESS") {
                                    success = false
                                    console.log(response);
                                }
                            })
                        mutate({
                            dispenseMutation: consumptionArray,
                        }).then(function (response) {
                                if (response.response.status !== "SUCCESS") {
                                    success = false
                                    console.log(response);
                                }
                            })
                            dataStoreMutate({
                                transactions: datastoreData,
                            })
                                .then(function (response) {
                                    if (response.status !== "SUCCESS") {
                                        console.log(response);
                                        success = false;
                                    }
                                })
                                .catch(function (response) {
                                    console.log(response);
                                    success = false;
                                });
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

function deleteRow(index, oldArray){
    let newArray = [...oldArray]
    newArray = newArray.splice(index, 1)
    return newArray
}

function getDisplayName(data, id){
    let name = ""
    data.map((element) => {
        if(element.id == id){
            name = String(element.displayName.split(" - ")[1])
        }
    })
    return name
}