import React from "react";
import { Dispense } from "./";

export default function DispensePage(props) {
    
    return (
      <>
        {props.activePage === "Dispense" && <Dispense me={props.me} />}
      </>
    );

}