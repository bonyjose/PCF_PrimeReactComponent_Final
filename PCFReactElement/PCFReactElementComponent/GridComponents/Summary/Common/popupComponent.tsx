
import React, { Component, Props } from 'react';
import { Dialog } from 'primereact/dialog';

import { Button } from 'primereact/button';
import { DataTableAddNew } from '../MonthlySummary/addNewEntryComponent'
type AppProps = {
    test?: any;
}

type AppState = {
    displayBasic: boolean;
    displayBasic2: boolean;
    displayBlockScroll: boolean;
    displayModal: boolean;
    displayMaximizable: boolean;
    displayPosition: boolean;
    position: string;
    updatedData:any[]
}
interface inputData{
    SetData():any,
    data:any[]

}
const data={
    data: [
        {
            "CFName": "Sample", "PPR": "CD1234", "Year": "2020", "Jan": " ",
            "Feb": "", "Mar": "", "April": " ", "Jun": " ","Jul": "", "Aug": "", "Sep": " ", "Oct": " ",
            "Nov": " ","Dec": " ","Total": " "        
        }]
    };
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
            updatedData: []
           
        };
           
    }




    onClick(name: string) {
        debugger;
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
        
        this.setState((prevState) => ({ ...prevState, [`${name}`]: false }))
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
        let updatedDatas: any[] = data;
        this.setState({ updatedData: updatedDatas });
        //this.setState(......)
    }

    render() {
        return (
            <div>


                <div>
 
                    <Button label="AddNew" className="addnewBtn" icon="pi pi-external-link" onClick={() => this.onClick('displayBasic2')} iconPos="left" />

                    <Dialog header="Godfather Casting" visible={this.state.displayBasic2} style={{ width: '90vw' }} onHide={() => this.onHide('displayBasic2')} blockScroll footer={this.renderFooter('displayBasic2')}>
                        <DataTableAddNew  data={data} setData={this.setData} />
                        <label style={{float:"left",color:"#ab9999"}} >CFName*: Cash Flow Item Name</label>
                    </Dialog>

                </div>
            </div>
        )
    }
}