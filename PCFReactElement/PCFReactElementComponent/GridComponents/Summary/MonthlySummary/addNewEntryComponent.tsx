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
    // data :any
}

type AppState = {
    colDef: any[];
    rowEditedData :[]
}

export class DataTableAddNew extends Component<AppProps, AppState> {

    private carservice = new CarService();
    constructor(props: any) {
        super(props);
        this.state = {
            colDef: [],
            rowEditedData :[]
        };


        this.vinEditor = this.vinEditor.bind(this);
        this.yearEditor = this.yearEditor.bind(this);
        this.requiredValidator = this.requiredValidator.bind(this);
    }

    componentDidMount() {
        this.setState({colDef:this.props.columns})
    }

    inputTextEditor(props: any, field: any) {

        return <InputText type="text" value={props.rowData[field]} onChange={(
            ev: React.ChangeEvent<HTMLInputElement>): void => {
            this.onEditorValueChange
                (props, ev.target.value.toString())
        }} />;
    }
    /* Cell Editing */
    onEditorValueChange(props: any, event) {
        debugger;

        let gridEntity: string=this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
        let newNodes = JSON.parse(JSON.stringify(this.state.colDef));

        var entity = {};
        entity[props["header"]] = event;
        var rowEdited = Array();
        rowEdited = entity as any;
        // rowEdited.push(props.node.nodeKey);

        var newStateArray = Array();
        newStateArray = this.state.rowEditedData;
        newStateArray.push(rowEdited);
        console.log(newStateArray);

        this.setState({ rowEditedData: newStateArray as any })

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


    vinEditor(props: any) {

        let field = props.rowData[props.field]
        return this.inputTextEditor(props, field);
    }

    yearEditor(props: any) {

        return this.inputTextEditor(props, 'year');
    }
    requiredValidator(props: any) {

        let value = props.rowData[props.field];
        return value && value.length > 0;
    }

    render() {
        debugger;
        var colDefition = this.state.colDef;
         colDefition = colDefition.map((col,i) => {
            return <Column key={col.field} field={col.field}  editor={this.vinEditor} header={col.header} />;
        });
        // let colData :any [] = this.state.colDef;
        // let cols: any[];
        // cols = [];
        // let resultData : any[];
        // resultData =[];
        // for (let i = 0; i < colData.length; i++) 
        // {
        //     let data = Object.values(colData);
        //     let childrenData = {
        //         [data[i].field] : ""
        // }
        // cols.push(childrenData);
        // resultData = Object.values((cols));
        // // console.log(resultData)
        // }
        // for(let i=0;i<cols.length;i++)
        // {
        //     resultData.push(cols[i])
        // }


     let emptyCell = Array.from("1");
    let fin = Array.from(emptyCell);
        console.log(fin);
        debugger;
        return (
            <div className="gridstyle">

                <div className="content-section implementation">
                    {/* <h3>New Entry</h3> */}
                    <DataTable  editMode="Cell" value={emptyCell} >
                    {colDefition}
                    
                   </DataTable>
                </div>
            </div>
        );
    }
}