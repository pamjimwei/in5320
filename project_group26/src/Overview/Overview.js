import React, { useState } from "react";
import { useDataQuery } from '@dhis2/app-runtime'
import { Loader, Alert } from "../Layout";
import { InputField, Field, MultiSelectField, MultiSelectOption, DataTableToolbar, Input } from '@dhis2/ui'
import { fetchStockDataQuery } from "../API/overviewDataquery";
import { filterStockData, mergeStockData, getCategoriesFromStockData } from "../Helpers/helpers";
import { Table } from "../Tables";

export default function Overview(props) {
    const { loading, error, data, refetch} = useDataQuery(fetchStockDataQuery(), {
        variables: {
            period: props.me.currentPeriod,
        }
    })
    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState([]);
    const [period, setPeriod] = useState('202110')

       
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
        let stockData = mergeStockData(data, true);
        let categories = getCategoriesFromStockData(stockData);
        const filteredData = filterStockData(stockData, filterQuery, searchQuery);
        return (
        <>
        <h2>Overview</h2>
        <DataTableToolbar>
          <div
            style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", }}
          >
            <Field label="Search Commodity">
              <Input
                name="defaultName"
                onChange={(e) => setSearchQuery(e.value)}
              />
            </Field>
            <MultiSelectField
              label="Commodity Categories"
              onChange={(e) => {
                setFilterQuery(e.selected);
              }}
              selected={filterQuery}
            >
              {categories.map((category, index) => (
                <MultiSelectOption
                  key={index}
                  label={category}
                  value={category}
                />
              ))}
            </MultiSelectField>
          </div>
        </DataTableToolbar>
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
            <Table
            headerData={[
                "Commodity",
                "Category",
                "Consumption",
                "Inventory",
                "Quantity to be ordered",
            ]}
            tableData={filteredData}
            defaultSortQuery={{ 0: "asc" }}
            default
            />
            
            </div>
        </>
        )
    }

}

