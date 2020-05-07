import React  from "react";
// import "./CSS/App.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {InputText} from 'primereact/inputtext';
 
export interface Props {
  data: any;
  columns:[];
}
export interface State {
  SelectedLayout: string;
  products:any;
}
 export class GridYearlyComponent extends React.Component<Props,State> {
   clonedProducts: {};
   
    constructor(props: Props) {
      debugger;
      super(props);
      this.state = {
        products: this.props["columns"],
        SelectedLayout: "Yearly",
    };
   
    // this.setState({products : this.props["columns"]});
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
      let products = this.state.products;
      return (
        <DataTable
          value={products}
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