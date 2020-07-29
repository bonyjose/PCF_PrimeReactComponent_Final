import React from "react";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { GridQuarterlyComponent } from './GridComponents/Summary/QuarterlySummary/QuarterlyGrid'
// import { GridMonthlyComponent } from './GridComponents/MonthlyGrid'
// import { GridYearlyComponent } from './GridComponents/YearlyGrid'
import MonthlySummary from './GridComponents/Summary/MonthlySummary/monthlySummaryComponent'
import { RecordOverviewProps } from './GridComponents/interface/contextInterface'
import { IInputs, IOutputs } from "../CashFlowComponent/generated/ManifestTypes"
import { TabView, TabPanel } from 'primereact/tabview';
import YearlyComponent from './GridComponents/Summary/YearlySummary/yearlySummaryComponent';
import { threadId } from "worker_threads";
import { Growl } from 'primereact/growl';

import { Message } from 'primereact/message';
export interface Props {
  data: any;
  columns: [];
  context: ComponentFramework.Context<IInputs>;
  IsUpdated: boolean;
  // childData:[];
  onChange: (value: []) => void;
}
export interface State {
  LayoutType: { label: string; value: string }[];
  SelectedLayout: string;
  products: any;
  productsFomChild: any;
  columns: any,
  context: ComponentFramework.Context<IInputs>;
  IsUpdated: boolean;
  activeIndex: number,
  TabUpdated: boolean
}


export class App extends React.Component<Props, State> {

  public growl = React.createRef<any>();


  constructor(props: Props) {
    super(props);

    this.state = {
      products: this.props.data,
      productsFomChild: null,
      LayoutType: [
        { label: "Yearly", value: "Yearly" },
        { label: "Monthly", value: "Monthly" },
        { label: "Quarterly", value: "Quarterly" },
      ],
      SelectedLayout: "Month",
      columns: this.props.columns,
      context: this.props.context,
      IsUpdated: false,
      activeIndex: 1,
      TabUpdated: false
    };
    // this.setState({ products : this.props.data});
    this.handleChange = this.handleChange.bind(this);
    // this.growlRef = React.createRef() // <---- Note the change in this line.
  }

  fileUpdated = (value: boolean) => {
    this.setState({ TabUpdated: value });
  }
  static getDerivedStateFromProps(props, state) {

    if (state.products !== props.data) {
      return {
        products: props.data,
        columns: props.columns,
        context: props.context,
        IsUpdated: true

      }
    }
    return null;
  }


  handleChange(e) {
    if (this.state.activeIndex != e.index) {
      if (this.state.TabUpdated) {
        let data = this.growl.current.state.messages
        if (data.length === 0) {
          this.growl.current.show({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Please save Data '
          });
        }
        return;
      }
    }
    let selectedItem = e.originalEvent.target.innerText;
    this.setState({ SelectedLayout: selectedItem })
    this.setState({ activeIndex: e.index })
  }

  callbackFunction = (childData) => {

    this.setState({ productsFomChild: childData });
    this.props.onChange(childData);
  }




  public render() {
    debugger;
    let inputData = {
      data: this.state.products,
      columns: this.state.columns,
      context: this.state.context,
      IsUpdated: this.state.IsUpdated,
    }
    // this.setState({ products : this.props.data});
    const layout = this.state.SelectedLayout;
    let products = this.state.products;

    return (
      <div className="App">
        <Growl ref={this.growl} />


        <TabView activeIndex={this.state.activeIndex} renderActiveOnly={false} onTabChange={(e) => this.handleChange(e)}>
          <TabPanel header="Year">
            <YearlyComponent {...inputData} fileUpdated={this.fileUpdated} />;
                        </TabPanel>
          <TabPanel header="Month" >
            <MonthlySummary {...inputData} fileUpdated={this.fileUpdated} />
          </TabPanel>
          <TabPanel header="Quarter" >
            <GridQuarterlyComponent  {...inputData} fileUpdated={this.fileUpdated} />;
          </TabPanel>
        </TabView>
      </div>
    );
  }
}

export default App;
