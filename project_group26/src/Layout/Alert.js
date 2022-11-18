import React from "react";
import { AlertBar } from "@dhis2/ui";

export default function Alert(props) {
    return (
        <div
            style={{
                height: '260px'
            }}
        >
            <div
                className="alert-bars"
                style={{
                    bottom: 0,
                    left: 0,
                    paddingLeft: 16,
                    position: 'fixed',
                    width: '100%'
                }}
            >
                <React.Fragment key=".0">
                    {props.variant === "default" && (
                        <AlertBar duration={3000}>
                            INFO: {props.message}
                        </AlertBar>
                    )}

                    {props.variant === "warning" && (
                        <AlertBar warning duration={3000}>
                            WARNING: {props.message}
                        </AlertBar>
                    )}

                    {props.variant === "success" && (
                        <AlertBar success duration={3000}>
                            SUCCESS: {props.message}
                        </AlertBar>
                    )}

                    {props.variant === "critical" && (
                        <AlertBar critical duration={3000}>
                            ERROR: {props.message}
                        </AlertBar>
                    )}

                </React.Fragment>
            </div>
        </div>
    );
}
