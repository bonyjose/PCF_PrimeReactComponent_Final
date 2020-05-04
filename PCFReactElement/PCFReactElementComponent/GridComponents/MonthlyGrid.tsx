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
 export class GridMonthlyComponent extends React.Component {
    products: { Jan: string; Feb: string; Mar: string; Apr: string; May: string; Jun: string; Jul: string; Aug: string; Sep: string; Oct: string; Nov: string; Dec: string; }[];
    
    constructor(props: Props) {
      super(props);
      this.products = [
        {
          Jan: "",
          Feb: "",
          Mar: "",
          Apr: "",
          May :"",
          Jun :"",
          Jul:"",
          Aug:"",
          Sep:"",
          Oct:"",
          Nov:"",
          Dec: ""
        },
        {
            Jan: "",
            Feb: "",
            Mar: "",
            Apr: "",
            May :"",
            Jun :"",
            Jul:"",
            Aug:"",
            Sep:"",
            Oct:"",
            Nov:"",
            Dec: ""
        },
        {
            Jan: "",
            Feb: "",
            Mar: "",
            Apr: "",
            May :"",
            Jun :"",
            Jul:"",
            Aug:"",
            Sep:"",
            Oct:"",
            Nov:"",
            Dec: ""
        },
        {
            Jan: "",
            Feb: "",
            Mar: "",
            Apr: "",
            May :"",
            Jun :"",
            Jul:"",
            Aug:"",
            Sep:"",
            Oct:"",
            Nov:"",
            Dec: ""
        },
        {
            Jan: "",
            Feb: "",
            Mar: "",
            Apr: "",
            May :"",
            Jun :"",
            Jul:"",
            Aug:"",
            Sep:"",
            Oct:"",
            Nov:"",
            Dec: ""
        },
        {
            Jan: "",
            Feb: "",
            Mar: "",
            Apr: "",
            May :"",
            Jun :"",
            Jul:"",
            Aug:"",
            Sep:"",
            Oct:"",
            Nov:"",
            Dec: ""
        },
        {
            Jan: "",
            Feb: "",
            Mar: "",
            Apr: "",
            May :"",
            Jun :"",
            Jul:"",
            Aug:"",
            Sep:"",
            Oct:"",
            Nov:"",
            Dec: ""
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
          <Column field="Jan" header="Jan" />
          <Column field="Feb" header="Feb" />
          <Column field="Mar" header="March" />
          <Column field="Apr" header="April" />
          <Column field="May" header="May" />
          <Column field="Jun" header="June" />
          <Column field="Jul" header="July" />
          <Column field="Aug" header="August" />
          <Column field="Sep" header="September" />
          <Column field="Oct" header="October" />
          <Column field="Nov" header="November" />
          <Column field="Dec" header="December" />
        </DataTable>
      );
    }
  }
