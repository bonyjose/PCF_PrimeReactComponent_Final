import React, { Component, Props } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { CarService } from '../../service/carService';
import { IInputs } from '../../../generated/ManifestTypes';

type AppProps = {
    columns: any[];
    context: ComponentFramework.Context<IInputs>;
    setData: any;
    monthDetails: any
    pannelType: any,
    isViewEditable:Boolean
}

type AppState = {
    colDef: any[];
    rowEditedData: [];
    popupColDef: any[];
    monthDetails: any;
}

export class DataTableAddNew extends Component<AppProps, AppState> {

    private carservice = new CarService();
    constructor(props: any) {
        super(props);
        this.state = {
            colDef: [],
            rowEditedData: [],
            popupColDef: [],
            monthDetails: []
        };
        this.vinEditor = this.vinEditor.bind(this);
        this.yearEditor = this.yearEditor.bind(this);
        this.requiredValidator = this.requiredValidator.bind(this);
    }

    componentDidMount() {

        this.createMonthDefinition();
        this.setState({ colDef: this.props.columns });
        var jsonArr = [{}];

        for (var i = 0; i < this.props.columns.length; i++) {
            jsonArr[0][this.props.columns[i].field] = "";

        }
        console.log(jsonArr);
        this.setState({ popupColDef: jsonArr });
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
        debugger;
        let gridEntity: string = this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
        let newNodes = this.state.popupColDef;
        let expandYear, ppr, lineTotal, cashFlow;
        if (typeof (this.props.context.parameters) !== 'undefined') {
            expandYear = this.props.context.parameters.expandYear.raw;
            ppr = this.props.context.parameters.ppr.raw;
            lineTotal = this.props.context.parameters.lineTotal.raw;
            cashFlow = this.props.context.parameters.cashFlow.raw;
        }
        // let editedNode = this.findNodeByKey(newNodes, props.node.key);
        let editedNode = newNodes[0];
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
                newNode = this.parseQuartertoMonth(newNodes);
            }
            else {
                newNode = newNodes;
            }
        }

        this.setState({
            popupColDef: newNodes
        });
        let editedField = props.field;
        let childproduct = this.state.popupColDef;
        this.sendData(childproduct);
    }
    parseQuartertoMonth(newNodes: any) {
        let January, February, March, April, May, June, July, August, September, October, November, December;
        if (typeof (this.props.context.parameters) !== 'undefined') {
            January = this.props.context.parameters.January.raw;
            February = this.props.context.parameters.February.raw;
            March = this.props.context.parameters.March.raw;
            April = this.props.context.parameters.April.raw;
            May = this.props.context.parameters.May.raw;
            June = this.props.context.parameters.June.raw;
            July = this.props.context.parameters.July.raw;
            August = this.props.context.parameters.August.raw;
            September = this.props.context.parameters.September.raw;
            October = this.props.context.parameters.October.raw;
            November = this.props.context.parameters.November.raw;
            December = this.props.context.parameters.December.raw;
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
        console.log(this.state.monthDetails);
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
        // let expandYear=this.context.parameters.expandYear.raw.toString()!=null?this.context.parameters.expandYear.raw.toString():"FinacialYear";

        let resultData = {};
        let cols: any[];
        let month: any[] = this.props.monthDetails;
        cols = [];
        Object.values(this.state.colDef).map(p => {
            let expander: boolean = false;
            switch (p.field) {
                case expandYear:
                    resultData = {
                        field: p.field, header: "Year", expander: true, isEditable: this.props.isViewEditable
                    }
                    cols.push(resultData);
                    break;
                case cashFlow:
                    resultData = {
                        field: p.field, header: "Cash Flow", expander: expander, isEditable: this.props.isViewEditable
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
                        field: p.field, header: "Total", expander: expander, isEditable: isVisible
                    }
                    cols.push(resultData);
                    break;
                default:
                    resultData = {
                        field: p.field, header: p.header, expander: expander, isEditable: this.props.isViewEditable
                    }
                    cols.push(resultData);
                    month.push(p.fieldName);
                    break;
            }
        });
        return cols;
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
        let isValid = value.length > 0;
        if (isValid) {
            return value && value.length > 0;
        }
        else {
            alert("Cells cannot be empty");
            return value;
        }

    }

    // requiredValidator(props) {
    //     let isValid = this.state.updatedData && this.state.updatedData.length > 0;
    //     if (isValid){
    //       //update data
    //       let updatedDataSet = [...this.state.dataSet];
    //       updatedDataSet[props.rowIndex][props.field] = this.state.updatedData;
    //       this.setState({dataSet: updatedDataSet, updatedData: ""});
    //     } else {
    //       //show error message
    //       alert("Validation failed.")
    //     }
    //     return isValid;
    //   }

    render() {

        var colDefition = this.createColDefinition();


        var colData = this.state.colDef;
        console.log(colDefition);
        colDefition = colDefition.map((col, i) => {
            return <Column key={col.field} field={col.field} editor={col.isEditable ? this.vinEditor : undefined} header={col.header} />;  // editorValidator={this.requiredValidator}
        });

        let emptyCell = Array.from("1");
        let fin = Array.from(emptyCell);
        console.log(fin);

        return (
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
        );
    }

    sendData = (childproduct: any) => {
        this.props.setData(childproduct);
    }

}