import React, { Component, Props } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { IInputs } from '../../../generated/ManifestTypes';
import LoadingOverlay from 'react-loading-overlay';
type AppProps = {
    columns: any[];
    context: ComponentFramework.Context<IInputs>;
    setData: any;
    monthDetails: any
    pannelType: any,
    dropDownData: any;
    isViewEditable: Boolean,
    isLoading: Boolean
}

type AppState = {
    colDef: any[];
    rowEditedData: [];
    popupColDef: any[];
    monthDetails: any;
    currentYear: string;
    yearData: any[];
}

export class DataTableAddNew extends Component<AppProps, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            colDef: [],
            rowEditedData: [],
            popupColDef: [],
            monthDetails: [],
            currentYear: "",
            yearData: []
        };
        this.vinEditor = this.vinEditor.bind(this);
        this.yearEditor = this.yearEditor.bind(this);
        this.requiredValidator = this.requiredValidator.bind(this);
        this.editorDropdown = this.editorDropdown.bind(this);
        this.DropdownEditor = this.DropdownEditor.bind(this);
    }

    componentDidMount() {

        this.createMonthDefinition();
        this.setState({ colDef: this.props.columns });
        var jsonArr = [{}];

        for (var i = 0; i < this.props.columns.length; i++) {
            jsonArr[0][this.props.columns[i].field] = "";

        }

        var yeardata = this.createDropDownDef();
        this.setState({ popupColDef: jsonArr, yearData: yeardata });
        // @ts-ignore 
        this.setState({ currentYear: yeardata[0].currentYear })

    }
    inputTextEditor = (props: any, field: any) => {

        return <InputText type="text" value={props.value[0][field]}

            onChange={(
                ev: React.ChangeEvent<HTMLInputElement>): void => {
                this.onEditorValueChange
                    (props, ev.target.value.toString())
            }} />;
    }
    /* Cell Editing */
    onEditorValueChange(props: any, event) {
        let gridEntity: string = this.props.context.parameters.cashFlowDataSet.getTargetEntityType().toString();
        let newNodes = this.state.popupColDef;
        let expandYear, ppr, lineTotal, cashFlow;
        if (typeof (this.props.context.parameters) !== 'undefined') {
            expandYear = this.props.context.parameters.expandYear.raw;
            ppr = this.props.context.parameters.ppr.raw;
            lineTotal = this.props.context.parameters.lineTotal.raw;
            cashFlow = this.props.context.parameters.cashFlow.raw;
        }
        let editedNode = newNodes[0];
        if (this.props.pannelType === "Q") {
            if (props.field == "Q1" || props.field == "Q2" || props.field == "Q3" || props.field == "Q4") {
                event = parseInt(event) ? parseInt(event) : '';
            }
        }
        else if (this.props.pannelType === "M") {
            let months = this.state.monthDetails;
            if (months.includes(props.field)) {
                event = parseInt(event) ? parseInt(event) : '';
            }
        }
        else if (this.props.pannelType === "Y") {
            if (lineTotal == props.field) {
                event = parseInt(event) ? parseInt(event) : '';
            }
        }
        newNodes[0][props.field] = event;
        if (this.props.pannelType === "Q") {
            let months = this.state.monthDetails;
            let Total = 0;
            for (let Column in newNodes[0]) {

                if (months.includes(Column)) {

                    Total += this.numberTryParse(newNodes[0][Column]);
                }
            }
            newNodes[0][lineTotal] = Total;
            let newNode: any;

            if (typeof (newNodes[0].Q1) !== 'undefined') {
                newNodes = this.parseQuartertoMonth(newNodes);
            }
            else {
                newNodes = newNodes;
            }
        }

        if (this.props.pannelType === "M") {
            let months = this.state.monthDetails;
            let Total = 0;
            for (let Column in newNodes[0]) {

                if (months.includes(Column)) {

                    Total += this.numberTryParse(newNodes[0][Column]);
                }
            }
            newNodes[0][lineTotal] = Total;
        }

        this.setState({
            popupColDef: newNodes
        });
        let childproduct = this.state.popupColDef;
        this.sendData(childproduct);
    }
    parseQuartertoMonth(newNodes: any) {
        let January, February, March, April, May, June, July, August, September, October, November, December;
        for (let columns of this.props.columns) {

            if (columns.fieldName == "January") {
                January = columns.key;
            }
            else if (columns.fieldName == "February") {
                February = columns.key;
            }
            else if (columns.fieldName == "March") {
                March = columns.key;
            }
            else if (columns.fieldName == "April") {
                April = columns.key;
            }
            else if (columns.fieldName == "May") {
                May = columns.key;
            }
            else if (columns.fieldName == "June") {
                June = columns.key;
            }
            else if (columns.fieldName == "July") {
                July = columns.key;
            }
            else if (columns.fieldName == "August") {
                August = columns.key;
            }
            else if (columns.fieldName == "September") {
                September = columns.key;
            }
            else if (columns.fieldName == "October") {
                October = columns.key;
            }
            else if (columns.fieldName == "November") {
                November = columns.key;
            }
            else if (columns.fieldName == "December") {
                December = columns.key;
            }

        }
        newNodes[0][January] = this.numberTryParse(newNodes[0].Q1 / 3).toFixed(2);
        newNodes[0][February] = this.numberTryParse(newNodes[0].Q1 / 3).toFixed(2);
        newNodes[0][March] = this.numberTryParse(newNodes[0].Q1 / 3).toFixed(2);
        newNodes[0][April] = this.numberTryParse(newNodes[0].Q2 / 3).toFixed(2);
        newNodes[0][May] = this.numberTryParse(newNodes[0].Q2 / 3).toFixed(2);
        newNodes[0][June] = this.numberTryParse(newNodes[0].Q2 / 3).toFixed(2);
        newNodes[0][July] = this.numberTryParse(newNodes[0].Q3 / 3).toFixed(2);
        newNodes[0][August] = this.numberTryParse(newNodes[0].Q3 / 3).toFixed(2);
        newNodes[0][September] = this.numberTryParse(newNodes[0].Q3 / 3).toFixed(2);
        newNodes[0][October] = this.numberTryParse(newNodes[0].Q4 / 3).toFixed(2);
        newNodes[0][November] = this.numberTryParse(newNodes[0].Q4 / 3).toFixed(2);
        newNodes[0][December] = this.numberTryParse(newNodes[0].Q4 / 3).toFixed(2);


        return newNodes;
    }


    numberTryParse(string) {
        var returnValue = 0;
        if (!isNaN(string) && string != null && string != "") {
            returnValue = Number.parseFloat(string);
        }
        return returnValue;
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
        this.setState({ monthDetails: month });
    }

    createColDefinition = () => {
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
        let month: any[] = this.props.monthDetails;
        cols = [];
        Object.values(this.state.colDef).map(p => {
            let expander: boolean = false;
            switch (p.field) {
                case expandYear:
                    resultData = {
                        field: p.field, header: "Year", expander: true, isEditable: false, IsDropdDown: true
                    }
                    cols.push(resultData);
                    break;
                case cashFlow:
                    resultData = {
                        field: p.field, header: "Cash Flow", expander: expander, isEditable: this.props.isViewEditable, IsDropdDown: false
                    }
                    cols.push(resultData);
                    break;
                case ppr:
                    break;
                case lineTotal:
                    var isVisible: Boolean = false
                    if (this.props.pannelType === 'Y' && this.props.isViewEditable) {
                        isVisible = true;
                    }
                    resultData = {
                        field: p.field, header: "Total", expander: expander, isEditable: isVisible, IsDropdDown: false
                    }
                    cols.push(resultData);
                    break;
                default:
                    resultData = {
                        field: p.field, header: p.header, expander: expander, isEditable: this.props.isViewEditable, IsDropdDown: false
                    }
                    cols.push(resultData);
                    month.push(p.fieldName);
                    break;
            }
        });
        return cols;
    }

    createDropDownDef() {
        let gridEntity: string = this.props.context.parameters.cashFlowDataSet.getTargetEntityType().toString();
        let expandYear = this.props.context.parameters.expandYear.raw;
        var yearData;
        var req1 = new XMLHttpRequest();
        // @ts-ignore 
        req1.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.0/EntityDefinitions(LogicalName='" + gridEntity + "')/Attributes(LogicalName='" + expandYear + "')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options)", false);
        req1.setRequestHeader("OData-MaxVersion", "4.0");
        req1.setRequestHeader("OData-Version", "4.0");
        req1.setRequestHeader("Accept", "application/json");
        req1.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req1.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req1.onreadystatechange = function () {
            if (req1.readyState === 4) {
                req1.onreadystatechange = null;
                if (req1.status === 200) {
                    var resultdata = JSON.parse(req1.response);
                    yearData = resultdata;
                }
            };
            req1.send();
        }
        req1.send();
        yearData = JSON.parse(req1.response).OptionSet.Options;
        let yearDropdownDef = [];

        try {
            if ((yearData != null) && (yearData != "") && (yearData != "undefined")) {
                for (let option of yearData) {
                    let optionitem = {};
                    // @ts-ignore 
                    optionitem.Value = option!.Value;
                    // @ts-ignore 
                    optionitem.Text = option!.Label.UserLocalizedLabel.Label;
                    // @ts-ignore 
                    yearDropdownDef.push(optionitem);
                }
            }
        }
        catch {
        }
        return yearDropdownDef;
    }

    findNodeByKey(nodes: any, key: any) {

        let path = key.split('-');
        let node;

        while (path.length) {
            let list = node ? node.children : nodes;
            node = list[parseInt(path[0], 10)];
            path.shift();
        }

        return node;
    }
    vinEditor(props: any) {
        let field = props.field
        return this.inputTextEditor(props, field);
    }

    yearEditor(props: any) {

        return this.inputTextEditor(props, 'year');
    }
    requiredValidator(props: any) {
        let value = props.rowData[props.field];
        value.replace(/\+|-/ig, '');
        let isValid = value.length > 0;
        if (isValid) {
            return value && value.length > 0;
        }
        else {
            props.style = { 'Color': 'Red' }
            return value;
        }

    }

    handleChange = (props: any, e: any) => {
        var jsonArr = this.state.popupColDef;
        jsonArr[0][this.props.columns[0].field] = e.Text;
        // @ts-ignore 
        this.setState({ popupColDef: jsonArr, currentYear: e.Text });
        this.props.dropDownData(e.Value);
        let childproduct = jsonArr;
        this.sendData(childproduct);
    }
    editorDropdown = (props: any) => {
        let field = props.field
        return this.DropdownEditor(props, field);
    }

    DropdownEditor = (props: any, field: any) => {
        let currentYear = this.state.yearData[0].Text;
        return <Dropdown value={currentYear}
            onChange={(e) => { this.handleChange(props, e.value) }}
            options={this.state.yearData}
            placeholder="Year" optionLabel="Text" style={{ width: '8em' }} />
    }

    render() {

        var colDefition = this.createColDefinition();

        var colData = this.state.colDef;
        colDefition = colDefition.map((col, i) => {
            return <Column key={col.field} field={col.field} editor={col.isEditable ? this.vinEditor : (col.IsDropdDown ? this.editorDropdown : undefined)} header={col.header} className={col.IsDropdDown ? "dropColumn" : "normalColumn"} />;  // editorValidator={this.requiredValidator}
        });

        return (
            <LoadingOverlay
                active={this.props.isLoading}
                spinner>
                <div className="addnew gridstyle">
                    <Panel>
                        <div className="content-section implementation">
                            {/* <h3>New Entry</h3> */}
                            <DataTable editMode="Cell" value={this.state.popupColDef} >
                                {colDefition}

                            </DataTable>
                        </div>
                    </Panel>

                </div>
            </LoadingOverlay>
        );
    }

    sendData = (childproduct: any) => {
        this.props.setData(childproduct);
    }

}