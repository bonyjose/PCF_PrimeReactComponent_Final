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

        // let gridEntity: string=this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
        // let newNodes = JSON.parse(JSON.stringify(this.state.colDef));

        // var entity = {};
        // entity[props["header"]] = event;
        // var rowEdited = Array();
        // rowEdited = entity as any;
        // // rowEdited.push(props.node.nodeKey);

        // var newStateArray = Array();
        // newStateArray = this.state.rowEditedData;
        // newStateArray.push(rowEdited);
        // console.log(newStateArray);

        // this.setState({ rowEditedData: newStateArray as any })

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
        // let editedObject = this.createApiUpdateRequest(editedNode.data,editedField);

        // this.setState({
        //     rowEditedData: newNodes
        // });


        // let editedNode = this.findNodeByKey(newNodes, props.node.key);
        // editedNode.data[props.field] = event.target.value;
        // this.setState({
        //     nodes: newNodes
        // });

        // let editedField = props.field;
        // let editedObject = this.createApiUpdateRequest(editedNode.data,editedField);
        // let updatedCars: [] = [...props.value];
        // updatedCars[props.rowIndex][props.field] = event;
        // console.log(typeof (updatedCars), typeof (this.state.colDef))
        // // this.props.setData(updatedCars)
        // this.setState({ colDef : updatedCars });
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
        var colDefition = this.state.colDef;

        var colData = this.state.colDef;
        console.log(colDefition);
         colDefition = colDefition.map((col,i) => {
            return <Column key={col.field} field={col.field}  editor={this.vinEditor} header={col.header}   />;  // editorValidator={this.requiredValidator}
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