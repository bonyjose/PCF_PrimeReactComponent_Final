
import React, { Component, Props } from 'react';
import { Dialog } from 'primereact/dialog';
import LoadingOverlay from 'react-loading-overlay';
import { Button } from 'primereact/button';
import { DataTableAddNew } from '../MonthlySummary/addNewEntryComponent'
import { IInputs } from '../../../generated/ManifestTypes';
import { isNull } from 'util';
type AppProps = {
    test?: any;
    context: ComponentFramework.Context<IInputs>;
    IsUpdated: boolean;
    columns: any[];
    monthDetails: any,
    pannelType: any,
    actualColDef: any[],
    isViewEditable: boolean
}

type AppState = {
    displayBasic: boolean;
    displayBasic2: boolean;
    displayBlockScroll: boolean;
    displayModal: boolean;
    displayMaximizable: boolean;
    displayPosition: boolean;
    position: string;
    updatedData: any[];
    monthDetails: any;
    loading: boolean;
    dropDownData: any;
}
interface inputData {
    SetData(): any,
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
            monthDetails: [],
            dropDownData: "",
            loading: false

        };
    }

    componentDidMount() {
        debugger;
        this.createMonthDefinition();
    }



    onClick(name: string) {

        let state = {
            [`${name}`]: true
        };
        this.setState((prevState) => ({ ...prevState, [`${name}`]: true }))

    }

    onHide(name: string) {
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

        console.log(editedObject);
        this.setState({ loading: true }, () => {
            setTimeout(() => {
                this.props.context.webAPI.createRecord(gridEntity, editedObject).then(function (result) {
                    context.parameters.sampleDataSet.refresh();
                    stateVariable.setState({ loading: false });
                },
                    function (result) {
                        stateVariable.setState({ loading: false });
                    })
                this.setState((prevState) => ({ ...prevState, [`${name}`]: false }))

            }, 3000);
        });
        // this.forceUpdate();

    }

    createMonthDefinition = () => {

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
        // return month;
        this.setState({ monthDetails: month });
        console.log(this.state.monthDetails);
    }


    createApiUpdateRequest(editNode: any) {
        // let months = this.createMonthDefinition;
        // this.setState({ monthDetails: months });
        let months = this.state.monthDetails;
        let lineTotal, ppr, cashFlow, expandYear;
        if (typeof (this.props.context.parameters) !== 'undefined') {
            lineTotal = this.props.context.parameters.lineTotal.raw;
            ppr = this.props.context.parameters.ppr.raw;
            cashFlow = this.props.context.parameters.cashFlow.raw;
            expandYear = this.props.context.parameters.expandYear.raw;
        }
        var entity = {};
        entity[lineTotal] = 0;

        // @ts-ignore 
        let ContextId = this.props.context.page.entityId;
        // @ts-ignore 
        let type = this.props.pannelType;
        if (type == "Y") {
            return this.createMonthRequest(editNode, ContextId)
        }
        else {
            for (let Column in editNode) {
                if (months.includes(Column)) {
                    entity[lineTotal] += Number(editNode[Column]);
                    entity[Column] = Number(editNode[Column]);
                }
                else if (Column == ppr) {
                    entity["m360_PPR" + "@odata.bind"] = "/" + "m360_pprs" + "(" + ContextId + ")";
                    // entity[primaryLookupschemaName+"@odata.bind"] = "/"+entitySetName+"(" + ContextId+ ")";
                    // entity["m360_PPR@odata.bind"] = "/m360_pprs(43d2bb09-a779-ea11-a811-000d3a59a6cd)";
                }
                else if (Column == cashFlow) {
                    entity[cashFlow] = editNode[Column];
                }
                else if (Column == expandYear) {
                    entity[expandYear] = this.state.dropDownData;
                    // entity[expandYear] = "555080002";
                }
                else {
                    // let stri
                    // entity[Column] = Number(editNode[Column]);
                }
            }
            entity[lineTotal] = Number(entity[lineTotal]);
            return entity;
        }
    }

    numberTryParse(string) {
        var returnValue = 0;
        if (!isNaN(string) && string != null) {
            returnValue = Number.parseFloat(string);
        }
        return returnValue;
    }


    successCallback() {
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

    setData = (data) => {

        let updatedDatas: any[] = data;
        this.setState({ updatedData: updatedDatas });
    }

    setDropDownData = (data) => {
        debugger;
        let currentYearValue: any = data;
        this.setState({ dropDownData: currentYearValue })
    }

    //------------------------------------------------Year Region-----------------------------------------
    createMonthRequest = (editNode: any, contextId: any) => {
        debugger;
        let months: any[] = [];
        months = this.createMonthDefinitionFromYear();//Define Months
        var entity = {};
        let totalForEach = 0;
        let expandYear, ppr, lineTotal, cashFlow;
        if (typeof (this.props.context.parameters) !== 'undefined') {
            lineTotal = this.props.context.parameters.lineTotal.raw;
            expandYear = this.props.context.parameters.expandYear.raw;
            ppr = this.props.context.parameters.ppr.raw;
            cashFlow = this.props.context.parameters.cashFlow.raw;
        }
        let lineTotalData = editNode[lineTotal];
        if (!isNull(lineTotalData)) {
            var cur = this.convert(lineTotalData);
            if (!isNull(cur)) {
                entity[lineTotal] = cur;
                totalForEach = cur / 12;
            }
        }
        months.map(p => {
            entity[p] = totalForEach;
        })
        for (let Column in editNode) {

            if (Column == ppr) {
                entity["m360_PPR" + "@odata.bind"] = "/" + "m360_pprs" + "(" + contextId + ")";
                //entity[ppr + "@odata.bind"] = "/" + ppr + "(" + contextId + ")";
            }
            else if (Column == expandYear) {
                entity[expandYear] = this.state.dropDownData;
            }
            else if (Column == cashFlow) {
                entity[Column] = editNode[Column];
            }
        }
        entity[lineTotal] = Number(entity[lineTotal]);
        return entity;
    }
    convert = (currency) => {
        var k, temp;
        for (var i = 0; i < currency.length; i++) {

            k = currency.charCodeAt(i);
            if (k > 47 && k < 58) {
                temp = currency.substring(i);
                break;
            }
        }
        temp = temp.replace(/, /, '');
        return parseFloat(temp);
    }
    createMonthDefinitionFromYear = () => {

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
        Object.values(this.props.actualColDef).map(p => {
            let expander: boolean = false;
            switch (p.fieldName) {
                case expandYear:
                case cashFlow:
                case ppr:
                case lineTotal:
                    {
                        break;
                    }
                default:
                    resultData = {
                        field: p.fieldName, header: p.name, expander: expander
                    }
                    cols.push(resultData);
                    month.push(p.fieldName);
                    break;
            }
        });
        return month;
    }

    render() {
        let inputData = {
            columns: this.props.columns,
            context: this.props.context,
            monthDetails: this.props.monthDetails,
            pannelType: this.props.pannelType,
            isViewEditable: this.props.isViewEditable,
            isLoading: this.state.loading
        }
        return (

            <div className="addNewButton">
                <Button label="Add New" disabled={!this.props.isViewEditable} className="addnewBtn" icon="pi pi-external-link" onClick={() => this.onClick('displayBasic2')} iconPos="left" />
                <Dialog position="top" header="Add New Record" visible={this.state.displayBasic2} style={{ width: '96vw' }} onHide={() => this.onHide('displayBasic2')} blockScroll footer={this.renderFooter('displayBasic2')}>
                    <DataTableAddNew setData={this.setData} dropDownData={this.setDropDownData}   {...inputData} />
                </Dialog>
            </div>
        )
    }
}