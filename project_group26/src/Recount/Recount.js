import React, { useState, useEffect } from 'react'
import { useDataQuery, useDataMutation} from '@dhis2/app-runtime'
import { Loader, Alert } from "../Layout";
import { CircularLoader, TextArea} from '@dhis2/ui'
import { Modal, ModalContent, ModalActions} from '@dhis2-ui/modal'
import { DataTable, DataTableColumnHeader, DataTableRow, DataTableCell} from '@dhis2-ui/table'
import { fetchStockDataQuery } from "../API/overviewDataquery";
import { postDispenseMutationQuery, DispenseCommodityDataQuery } from "../API/dispenseDataquery";
import { filterStockData, mergeStockData, getCategoriesFromStockData, mergeData } from "../Helpers/helpers";
import { InputField } from '@dhis2/ui'
import { ReactFinalForm } from '@dhis2/ui'
import { Button, ButtonStrip} from '@dhis2-ui/button'
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

export default function Recount(props) {
    const { loading, error, data, refetch} = 
    useDataQuery(DispenseCommodityDataQuery(props.me.orgUnit, props.me.currentPeriod));

    const [mutate, { mutateLoading, mutateError }] = useDataMutation(
        postDispenseMutationQuery()
    );

    const [formValues, setFormValues] = useState({});
    const [hideModal, setHideModal] = useState(true)
    const [disableButton, setDisableButton] = useState(true)
    const [disableConfirm, setDisableConfirm] = useState(true)
    const [recountMutation, setRecountMutation] = useState([])
    const [recountNotes, setRecountNotes] = useState("")
    function clearState(){
        setFormValues({})
        setDisableButton(true)
        setRecountNotes("")
    }
    function createMutationArray(object){
       let newArray = []
        if(formValues != {}){
            Object.keys(object).forEach(function(key){
                newArray.push(
                    {
                    categoryOptionCombo: "rQLFnNXXIL0",
                    dataElement: key,
                    period: "202110",
                    orgUnit: "uPshwz3B3Uu",
                    value: object[key]
                    }
            )   
            });
        console.log("newArray",newArray)
        }
        return newArray
    }
    function checkConfirmButton(){
        if(recountNotes != ""){
            setDisableConfirm(false)
        }
        else{
            setDisableConfirm(true)
        }
    }
    function checkFormValuesValid(){
        console.log("changed")
        let countTrue = 0
        if(formValues != {}){
            Object.keys(formValues).forEach(function(key){
                if(formValues[key] != ''){
                    console.log("valid key,", formValues[key])
                    countTrue += 1
                }
            });
        }
        console.log(countTrue)
        if(countTrue > 0){
            setDisableButton(false)
        }
        else{
            setDisableButton(true)
        }
    }
    useEffect(() => {
        checkConfirmButton()
        checkFormValuesValid()
        }, [formValues, recountNotes])

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
        let mergedData = mergeData(data, true);
        return (
            <div>
            <h2>Recount Inventory</h2>
            <DataTable>
                <TableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>Commodity Name</DataTableColumnHeader>
                        <DataTableColumnHeader>Current recorded Inventory</DataTableColumnHeader>
                        <DataTableColumnHeader>Recounted Inventory</DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>
                <TableBody >
                    {mergedData.map((row) => {
                        return (
                            <DataTableRow key={row.id}>
                                <DataTableCell>{row.displayName.split(" - ")[1]}</DataTableCell>
                                <DataTableCell>{row.value[1].value}</DataTableCell>
                                <DataTableCell>
                                    <InputField 
                                    min="0"
                                    name={row.id}
                                    value={formValues[row.id]} 
                                    type="number"
                                    inputWidth="40px"
                                    onChange={e => setFormValues({...formValues, [row.id]: e.value})}
                                    >
                                    </InputField>
                                </DataTableCell>
                            </DataTableRow>
                        )
                    })}
                </TableBody>
                <TableFoot>
                <DataTableRow>
                    <DataTableCell colSpan="4">
                    <ButtonStrip>
                    <Button name="recount"
                    disabled={disableButton} 
                    onClick={() => {
                        console.log("this is formValues: ",formValues)
                        let filteredForm = Object.fromEntries(Object.entries(formValues).filter(([_, v]) => v != ""));
                        console.log("this is filtered", filteredForm) 
                        let arr = createMutationArray(filteredForm)
                        setRecountMutation(arr)
                        console.log("my new array", arr)
                        setHideModal(false)
                    }} 
                    primary value="default">
                        Submit Stock Recount
                    </Button>
                    <Button name="clear" onClick={clearState} >Clear Input</Button>
                    </ButtonStrip>
                    </DataTableCell>
                </DataTableRow>
                </TableFoot>
            </DataTable> 
            <Modal hide={hideModal} medium>
                <ModalContent>
                    <h3>Are you sure you want to Restock?</h3>
                <TextArea
                    name="TransactionText"
                    requiered
                    value = {recountNotes}
                    placeholder="Please write a note for the Recount"
                    onChange={e => setRecountNotes(e.value)}
                />
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={()=> {
                        setHideModal(true)}} destructive>
                                Cancel
                        </Button>
                        <Button onClick={()=> {
                        let success = true
                        mutate({
                            dispenseMutation: recountMutation,
                        }).then(function (response) {
                                if (response.response.status !== "SUCCESS") {
                                    success = false
                                    console.log(response);
                                }
                            })
                            refetch()
                        if(success) {
                            clearState()
                            setHideModal(true)
                        }
                        }}
                        primary
                        disabled={disableConfirm}>
                            Confirm
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
            </div>
        )
    
    }

}
