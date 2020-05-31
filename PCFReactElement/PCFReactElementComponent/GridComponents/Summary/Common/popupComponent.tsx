
import React, { Component, Props } from 'react';
import { Dialog } from 'primereact/dialog';

import { Button } from 'primereact/button';
import { DataTableAddNew } from '../MonthlySummary/addNewEntryComponent'
import { IInputs } from '../../../generated/ManifestTypes';
type AppProps = {
    test?: any;
    context: ComponentFramework.Context<IInputs>;
    IsUpdated:boolean;
}

type AppState = {
    displayBasic: boolean;
    displayBasic2: boolean;
    displayBlockScroll: boolean;
    displayModal: boolean;
    displayMaximizable: boolean;
    displayPosition: boolean;
    position: string;
    updatedData:any[]
}
interface inputData{
    SetData():any,
    data:any[]

}
const data={
    data: [
        {
            "CFNAME": "", "PPR": "", "January": " ",
            "February": "", "March": "", "April": " ","May" : "", "June": " ","July": "", "August": "", "September": " ", "October": " ",
            "November": " ","December": " ","LineTotal": " "        
        }]
    };
export class DialogDemo extends Component<AppProps, AppState>{

    constructor(props: AppProps) {
        super(props);
        this.state = {
            displayBasic: false,
            displayBasic2: false,
            displayBlockScroll: false,
            displayModal: false,
            displayMaximizable: false,
            displayPosition: false,
            position: 'center',
            updatedData: []
           
        };
           
    }




    onClick(name: string) {

        let state = {
            [`${name}`]: true
        };
        this.setState((prevState) => ({ ...prevState, [`${name}`]: true }))

    }

    onHide(name: string) {
        debugger;

        this.setState((prevState) => ({ ...prevState, [`${name}`]: false }))
    }
    onSave(name: string) {
        debugger;

        let updatedDatas: any[] = this.state.updatedData;
        
        let gridEntity: string = this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
            let editedObject = this.createApiUpdateRequest(updatedDatas[0]);
            console.log(editedObject);
            try {
                this.props.context.webAPI.createRecord(gridEntity,  editedObject).then(this.successCallback, this.errorCallback);
                this.props.context.parameters.sampleDataSet.refresh();
                this.setState((prevState) => ({ ...prevState, [`${name}`]: false }))
            }
            catch (Error) {
                console.log(Error.message);
            }
            this.forceUpdate();
            debugger;
    }

    createApiUpdateRequest(editNode: any) {
        debugger;
        let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        var entity = {};
        entity["LineTotal"] = 0;
        
        debugger;
        for (let Column in editNode) {
            if(months.includes(Column))
            {
              entity["LineTotal"] += Number(editNode[Column]);
              entity[Column] = Number(editNode[Column]);
            }
            else if(Column == "PPR")
            {
                entity["m360_PPR@odata.bind"] = "/m360_pprs(43d2bb09-a779-ea11-a811-000d3a59a6cd)";
            }
            else{
                entity[Column] = editNode[Column];
                
            }
        }
        entity["LineTotal"] = Number(entity["LineTotal"]);
        return entity;
    }

    
    successCallback() {
        // console.log("api create success");
        console.log("api update success");
    }

    errorCallback() {
        console.log("api update failed");
    }

    
    renderFooter(name: string) {
        return (
            <div>
                <Button label="Save" icon="pi pi-check" onClick={() => this.onSave(name)} />
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-secondary" />
            </div>
        );
    }

    setData=(data)=>{
        let updatedDatas: any[] = data;
        this.setState({ updatedData: updatedDatas });
    }

    render() {
        return (



                <div className="addNewButton">
 
                    <Button label="AddNew" className="addnewBtn" icon="pi pi-external-link" onClick={() => this.onClick('displayBasic2')} iconPos="left" />

                    <Dialog header="Add New Record" visible={this.state.displayBasic2} style={{ width: '90vw' }} onHide={() => this.onHide('displayBasic2')} blockScroll footer={this.renderFooter('displayBasic2')}>
                        <DataTableAddNew  data={data} setData={this.setData} />
                        <label style={{float:"left",color:"#ab9999"}} >CFName*: Cash Flow Item Name</label>
                    </Dialog>

                </div>

        )
    }
}