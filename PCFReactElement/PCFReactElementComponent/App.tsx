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
import {YearlyComponent} from './GridComponents/Summary/YearlySummary/yearlySummaryComponent';

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
  activeIndex:number
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
      SelectedLayout: "Month",
      columns : this.props.columns,
      context:this.props.context,
      IsUpdated:false,
      activeIndex: 1
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

  handleChange(e) {
    debugger
   // this.setState({ SelectedLayout: e.originalEvent.va });
  let selectedItem=e.originalEvent.target.innerText;
  this.setState({ SelectedLayout: selectedItem })
  this.setState({activeIndex: e.index})
  }

  callbackFunction = (childData) => {  

    this.setState({productsFomChild: childData});
    // console.log(childData);
    this.props.onChange(childData);
  }
  



  public render() {
debugger;
    let inputData={
      data: this.state.products,
      columns: this.state.columns,
      context:this.state.context,
      IsUpdated:this.state.IsUpdated
    }
    // this.setState({ products : this.props.data});
    const layout = this.state.SelectedLayout;
    let products = this.state.products;


    let DataTable;
    if (layout ==="Year")
    {

      DataTable=<YearlyComponent {...inputData}/>
      
     
    } 
    else if (layout === "Month")
    {
      DataTable=<MonthlySummary {...inputData}/>
      // DataTable = <GridMonthlyComponent parentCallback = {this.callbackFunction} {...products}/> ;
    }
    else if (layout ==="Quarter")
    {
      DataTable = <GridQuarterlyComponent  {...inputData}/>;
    }
   

    return (
      <div className="App">
                    <TabView activeIndex={this.state.activeIndex} renderActiveOnly={false} onTabChange={(e) => this.handleChange(e)}>
                        <TabPanel header="Year">
                        <YearlyComponent {...inputData} />;
                        </TabPanel>
                        <TabPanel header="Month" >
                        <MonthlySummary {...inputData}/>
                        </TabPanel>
                        <TabPanel header="Quarter" >
                        <GridQuarterlyComponent  {...inputData}/>;
                        </TabPanel>
                  </TabView>
      </div>
    );
  }
}

export default App;
