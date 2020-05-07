import React from "react";
// import "./CSS/App.css";

// import { Button } from 'primereact/button';
import { Dropdown } from "primereact/dropdown";
// import "./CSS/primereact.min.css";
// import "./CSS/theme.css";
// import "./CSS/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {GridQuarterlyComponent} from './GridComponents/QuarterlyGrid'
import{ GridMonthlyComponent} from './GridComponents/MonthlyGrid'
import{ GridYearlyComponent} from './GridComponents/YearlyGrid'

export interface Props {
  data: any;
  columns:[];
}
export interface State {
  LayoutType: { label: string; value: string }[];
  SelectedLayout: string;
}

export class App extends React.Component<Props, State> {
  products: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      LayoutType: [
        { label: "Yearly", value: "Yearly" },
        { label: "Monthly", value: "Monthly" },
        { label: "Quarterly", value: "Quarterly" },
      ],
      SelectedLayout: "Yearly",
    };
    this.products = props.data;
    this.handleChange = this.handleChange.bind(this);
  }

 

  handleChange(e: { originalEvent: Event; value: any }) {
    this.setState({ SelectedLayout: e.value });
    debugger;
  }

  public render() {
    debugger;
    const SelectedLayout = this.state.SelectedLayout;
    let DataTable;
    if (SelectedLayout == "Yearly")
    {
      DataTable = <GridYearlyComponent {...this.products}/>;
    } 
    else if (SelectedLayout == "Monthly")
    {
      DataTable = <GridMonthlyComponent {...this.products}/>;
    }
    else if (SelectedLayout == "Quarterly")
    {
      DataTable = <GridQuarterlyComponent/>;
    }


    return (
      <div className="App">
        <label htmlFor="LayoutType"> Layout Type </label>
        <Dropdown
          value={this.state.SelectedLayout}
          options={this.state.LayoutType}
          onChange={(e) => {
            this.handleChange(e);
          }}
          placeholder="Select a Layout"
        />{" "}
        <br />
        {DataTable}
      </div>
    );
  }
}



 
export default App;
