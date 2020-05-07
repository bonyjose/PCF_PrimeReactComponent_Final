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
 
interface Props {
  data: any;
  columns:[];
}
interface State {
  LayoutType: { label: string; value: string }[];
  SelectedLayout: string;
}
 export class GridYearlyComponent extends React.Component {
   clonedProducts: {};
   products: any;
    constructor(props: Props) {
      super(props);
      this.state = {
       
    };
   
    this.products = this.props["columns"];
    debugger;

      this.clonedProducts = {};
      this.vinEditor = this.vinEditor.bind(this);
      this.yearEditor = this.yearEditor.bind(this);
      this.brandEditor = this.brandEditor.bind(this);
      this.colorEditor = this.colorEditor.bind(this);
      this.requiredValidator = this.requiredValidator.bind(this);
    }
  
    render() {
      debugger;
      return (
        <DataTable
          value={this.products}
          paginator={true}
          rows={5}
          editMode ="Cell"
          rowsPerPageOptions={[5, 10, 30]}
        >
          <Column field="name" header="Cash Flow Item Name"  editor={this.vinEditor} editorValidator={this.requiredValidator} style={{height: '3.5em'}}/>
          <Column field="displayName" header="PPR" editor={this.yearEditor} style={{height: '3.5em'}}/>
          <Column field="alias" header="Fiscal year"   editor={this.brandEditor} style={{height: '3.5em'}} />
          <Column field="dataType" header="Line total"   editor={this.brandEditor} style={{height: '3.5em'}} />
        </DataTable>
      );
    }



     /* Cell Editing */
     onEditorValueChange(props, value) {
      let updatedProducts = [...props.value];
      updatedProducts[props.rowIndex][props.field] = value;
      debugger;
      this.setState({products: updatedProducts});
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