
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
            position: 'center'
        };
        // this.onClick = this.onClick.bind(this);
        // this.onHide = this.onHide.bind(this);
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

    renderFooter(name: string) {
        return (
            <div>
                <Button label="Save" icon="pi pi-check" onClick={() => this.onHide(name)} />
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-secondary" />
            </div>
        );
    }

    render() {
        return (
            <div>


                <div>
 
                    <Button label="AddNew" className="addnewBtn" icon="pi pi-external-link" onClick={() => this.onClick('displayBasic2')} iconPos="left" />

                    <Dialog header="Godfather Casting" visible={this.state.displayBasic2} style={{ width: '90vw' }} onHide={() => this.onHide('displayBasic2')} blockScroll footer={this.renderFooter('displayBasic2')}>
                        <DataTableAddNew />
                        <label style={{float:"left",color:"#ab9999"}} >CFName*: Cash Flow Item Name</label>
                    </Dialog>

                </div>
            </div>
        )
    }
}