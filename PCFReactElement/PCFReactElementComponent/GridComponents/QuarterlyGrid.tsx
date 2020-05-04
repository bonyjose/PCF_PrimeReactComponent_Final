 import React  from "react";
// import "./CSS/App.css";

// import { Button } from 'primereact/button';
import { Dropdown } from "primereact/dropdown";
// import "./CSS/primereact.min.css";
// import "./CSS/theme.css";
// import "./CSS/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
 
interface Props {}
interface State {
  LayoutType: { label: string; value: string }[];
  SelectedLayout: string;
}
 export class GridQuarterlyComponent extends React.Component {
    products: { Q1: string; Q2: string; Q3: string; Q4: string; }[];
   
    
    constructor(props: Props) {
      super(props);
      this.products = [
        {
          Q1 : "",
          Q2 : "",
          Q3 : "",
          Q4 : ""
        },
        {
            Q1 : "",
            Q2 : "",
            Q3 : "",
            Q4 : ""
        },
        {
            Q1 : "",
            Q2 : "",
            Q3 : "",
            Q4 : ""
        },
        {
            Q1 : "",
            Q2 : "",
            Q3 : "",
            Q4 : ""
        },
        {
            Q1 : "",
            Q2 : "",
            Q3 : "",
            Q4 : ""
        },
        {
            Q1 : "",
          Q2 : "",
          Q3 : "",
          Q4 : ""
        },
        {
            Q1 : "",
            Q2 : "",
            Q3 : "",
            Q4 : ""
        },
      ];
    }
  
    render() {
      return (
        <DataTable
          value={this.products}
          paginator={true}
          rows={5}
          rowsPerPageOptions={[5, 10, 30]}
        >
          <Column field="Q1" header="Quarter1" />
          <Column field="Q2" header="Quarter2" />
          <Column field="Q3" header="Quarter3" />
          <Column field="Q4" header="Quarter4" />
        </DataTable>
      );
    }
  }