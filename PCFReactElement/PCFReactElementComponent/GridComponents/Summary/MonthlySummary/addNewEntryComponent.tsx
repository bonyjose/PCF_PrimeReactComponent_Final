import React, { Component, Props } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import { CarService } from '../../service/carService';

type AppProps = {
    data?: any;
    setData? :any
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
        this.setState({cars1:this.props.data.data})
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
        // this.props.setData(updatedCars)
        this.setState({ cars1: updatedCars });
        this.props.setData(this.state.cars1);
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
                    {/* <h3>New Entry</h3> */}
                    <DataTable  editMode="Cell" value={this.state.cars1}>
                        <Column field="CFNAME" header="CFName*" editor={this.vinEditor}  editorValidator={this.requiredValidator} style={{ height: '3.5em' }} />
                        <Column field="PPR" header="PPR"  editor={this.vinEditor}  style={{ height: '3.5em' }} />
                        <Column field="FinacialYear" header="Finacial Year"  editor={this.vinEditor}  style={{ height: '3.5em' }} />
                        <Column field="January" header="Jan" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="February" header="Feb" editor={this.vinEditor} editorValidator={this.requiredValidator} style={{ height: '3.5em' }} />
                        <Column field="March" header="Mar" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="April" header="April" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="May" header="May" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="June" header="Jun" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="July" header="Jul" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="August" header="Aug" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="September" header="Sep" editor={this.vinEditor} editorValidator={this.requiredValidator} style={{ height: '3.5em' }} />
                        <Column field="October" header="Oct" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="November" header="Nov" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="December" header="Dec" editor={this.vinEditor} style={{ height: '3.5em' }} />      
                        <Column field="LineTotal" header="LineTotal" editor={this.vinEditor} style={{ height: '3.5em' }} />              
                   </DataTable>
                </div>
            </div>
        );
    }
}