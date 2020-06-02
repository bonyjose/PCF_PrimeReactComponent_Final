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
}

type AppState = {
    colDef: any[]
}

export class DataTableAddNew extends Component<AppProps, AppState> {

    private carservice = new CarService();
    constructor(props: any) {
        super(props);
        this.state = {
            colDef: []
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
    onEditorValueChange(props: [], event) {
        debugger;
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
            return <Column key={col.field} field={col.field} header={col.header} />;
        });
        let colData :any [] = this.state.colDef;
        let cols: any[];
        cols = [];
        let resultData : any[];
        resultData =[];
        for (let i = 0; i < colData.length; i++) 
        {
            let data = Object.values(colData);
            let childrenData = {
                [data[i].field] : ""
        }
        cols.push(childrenData);
        resultData = Object.values((cols));
        console.log(resultData)
        }
        debugger;
        return (
            <div className="gridstyle">

                <div className="content-section implementation">
                    {/* <h3>New Entry</h3> */}
                    <DataTable  editMode="Cell" value={resultData} >
                    {colDefition}
                    
                   </DataTable>
                </div>
            </div>
        );
    }
}