import React, { useState } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { Loader, Alert } from "../Layout";
import { CircularLoader } from '@dhis2/ui'
import { DataTable, DataTableColumnHeader, DataTableRow, DataTableCell} from '@dhis2-ui/table'
import { fetchStockDataQuery } from "../API/overviewDataquery";
import { postDispenseMutationQuery, DispenseCommodityDataQuery } from "../API/dispenseDataquery";
import { filterStockData, mergeStockData, getCategoriesFromStockData, mergeData } from "../Helpers/helpers";
import { InputField } from '@dhis2/ui'
import { ReactFinalForm } from '@dhis2/ui'
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
    const { loading, error, data } = 
    useDataQuery(DispenseCommodityDataQuery(props.me.orgUnit, props.me.currentPeriod));

    const [formValues, setFormValues] = useState({});

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
        let mergedData = mergeData(data, true);
        console.log(mergedData)

        return (
           <DataTable>
                <TableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>Display Name</DataTableColumnHeader>
                        <DataTableColumnHeader>Value</DataTableColumnHeader>
                        <DataTableColumnHeader>Recounted Quantity</DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>
                <TableBody>
                    {mergedData.map((row) => {

                        return (
                            <DataTableRow key={row.id}>
                                <DataTableCell>{row.displayName.split(" - ")[1]}</DataTableCell>
                                <DataTableCell>{row.value[0].value}</DataTableCell>
                                <DataTableCell>
                                    <InputField 
                                    name={row.id}
                                    value={formValues[row.id]} 
                                    type="number"
                                    inputWidth="40px"
                                    onChange={e => setFormValues({...formValues, [row.id]: e.value})}>
                                    </InputField>
                                </DataTableCell>
                            </DataTableRow>
                        )
                    })}
                </TableBody>
            </DataTable>
            
        )
    }
}
