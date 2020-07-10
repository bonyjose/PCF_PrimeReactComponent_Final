import * as React from "react";
import {IInputs, IOutputs} from "../../generated/ManifestTypes"


export interface RecordOverviewProps {
    id: string;
    context: ComponentFramework.Context<IInputs>;
}