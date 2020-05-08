import React from "react";
// import "./CSS/App.css";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export interface Props {
  data: any;
  columns: [];
}
export interface State {
  SelectedLayout: string;
  products: any;
}
export class GridMonthlyComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    debugger;
    this.state = {
      products: this.props["columns"],
      SelectedLayout: "Monthly",
    };

    debugger;
    this.janEdit = this.janEdit.bind(this);
    this.febEdit = this.febEdit.bind(this);
    this.marEdit = this.marEdit.bind(this);
    this.aprEdit = this.aprEdit.bind(this);
    this.mayEdit = this.mayEdit.bind(this);
    this.junEdit = this.junEdit.bind(this);
    this.julEdit = this.julEdit.bind(this);
    this.augEdit = this.augEdit.bind(this);
    this.sepEdit = this.sepEdit.bind(this);
    this.octEdit = this.octEdit.bind(this);
    this.novEdit = this.novEdit.bind(this);
    this.decEdit = this.decEdit.bind(this);
    this.cashFlowEdit = this.cashFlowEdit.bind(this);
    this.PPREdit = this.PPREdit.bind(this);
    this.fiscalEdit = this.fiscalEdit.bind(this);
    this.lineEdit = this.lineEdit.bind(this);
    this.requiredValidator = this.requiredValidator.bind(this);
  }

  componentDidUpdate() {
    debugger;
    if (this.state.products !== this.props["columns"]) 
    {
      this.setState({products: this.props["columns"]});
      // this.render();
  }
 }



  render() {
    debugger;
    let products =this.state.products;
    return (
      <DataTable
        value={products}
        paginator={true}
        rows={5}
        rowsPerPageOptions={[5, 10, 30]}
      >
        <Column
          field="name"
          header="Cash Flow Item Name"
          editor={this.cashFlowEdit}
          editorValidator={this.requiredValidator}
          style={{ height: "3.5em" }}
        />
        <Column
          field="displayName"
          header="PPR"
          editor={this.PPREdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="alias"
          header="Fiscal year"
          editor={this.fiscalEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="Jan"
          editor={this.janEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="Feb"
          editor={this.febEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="March"
          editor={this.marEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="April"
          editor={this.aprEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="May"
          editor={this.mayEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="June"
          editor={this.junEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="July"
          editor={this.julEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="August"
          editor={this.augEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="September"
          editor={this.sepEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="October"
          editor={this.octEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="November"
          editor={this.novEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="December"
          editor={this.decEdit}
          style={{ height: "3.5em" }}
        />
        <Column
          field="name"
          header="Line total"
          editor={this.lineEdit}
          style={{ height: "3.5em" }}
        />
      </DataTable>
    );
  }

  /* Cell Editing */
  onEditorValueChange(props, value) {
    let updatedProducts = [...props.value];
    updatedProducts[props.rowIndex][props.field] = value;
    debugger;
    this.setState({ products: updatedProducts });
  }

  inputTextEditor(props, field) {
    return (
      <InputText
        type="text"
        value={props.rowData[field]}
        onChange={(e) => this.onEditorValueChange(props, e.currentTarget.value)}
      />
    );
  }

  cashFlowEdit(props) {
    return this.inputTextEditor(props, "name");
  }

  PPREdit(props) {
    return this.inputTextEditor(props, "name");
  }

  fiscalEdit(props) {
    return this.inputTextEditor(props, "price");
  }

  janEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  febEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  marEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  aprEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  mayEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  junEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  julEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  augEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  sepEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  octEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  novEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  decEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  lineEdit(props) {
    return this.inputTextEditor(props, "place");
  }

  requiredValidator(props) {
    let value = props.rowData[props.field];
    return value && value.length > 0;
  }
}
