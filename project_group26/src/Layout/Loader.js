import React from "react";
import { CircularLoader } from "@dhis2/ui";
import classes from "../App.module.css";

export default function Loader() {
    return (
        <div className={classes.loader}>
            <CircularLoader />
        </div>
    )
}
