
import React, { Component, Props } from 'react';
import { Dialog } from 'primereact/dialog';

import { Button } from 'primereact/button';
import { DataTableAddNew } from '../MonthlySummary/addNewEntryComponent'
import { IInputs } from '../../../generated/ManifestTypes';
type AppProps = {
    test?: any;
    context: ComponentFramework.Context<IInputs>;
    IsUpdated:boolean;
    columns: any[];
    monthDetails : any
    // data :any;
}

type AppState = {
    displayBasic: boolean;
    displayBasic2: boolean;
    displayBlockScroll: boolean;
    displayModal: boolean;
    displayMaximizable: boolean;
    displayPosition: boolean;
    position: string;
    updatedData:any[];
    monthDetails :any;
}
interface inputData{
    SetData():any,
    // data:any[]

}
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
            updatedData: [],
            monthDetails :[]
            
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
        let context: ComponentFramework.Context<IInputs>;
        context = this.props.context;
        let stateVariable = this;
        
        let gridEntity: string = this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
            let editedObject = this.createApiUpdateRequest(updatedDatas[0]);
            debugger;
            console.log(editedObject);
            try {
                this.props.context.webAPI.createRecord(gridEntity,  editedObject).then(function (result) {
                    debugger;

                        context.parameters.sampleDataSet.refresh();
                       }
                ,
                    function (result) {
                       })
                this.setState((prevState) => ({ ...prevState, [`${name}`]: false }))
            }
            catch (Error) {
                console.log(Error.message);
            }
            this.forceUpdate();
            debugger;
    }

    createMonthDefinition = () => {
        debugger;
        let expandYear, ppr, lineTotal, cashFlow;
        if (typeof (this.props.context.parameters) !== 'undefined') {
            expandYear = this.props.context.parameters.expandYear.raw;
            ppr = this.props.context.parameters.ppr.raw;
            lineTotal = this.props.context.parameters.lineTotal.raw;
            cashFlow = this.props.context.parameters.cashFlow.raw;
        }
        else {
            expandYear = "FinacialYear";
        }

        let resultData = {};
        let cols: any[];
        let month: any[] = [];
        cols = [];
        Object.values(this.props.columns).map(p => {
            let expander: boolean = false;
            switch (p.field) {
                case expandYear:
                case cashFlow:
                case ppr:
                case lineTotal:
                    {
                        break;
                    }
                default:
                    resultData = {
                        field: p.field, header: p.name, expander: expander
                    }
                    cols.push(resultData);
                    month.push(p.field);
                    break;
            }
        });
        debugger;
        this.setState({ monthDetails: month });
        console.log(this.state.monthDetails);
    }

    createApiUpdateRequest(editNode: any) {
        debugger;
        let months = this.state.monthDetails;

        let expandYear, ppr, lineTotal, cashFlow;
        if (typeof (this.props.context.parameters) !== 'undefined') {
            expandYear = this.props.context.parameters.expandYear.raw;
            ppr = this.props.context.parameters.ppr.raw;
            lineTotal = this.props.context.parameters.lineTotal.raw;
            cashFlow = this.props.context.parameters.cashFlow.raw;
        }
        var entity = {};
        entity[lineTotal] = 0;

        // @ts-ignore 
        let ContextId = this.props.context.page.entityId;
        // @ts-ignore 

        
        debugger;
        for (let Column in editNode) {
            if(months.includes(Column))
            {
              entity[lineTotal] += this.numberTryParse(editNode[Column]);
              entity[Column] = this.numberTryParse(editNode[Column]);
            }
            else if(Column == ppr)
            {
                 entity["m360_PPR"+"@odata.bind"] = "/"+"m360_pprs"+"(" + ContextId+ ")";
                // entity[primaryLookupschemaName+"@odata.bind"] = "/"+entitySetName+"(" + ContextId+ ")";
                // entity["m360_PPR@odata.bind"] = "/m360_pprs(43d2bb09-a779-ea11-a811-000d3a59a6cd)";
            }
            else if(Column == cashFlow)
            {
                entity[cashFlow] = editNode[Column];
            }
            else if (Column =="m360_fiscalyear")
            {
                entity["m360_fiscalyear"] = "555080002";
            }
            else if (Column =="Q1" || Column =="Q2" ||Column =="Q3" ||Column =="Q4" )
            {
                
            }
            else{
                // let stri
                entity[Column] = this.numberTryParse(editNode[Column]);
            }
        }
        entity[lineTotal] = this.numberTryParse(entity[lineTotal]);
        return entity;
    }

    
    numberTryParse(string) {
        var returnValue = 0;
        if (!isNaN(string) && string != null) {
          returnValue = Number.parseFloat(string);
        }
        return returnValue;
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
        debugger;
        let updatedDatas: any[] = data;
        this.setState({ updatedData: updatedDatas });
    }

    render() {
        let inputData = {
            columns: this.props.columns,
            context: this.props.context,
            monthDetails : this.props.monthDetails
            // data :this.props.data
        }
        return (



                <div className="addNewButton">
                    <Button label="AddNew" className="addnewBtn" icon="pi pi-external-link" onClick={() => this.onClick('displayBasic2')} iconPos="left" />
                    

                    <Dialog position="top" header="Add New Record" visible={this.state.displayBasic2} style={{ width: '90vw' }} onHide={() => this.onHide('displayBasic2')} blockScroll footer={this.renderFooter('displayBasic2')}>
                        <DataTableAddNew setData={this.setData}  {...inputData}  />
                        {/* <label style={{float:"left",color:"#ab9999"}} >CFName*: Cash Flow Item Name</label> */}
                    </Dialog>

                </div>

        )
    }
}