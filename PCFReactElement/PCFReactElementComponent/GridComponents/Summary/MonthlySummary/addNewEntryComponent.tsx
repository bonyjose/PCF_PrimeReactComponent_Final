import React, { Component, Props } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import { CarService } from '../../service/carService';

type AppProps = {
    test?: any;
}

type AppState = {
    cars1: any[]
}

export class DataTableAddNew extends Component<AppProps, AppState> {

    private carservice = new CarService();
    constructor(props: any) {
        super(props);
        this.state = {
            cars1: []
        };


        this.vinEditor = this.vinEditor.bind(this);
        this.yearEditor = this.yearEditor.bind(this);
        this.requiredValidator = this.requiredValidator.bind(this);
    }

    componentDidMount() {
        this.carservice.getCarsSmall().then((data: any) => this.setState({ cars1: data }));
    }

    inputTextEditor(props: any, field: any) {

        return <InputText type="text" value={props.rowData[field]} onChange={(
            ev: React.ChangeEvent<HTMLInputElement>): void => {
            this.onEditorValueChange
                (props, ev.target.value.toString())
        }} />;
    }
    /* Cell Editing */
    onEditorValueChange(props: any, event: any) {
        debugger;
        let updatedCars: any[] = [...props.value];
        updatedCars[props.rowIndex][props.field] = event;
        console.log(typeof (updatedCars), typeof (this.state.cars1))

        this.setState({ cars1: updatedCars });

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
        return (
            <div className="gridstyle">

                <div className="content-section implementation">
                    <h3>New Entry</h3>
                    <DataTable  editMode="Cell" value={this.state.cars1}>
                        <Column field="CFName" header="CFName*" editor={this.vinEditor} editorValidator={this.requiredValidator} style={{ height: '3.5em' }} />
                        <Column field="PPR" header="PPR" editor={this.yearEditor} style={{ height: '3.5em' }} />
                        <Column field="Year" header="Finacial Year" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Jan" header="Jan" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Feb" header="Feb" editor={this.vinEditor} editorValidator={this.requiredValidator} style={{ height: '3.5em' }} />
                        <Column field="Mar" header="Mar" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="April" header="April" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="May" header="May" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Jun" header="Jun" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Jul" header="Jul" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Aug" header="Aug" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Sep" header="Sep" editor={this.vinEditor} editorValidator={this.requiredValidator} style={{ height: '3.5em' }} />
                        <Column field="Oct" header="Oct" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Nov" header="Nov" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Dec" header="Dec" editor={this.vinEditor} style={{ height: '3.5em' }} />                  
                   </DataTable>
                </div>
            </div>
        );
    }
}