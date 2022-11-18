import React from "react";
import classes from "./App.module.css";
import { useState } from "react";
import { ManagementPage } from "./Management";
import { OverviewPage } from "./Overview";
import { DispensePage } from "./Dispense";
import { RecountPage } from "./Recount";
import { Navigation, Alert, Loader } from "./Layout";
import { useDataQuery } from "@dhis2/app-runtime";
import { fetchMeDataQuery } from "./API/meDataQuery";


function MyApp() {
  const { loading, error, data } = useDataQuery(fetchMeDataQuery());
  const [activePage, setActivePage] = useState("OverviewPage");

  function activePageHandler(page) {
    setActivePage(page);
  }

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
    const me = {
      currentPeriod: "202110",
      orgUnit: "uPshwz3B3Uu",
      name: data.me.name,
      id: data.me.id,
      organisationUnit: data.me.organisationUnits[0].id,
    }

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Navigation
          activePage={activePage}
          activePageHandler={activePageHandler}
        />
      </div>
      <div className={classes.right}>
        <OverviewPage activePage={activePage} me={me} />
        <ManagementPage activePage={activePage} me={me}/>
        <DispensePage activePage={activePage} me={me} />
        <RecountPage activePage={activePage} me={me}/>
        
      </div>
    </div>
  );
  }
}

export default MyApp;
