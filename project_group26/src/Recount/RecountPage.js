import React from "react";
import { Recount } from "./";

export default function RecountPage(props) {

    return (
      <>
        {props.activePage === "Recount" && <Recount me={props.me} />}
      </>
    );
    }