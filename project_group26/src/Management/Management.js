import React, { useState, useEffect } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { Loader, Alert } from "../Layout";
import { CircularLoader } from '@dhis2/ui'
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

export default function Management(props) {
    const { loading, error, data } = 
    useDataQuery(DispenseCommodityDataQuery(props.me.orgUnit, props.me.currentPeriod));

    const [formValues, setFormValues] = useState({});
    const [hideModal, setHideModal] = useState(true)
    const [disableButton, setDisableButton] = useState(true)
    function clearState(){
        setFormValues({})
        setDisableButton(true)
    }
    
    function checkFormValuesValid(){
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
    checkFormValuesValid()
        }, [formValues])

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
            <h2>Manage Store</h2>
            <DataTable>
                <TableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>Display Name</DataTableColumnHeader>
                        <DataTableColumnHeader>Current Inventory</DataTableColumnHeader>
                        <DataTableColumnHeader>Quantity to be Ordered</DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>
                <TableBody >
                    {mergedData.map((row) => {
                        return (
                            <DataTableRow key={row.id}>
                                <DataTableCell>{row.displayName.split(" - ")[1]}</DataTableCell>
                                <DataTableCell>{row.value[0].value}</DataTableCell>
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
                    <Button name="restock"
                    disabled={disableButton} 
                    onClick={() => {
                        console.log(formValues)
                        let filteredForm = Object.fromEntries(Object.entries(formValues).filter(([_, v]) => v != ""));
                        console.log("this is filtered", filteredForm) 
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
            <Modal hide={hideModal} small>
                <ModalContent>
                    <h3>Please Confirm your order</h3>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={()=> {
                        setHideModal(true)}} destructive>
                                Cancel
                        </Button>
                        <Button onClick={()=> {
                        setHideModal(true)
                        clearState()
                        }}primary>
                            Confirm
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
            </div>
        )
    
    }

}