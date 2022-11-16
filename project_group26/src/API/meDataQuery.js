export function fetchMeDataQuery(){
    return {
        me: {
            resource: "me",
            params: {
            fields: ["name, id, organisationUnits"],
            },
        }
    }
}