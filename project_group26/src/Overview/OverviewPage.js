import React from "react";
import { Overview } from "./";


export default function OverviewPage(props) {
      return (
        <>
          {props.activePage === "OverviewPage" && <Overview me={props.me} />}
        </>
      );
  
}
  