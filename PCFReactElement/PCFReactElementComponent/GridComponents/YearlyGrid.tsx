import React  from "react";
// import "./CSS/App.css";

// import { Button } from 'primereact/button';
import { Dropdown } from "primereact/dropdown";
// import "./CSS/primereact.min.css";
// import "./CSS/theme.css";
// import "./CSS/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {InputText} from 'primereact/inputtext';
 
interface Props {}
interface State {
  LayoutType: { label: string; value: string }[];
  SelectedLayout: string;
}
 export class GridYearlyComponent extends React.Component {
   clonedCars: {};
   products: { id: string; name: string; place: string; price: string; }[];
    constructor(props: Props) {
      super(props);
      this.state = {
       
    };
    this.products = [
      {
        id: "1",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "2",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "3",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "4",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "5",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "6",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "7",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
    ]
     


      this.clonedCars = {};

      this.vinEditor = this.vinEditor.bind(this);
      this.yearEditor = this.yearEditor.bind(this);
      this.brandEditor = this.brandEditor.bind(this);
      this.colorEditor = this.colorEditor.bind(this);
      this.requiredValidator = this.requiredValidator.bind(this);
    }
  
    render() {
      return (
        <DataTable
          value={this.products}
          paginator={true}
          rows={5}
          editMode ="Cell"
          rowsPerPageOptions={[5, 10, 30]}
        >
          <Column field="id" header="ID"  editor={this.vinEditor} editorValidator={this.requiredValidator} style={{height: '3.5em'}}/>
          <Column field="name" header="Name" editor={this.yearEditor} style={{height: '3.5em'}}/>
          <Column field="Price" header="Price"   editor={this.brandEditor} style={{height: '3.5em'}} />
          <Column field="place" header="place"  editor={this.colorEditor} style={{height: '3.5em'}} />
        </DataTable>
      );
    }



     /* Cell Editing */
     onEditorValueChange(props, value) {
      let updatedCars = [...props.value];
      updatedCars[props.rowIndex][props.field] = value;
      this.setState({cars1: updatedCars});
  }

  inputTextEditor(props, field) {
      return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.currentTarget.value)} />;
  }

  vinEditor(props) {
      return this.inputTextEditor(props, 'id');
  }

  yearEditor(props) {
      return this.inputTextEditor(props, 'name');
  }

  brandEditor(props) {
    return this.inputTextEditor(props, 'price');
  }

  colorEditor(props) {
      return this.inputTextEditor(props, 'place');
  }

  requiredValidator(props) {
      let value = props.rowData[props.field];
      return value && value.length > 0;
  }
  }