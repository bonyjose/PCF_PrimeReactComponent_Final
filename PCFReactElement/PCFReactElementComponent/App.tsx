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
  // childData:[];
  onChange: (value:[])=>void;
}
export interface State {
  LayoutType: { label: string; value: string }[];
  SelectedLayout: string;
  products :any;
  productsFomChild: any;
}

export class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    debugger;
    this.state = {
      products : this.props.data,
      productsFomChild :null,
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

  
  static getDerivedStateFromProps(props, state) {
    debugger;
    if (state.products !== props.data) 
    {
      return{
        products: props.data
      } 
    }
    return null;
  }
  
//   componentDidUpdate() {
//     debugger;
//     if (this.state.products !== this.props.data) 
//     {
//       this.setState({products: this.props.data});
//       // this.render();
//   }
//  }

  handleChange(e: { originalEvent: Event; value: any }) {
    this.setState({ SelectedLayout: e.value });

    debugger;
  }

  callbackFunction = (childData) => {  
    debugger;
    this.setState({productsFomChild: childData});
    // console.log(childData);
    this.props.onChange(childData);
  }
  



  public render() {
    debugger;
    // this.setState({ products : this.props.data});
    const SelectedLayout = this.state.SelectedLayout;
    let products = this.state.products;
    let DataTable;
    if (SelectedLayout == "Yearly")
    {
      DataTable = <GridYearlyComponent  parentCallback = {this.callbackFunction} {...products}/>;
    } 
    else if (SelectedLayout == "Monthly")
    {
      DataTable = <GridMonthlyComponent parentCallback = {this.callbackFunction} {...products}/>;
    }
    else if (SelectedLayout == "Quarterly")
    {
      DataTable = <GridQuarterlyComponent/>;
    }
    return (
      <div className="App">
        <span className="DropDown">
        <label htmlFor="LayoutType" > View As </label> &nbsp; &nbsp;
        <Dropdown 
          name="LayoutType"
          value={this.state.SelectedLayout}
          options={this.state.LayoutType}
          onChange={(e) => {
            this.handleChange(e);
          }}
          placeholder="Select a Layout"
        />
        </span>
       {" "}
        <br />
        <br />
        {DataTable}
      </div>
    );
  }
}

export default App;
