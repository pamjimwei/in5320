import React, { useState, useEffect } from 'react'
import { useDataQuery, useDataMutation} from '@dhis2/app-runtime'
import { Loader, Alert } from "../Layout";
import { CircularLoader, TextArea} from '@dhis2/ui'
import { Modal, ModalContent, ModalActions} from '@dhis2-ui/modal'
import { DataTable, DataTableColumnHeader, DataTableRow, DataTableCell} from '@dhis2-ui/table'
import { fetchStockDataQuery } from "../API/overviewDataquery";
import { postDispenseMutationQuery, DispenseCommodityDataQuery, fetchDispenseDataStoreMutationQuery } from "../API/dispenseDataquery";
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

export default function Management(props) {
    const { loading, error, data, refetch} = 
    useDataQuery(DispenseCommodityDataQuery(props.me.orgUnit, props.me.currentPeriod));

    const [dataStoreMutate, { mutateDSLoading, mutateDSError }] =
        useDataMutation(fetchDispenseDataStoreMutationQuery());
        
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
                    categoryOptionCombo: "KPP63zJPkOu",
                    dataElement: key,
                    period: "202110",
                    orgUnit: "uPshwz3B3Uu",
                    value: object[key]
                    }
            )   
            });
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
        let countTrue = 0
        if(formValues != {}){
            Object.keys(formValues).forEach(function(key){
                if(formValues[key] != ''){
                    countTrue += 1
                }
            });
        }
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
            <h2>Store Management</h2>
            <DataTable>
                <TableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>Display Name</DataTableColumnHeader>
                        <DataTableColumnHeader>Current Inventory</DataTableColumnHeader>
                        <DataTableColumnHeader>Quantity to be </DataTableColumnHeader>
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
                        let filteredForm = Object.fromEntries(Object.entries(formValues).filter(([_, v]) => v != ""));
                        let arr = createMutationArray(filteredForm)
                        setRecountMutation(arr)

                        setHideModal(false)
                    }} 
                    primary value="default">
                        Submit Order
                    </Button>
                    <Button name="clear" onClick={clearState} >Clear Input</Button>
                    </ButtonStrip>
                    </DataTableCell>
                </DataTableRow>
                </TableFoot>
            </DataTable> 
            <Modal hide={hideModal} medium>
                <ModalContent>
                    <h3>Are you sure about your Order?</h3>
                <TextArea
                    name="TransactionText"
                    requiered
                    value = {recountNotes}
                    placeholder="Please write a note for the Order"
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

                            //Our setup that gathers a previous datastore results and appends them
                            //does not work right now.
                            //let datastoreData = []
                            //datastoreData.push(data.DSManagement.transactions)
                            //datastoreData.push(formValues)
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
