export function fetchStockDataQuery(){
    return {
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
        params: ({ period }) => ({
          dataSet: "ULowA8V3ucd",
          orgUnit: "uPshwz3B3Uu",
          period: String(period).replace("-", ''),
        }),
      },

      profile: {
        resource: "/me"
      },
    }
  }
