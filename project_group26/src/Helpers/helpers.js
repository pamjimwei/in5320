export function filterStockData(stockData, filterQuery, searchQuery) {
    let filteredData = [];
    if (filterQuery.length !== 0) {
        filteredData = stockData.filter((row) =>
            filterQuery.includes(row[1].display)
        );
    } else {
        filteredData = [...stockData];
    }
    let searchedData = [];
    if (searchQuery !== "") {
        searchedData = stockData.filter((row) =>
            row[0].display.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        searchedData = [...filteredData];
    }
    return searchedData;
}

export function mergeStockData(data, isData) {
    const tableData = data.dataSets.dataSetElements.map((e) => {
        const commodity = e.dataElement;
        const commodityId = commodity.id;
        const commodityName = commodity.name.split(" - ")[1];
        const row = [{ display: commodityName, value: commodityName }];
        commodity.dataElementGroups.map((category) => {
            if (category.id !== "Svac1cNQhRS") {
                const categoryName = category.name.split("Commodities ")[1];
                row.push({ display: categoryName, value: categoryName });
            }
        });
        const values = commodity.categoryCombo.categoryOptionCombos.map(
            (values) => {
                const match = data.dataValueSets.dataValues.find((dataValue) => {
                    if (dataValue.dataElement == commodityId) {
                        if (dataValue.categoryOptionCombo == values.id) {
                            return true;
                        }
                    }
                });
                return {
                    name: values.name,
                    value: match ? match.value : null,
                };
            }
        );

        if (isData) {
            const consumption = values.find((e) => e.name === "Consumption").value;
            row.push({ display: consumption, value: parseInt(consumption) });
        }

        const endBalance = values.find((e) => e.name === "End Balance").value;
        row.push({ display: endBalance, value: parseInt(endBalance) });

        if (isData) {
            const quantity = values.find(
                (e) => e.name === "Quantity to be ordered"
            ).value;
            row.push({ display: quantity, value: parseInt(quantity) });
        }

        return row;
    });
    return tableData;
}

export function getCategoriesFromStockData(stockData) {
    return Array.from(
        new Set(
            stockData.map((value) => {
                return value[1].display;
            })
        )
    ).sort();
}

export function sortTableData(data, sortQuery) {
    const columnIndex = Object.keys(sortQuery)[0];
    const order = sortQuery[columnIndex];
    if (order === "asc") {
        data.sort((a, b) => compareByValueAsc(a[columnIndex], b[columnIndex]));
    } else {
        data.sort((a, b) => compareByValueDesc(a[columnIndex], b[columnIndex]));
    }
    return data;
}

export function filterTableData(data, searchQuery, searchColumn) {
    let searchedData = [];
    if (searchQuery !== "") {
        searchedData = data.filter((row) =>
            row[searchColumn].display.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        searchedData = [...data];
    }
    return searchedData;
}

export function getCurrentDateTime() {
    return new Date().toISOString().substring(0, 16);
}


export function mergeData(data) {
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

export function mergeCategoriesData(data) {
    let categories = [];
    data.dataSets.dataSetElements.map((d) => {
        let mergeInnerData =
            d.dataElement.categoryCombo.categoryOptionCombos.map((c) => {
                let match = {};
                try {
                    match = data.dataValueSets.dataValues.find(
                        (dataValues) => {
                            if (dataValues.dataElement == d.dataElement.id) {
                                if (dataValues.categoryOptionCombo == c.id) {
                                    return true;
                                }
                            }
                        }
                    );
                } catch (error) {
                    match.value = 0;
                }
                return {
                    name: c.name,
                    id: c.id,
                    value: match ? match.value : 0,
                };
            });
        d.dataElement.dataElementGroups.map((c) => {
            if (c.id !== "Svac1cNQhRS") {
                const category = categories.filter((e) => e.name === c.name);
                if (category.length === 0) {
                    categories.push({
                        name: c.name,
                        id: c.id,
                        commodities: [
                            {
                                name: d.dataElement.name,
                                id: d.dataElement.id,
                                values: mergeInnerData,
                            },
                        ],
                    });
                } else {
                    category[0].commodities.push({
                        name: d.dataElement.name,
                        id: d.dataElement.id,
                        values: mergeInnerData,
                    });
                }
            }
        });
    });
    return categories;
}

export function mergeDataStoreData(existingData, newTransaction, commodityData) {

    Object.values(newTransaction.commodities).forEach((commodity) => {
        commodityData.forEach((e) => {
            if (e.dataElement.id === commodity.commodity) {
                e.dataElement.dataElementGroups.forEach((group) => {
                    if (/Commodities\s.+/.test(group.name)) {
                        commodity["name"] =
                            e.dataElement.name.split(" - ")[1];
                        commodity["categoryName"] =
                            group.name.split("Commodities ")[1];
                    }
                });
            }
        });
        commodity.increasedStock = (parseInt(commodity.value) > 0)
        console.log("Increased stock", commodity.value, commodity.increasedStock)
    });

    existingData.transactions.unshift(newTransaction);

    return existingData;
}

export function parseDataStoreData(dataStoreData) {

    let transactions = [];
    dataStoreData.transactions.forEach((order) => {
        let transaction = {
            date: null,
            commodities: [],
            dispensedBy: null,
            dispensedTo: null,
            dept: null,
            external: null,
            increasedStock: null,
        };

        Object.entries(order).forEach(([key, value]) => {
            transaction[key] = value;
        });

        transactions.push(transaction);
    });

    return transactions;
}

export function compareByName(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

export function compareByValueAsc(a, b) {
    if (a.value > b.value) {
        return 1;
    } else if (a.value < b.value) {
        return -1;
    }
    return 0;
}

export function compareByValueDesc(a, b) {
    if (a.value > b.value) {
        return -1;
    } else if (a.value < b.value) {
        return 1;
    }
    return 0;
}

export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export function filterTransactionsByDate(data, year, month) {
    return data.filter((row) => {
        if (row[0].value.getFullYear().toString() === year) {
            if (month === "-1") {
                return true
            } else if (row[0].value.getMonth().toString() === month) {
                return true;
            }
        }
    });
}

function distinguishName(data) {
    const find = data.find(data => data.id !== "Svac1cNQhRS")
    return find.name.split("Commodities ")[1]
}