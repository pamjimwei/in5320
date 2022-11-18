import React, { useState } from "react";
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableColumnHeader,
  Input,
} from "@dhis2/ui";
import { sortTableData, filterTableData } from "./Helpers/helpers";

export function Table(props){
    const [sortQuery, setSortQuery] = useState(props.defaultSortQuery);
    const [searchColumn, setSearchColumn] = useState(-1);
    const [searchQuery, setSearchQuery] = useState("");
    const filteredData = filterTableData(props.tableData, searchQuery, searchColumn);
    const tableData = sortTableData(filteredData, sortQuery);

    const handleSort = (columnIndex, order) => {
        const defaultColumn = parseInt(Object.keys(props.defaultSortQuery)[0]);
        const defaultDirection = props.defaultSortQuery[defaultColumn];
        if (order === "default") {
          if (columnIndex !== defaultColumn && defaultDirection === "desc") {
            order = defaultDirection;
          } else {
            order = "asc";
          }
          columnIndex = defaultColumn;
        }
        const newSortQuery = {};
        newSortQuery[columnIndex] = order;
        setSortQuery(newSortQuery);
      };

    return (
        <div>
          <div>
            <DataTable scrollHeight="550px">
              <DataTableHead>
                <DataTableRow>
                  {props.headerData.map((header, index) => {
                    return props.searchableColumns.length !== 0 && props.searchableColumns.includes(index) ? (
                      <DataTableColumnHeader
                        name={header}
                        sortDirection={
                          Object.keys(sortQuery).includes(index.toString())
                            ? sortQuery[index.toString()]
                            : "default"
                        }
                        onSortIconClick={(value) => handleSort(index, value.direction)}
                        filter={
                          <Input
                            dense
                            placeholder="Search"
                            name="firstName"
                            onChange={(e) => setSearchQuery(e.value)}
                            value={searchQuery}
                          />
                        }
                        onFilterIconClick={(e) => {
                          if (e.show) {
                            setSearchColumn(index)
                            setSearchQuery("")
                          } else {
                            setSearchColumn(-1)
                            setSearchQuery("")
                          }
                        }}
                        showFilter={searchColumn === index}
                        fixed
                        top="0px"
                        key={index}
                      >
                        {header}
                      </DataTableColumnHeader>
                    ) : (
                      <DataTableColumnHeader
                        name={header}
                        sortDirection={
                          Object.keys(sortQuery).includes(index.toString())
                            ? sortQuery[index.toString()]
                            : "default"
                        }
                        onSortIconClick={(value) => handleSort(index, value.direction)}
                        fixed
                        top="0"
                        key={index}
                      >
                        {header}
                      </DataTableColumnHeader>
                    );
                  })}
                </DataTableRow>
              </DataTableHead>
              <DataTableBody>
                {tableData.map((dataRow, index) => {
                  return (
                    <DataTableRow key={index}>
                      {dataRow.map((data, index) => {
                        return (
                          <DataTableCell key={index}>
                            {data.display}
                          </DataTableCell>
                        );
                      })}
                    </DataTableRow>
                  );
                })}
              </DataTableBody>
            </DataTable>
          </div>
        </div>
      );
}
Table.defaultProps = {
    placeholder: "",
    defaultSortQuery: { 0: "asc" },
    searchableColumns: [],
  };
