import React from "react";
import classes from "./App.module.css";
import { useState } from "react";

import { Overview } from "./Overview";
import { Management } from "./Management";
import { Dispense } from "./Dispense";
import { Recount } from "./Recount";
import { Navigation } from "./Navigation";


function MyApp() {
  const [activePage, setActivePage] = useState("Overview");

  function activePageHandler(page) {
    setActivePage(page);
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
        {activePage === "Overview" && <Overview />}
        {activePage === "Management" && <Management />}
        {activePage === "Dispense" && <Dispense />}
        {activePage === "Recount" && <Recount />}
      </div>
    </div>
  );
}

export default MyApp;
