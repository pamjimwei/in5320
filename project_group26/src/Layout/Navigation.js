import React from "react";
import { Menu, MenuItem, IconHome16, IconExportItems24 } from "@dhis2/ui";

export default function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        icon={<IconHome16 />}
        label="Overview"
        active={props.activePage == "OverviewPage"}
        onClick={() => props.activePageHandler("OverviewPage")}
      />
      <MenuItem
        label="Management"
        active={props.activePage == "ManagementPage"}
        onClick={() => props.activePageHandler("Management")}
      />
      <MenuItem
        icon={<IconExportItems24 />}
        label="Dispense"
        active={props.activePage == "DispensePage"}
        onClick={() => props.activePageHandler("Dispense")}
      />
      <MenuItem
        label="Recount"
        active={props.activePage == "RecountPage"}
        onClick={() => props.activePageHandler("Recount")}
      />
    </Menu>
  );
}
