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
import {MonthlySummary} from './GridComponents/Summary/MonthlySummary/monthlySummaryComponent' 
import{RecordOverviewProps} from './GridComponents/interface/contextInterface'
import {IInputs, IOutputs} from "../PCFReactElementComponent/generated/ManifestTypes"
import {TabView,TabPanel} from 'primereact/tabview';

export interface Props {
  data: any;
  columns:[];
  context: ComponentFramework.Context<IInputs>;
  IsUpdated:boolean;
  // childData:[];
  onChange: (value:[])=>void;
}
export interface State {
  LayoutType: { label: string; value: string }[];
  SelectedLayout: string;
  products :any;
  productsFomChild: any;
  columns : any,
  context:ComponentFramework.Context<IInputs>;
  IsUpdated:boolean;
}

export class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      products : this.props.data,
      productsFomChild :null,
      LayoutType: [
        { label: "Yearly", value: "Yearly" },
        { label: "Monthly", value: "Monthly" },
        { label: "Quarterly", value: "Quarterly" },
      ],
      SelectedLayout: "Quarterly",
      columns : this.props.columns,
      context:this.props.context,
      IsUpdated:false
    };
    // this.setState({ products : this.props.data});
    this.handleChange = this.handleChange.bind(this);
  }

  
  static getDerivedStateFromProps(props, state) {

    if (state.products !== props.data) 
    {
      return{
        products: props.data,
        columns : props.columns,
        context:  props.context,
        IsUpdated:true

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


  }

  callbackFunction = (childData) => {  

    this.setState({productsFomChild: childData});
    // console.log(childData);
    this.props.onChange(childData);
  }
  



  public render() {

    let inputData={
      data: this.state.products,
      columns: this.state.columns,
      context:this.state.context,
      IsUpdated:this.state.IsUpdated
    }
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
      DataTable=<MonthlySummary {...inputData}/>
      // DataTable = <GridMonthlyComponent parentCallback = {this.callbackFunction} {...products}/> ;
    }
    else if (SelectedLayout == "Quarterly")
    {
      DataTable = <GridQuarterlyComponent  {...inputData}/>;
    }
    return (
      <div className="App">
                    <TabView renderActiveOnly={false}>
                        <TabPanel header="Year">
                        <GridYearlyComponent  parentCallback = {this.callbackFunction} {...products}/>;
                        </TabPanel>
                        {/* <TabPanel header="Month" >
                        <MonthlySummary {...inputData}/>
                        </TabPanel> */}
                        <TabPanel header="Quater" >
                        <GridQuarterlyComponent  {...inputData}/>;
                        </TabPanel>
                  </TabView>
      </div>
    );
  }
}

export default App;
