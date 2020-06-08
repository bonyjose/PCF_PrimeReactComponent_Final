import React, { Component, Props } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import { CarService } from '../../service/carService';
import { IInputs } from '../../../generated/ManifestTypes';

type AppProps = {
    columns: any[];
    context: ComponentFramework.Context<IInputs>;
    setData :any;
    // data :any
}

type AppState = {
    colDef: any[];
    rowEditedData :[];
    popupColDef : any[]
}

export class DataTableAddNew extends Component<AppProps, AppState> {

    private carservice = new CarService();
    constructor(props: any) {
        super(props);
        this.state = {
            colDef: [],
            rowEditedData :[],
            popupColDef : []
        };


        this.vinEditor = this.vinEditor.bind(this);
        this.yearEditor = this.yearEditor.bind(this);
        this.requiredValidator = this.requiredValidator.bind(this);
    }

    componentDidMount() {
        debugger;
        this.setState({colDef:this.props.columns});
        var jsonArr = [{}];

        for (var i = 0; i < this.props.columns.length; i++) {
            jsonArr[0][this.props.columns[i].field] = "";
        
        }
        console.log(jsonArr);
        this.setState({popupColDef:jsonArr});
    }

    inputTextEditor = (props: any, field: any) => {
        debugger;
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

        let gridEntity: string=this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
        let newNodes = this.state.popupColDef;
        // let editedNode = this.findNodeByKey(newNodes, props.node.key);
        let editedNode = newNodes[0];
       newNodes[0][props.field] = event;
        this.setState({
            popupColDef: newNodes
        });
        debugger;
        let editedField = props.field;

        let childproduct = this.state.popupColDef;
        this.sendData(childproduct);
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
        let month: any[] = [];
        cols = [];
        Object.values(this.state.colDef).map(p => {
            let expander: boolean = false;
            switch (p.field) {
                
                case ppr:
                    resultData = {
                        field: p.field, header: "PPR", expander: expander,isEditable:false
                    }
                    cols.push(resultData);
                    break;
                case lineTotal:
                    resultData = {
                        field: p.field, header: "Total", expander: expander,isEditable:false
                    }
                    cols.push(resultData);
                    break;
                default:
                    resultData = {
                        field: p.field, header: p.field, expander: expander,isEditable:true
                    }
                    cols.push(resultData);
                    month.push(p.fieldName);
                    break;
            }
        });

        debugger;
        return cols;
    }


    findNodeByKey(nodes: any, key: any) {
        debugger;
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
        debugger;

        let value = props.rowData[props.field];
        let isValid =   value.length >0;
        if(isValid)
            {
                return value && value.length > 0;
            }
            else{
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
        debugger;
        var colDefition = this.createColDefinition();

        var colData = this.state.colDef;
        console.log(colDefition);
         colDefition = colDefition.map((col,i) => {
            return <Column key={col.field} field={col.field}  editor={col.isEditable ? this.vinEditor :undefined} header={col.header}   />;  // editorValidator={this.requiredValidator}
        });

     let emptyCell = Array.from("1");
    let fin = Array.from(emptyCell);
        console.log(fin);
        debugger;
        return (
            <div className="gridstyle">

                <div className="content-section implementation">
                    {/* <h3>New Entry</h3> */}
                    <DataTable  editMode="Cell" value={this.state.popupColDef} >
                    {colDefition}
                    
                   </DataTable>
                </div>
            </div>
        );
    }

    sendData = (childproduct :any) => {
        debugger;
       this.props.setData(childproduct);
     }

}