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
 
  //   Lists: {};

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
    this.render();
    
    // this.chooseLayout();
  }

  public render() {
    debugger;
    const SelectedLayout = this.state.SelectedLayout;
    let Div;
    if (SelectedLayout == "Yearly")
    {
      Div = <GridYearlyComponent {...this.products}/>;
    } 
    else if (SelectedLayout == "Monthly")
    {
      Div = <GridMonthlyComponent {...this.products}/>;
    }
    else if (SelectedLayout == "Quarterly")
    {
      Div = <GridQuarterlyComponent/>;
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
        <h3>DataTable</h3>
        {Div}
      </div>
    );
  }
}



 
export default App;
