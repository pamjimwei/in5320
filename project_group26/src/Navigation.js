import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Overview"
        active={props.activePage == "Overview"}
        onClick={() => props.activePageHandler("Overview")}
      />
      <MenuItem
        label="Management"
        active={props.activePage == "Management"}
        onClick={() => props.activePageHandler("Management")}
      />
      <MenuItem
        label="Dispense"
        active={props.activePage == "Dispense"}
        onClick={() => props.activePageHandler("Dispense")}
      />
      <MenuItem
        label="Recount"
        active={props.activePage == "Recount"}
        onClick={() => props.activePageHandler("Recount")}
      />
    </Menu>
  );
}
