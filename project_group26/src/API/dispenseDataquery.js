export function DispenseCommodityDataQuery(orgUnit, period) {
    return ({
      dataSets: {
        resource: "dataSets/ULowA8V3ucd",
        params: {
          fields: [
            "dataSetElements[dataElement[name,id,categoryCombo[categoryOptionCombos[name,id]],dataElementGroups[name, id]]]",
          ],
        },
      },
      dataValueSets: {
        resource: "dataValueSets",
        params: {
          orgUnit: orgUnit,
          dataSet: "ULowA8V3ucd",
          period: period
        },
      },
    localUsers: {
        resource: "/users",
        params: {
            paging: "false",
            userOrgUnits: true
        }
    },
    allUsers: {
        resource: "/users",
        params: {
            paging: "false",
        }
    },
    DSDispense: {
        resource: "/dataStore/IN5320-G26/DispensingHistory"
    },
    DSRecount: {
        resource: "/dataStore/IN5320-G26/RecountHistory"
    },
    DSDManagement: {
        resource: "/dataStore/IN5320-G26/ManagementHistory"
    }
    })
  }


export function postDispenseMutationQuery() {
    return {
      resource: "dataValueSets",
      type: "create",
      dataSet: "ULowA8V3ucd",
      data: ({ dispenseMutation }) => ({
        dataValues: dispenseMutation,
      }),
    };
  }

  export function fetchDataStoreQuery() {
    return ({
      resource: "dataStore/IN5320-G26/DispensingHistory",
    })
  }
   export function fetchDispenseDataStoreMutationQuery() {
    return ({
      resource: "dataStore/IN5320-G26/DispensingHistory",
      type: "update",
      data: (transactions) => transactions
    })
  }