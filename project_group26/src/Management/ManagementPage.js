import React from "react";
import { Management } from "./";


export default function ManagementPage(props) {
      return (
        <>
          {props.activePage === "Management" && <Management me={props.me} />}
        </>
      );
  
}
  