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
  products :any;
}

export class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    debugger;
    this.state = {
      products : this.props.data,
      LayoutType: [
        { label: "Yearly", value: "Yearly" },
        { label: "Monthly", value: "Monthly" },
        { label: "Quarterly", value: "Quarterly" },
      ],
      SelectedLayout: "Yearly",
    };
    // this.setState({ products : this.props.data});
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate() {
    debugger;
    if (this.state.products !== this.props.data) 
    {
      this.setState({products: this.props.data});
      this.render();
  }
 }

  handleChange(e: { originalEvent: Event; value: any }) {
    this.setState({ SelectedLayout: e.value });

    debugger;
  }

  public render() {
    debugger;
    // this.setState({ products : this.props.data});
    const SelectedLayout = this.state.SelectedLayout;
    let products = this.state.products;
    let DataTable;
    if (SelectedLayout == "Yearly")
    {
      DataTable = <GridYearlyComponent {...products}/>;
    } 
    else if (SelectedLayout == "Monthly")
    {
      DataTable = <GridMonthlyComponent {...products}/>;
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
