import React from "react";
import { QuarterlyComponent } from './GridComponents/Summary/QuarterlySummary/quarterlySummaryComponent'
import { MonthlyComponent } from './GridComponents/Summary/MonthlySummary/monthlySummaryComponent'
import { IInputs, IOutputs } from "../CashFlowComponent/generated/ManifestTypes"
import { TabView, TabPanel } from 'primereact/tabview';
import { YearlyComponent } from './GridComponents/Summary/YearlySummary/yearlySummaryComponent';
import { Growl } from 'primereact/growl';
export interface Props {
  data: any;
  columns: [];
  context: ComponentFramework.Context<IInputs>;
  IsUpdated: boolean;
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
  EntitySetName:string
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
      TabUpdated: false,
      EntitySetName:""
    };
    this.handleChange = this.handleChange.bind(this);

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


  public fetchEntityName=()=>
  {
      let gridEntity = this.props.context.parameters.cashFlowDataSet.getTargetEntityType().toString();
      let ppr = this.props.context.parameters.ppr.raw;
      var entitySetName;
      var request = new XMLHttpRequest();
            // @ts-ignore 
      var entityName=this.state.context.page.entityTypeName   
      // @ts-ignore 
      request.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/EntityDefinitions(LogicalName='"+entityName+"')",false);
      request.setRequestHeader("OData-MaxVersion", "4.0");			
      request.setRequestHeader("OData-Version", "4.0");
      request.setRequestHeader("Accept", "application/json");
      request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      request.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
      request.onreadystatechange = function() {
      if (request.readyState === 4) 
      {
          request.onreadystatechange = null;
          if (request.status === 200) {
            entitySetName = JSON.parse(request.response).EntitySetName;
            }
      };
      request.send();
      }
      request.send();
      this.setState({ EntitySetName: entitySetName });
  }

  public render() {
    var entityNameData=this.state.EntitySetName;
    if(entityNameData.length===0){
      debugger;
      this.fetchEntityName()
    }

    let inputData = {
      data: this.state.products,
      columns: this.state.columns,
      context: this.state.context,
      IsUpdated: this.state.IsUpdated,
      EntitySetName:this.state.EntitySetName
    }
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
            <MonthlyComponent {...inputData} fileUpdated={this.fileUpdated} />
          </TabPanel>
          <TabPanel header="Quarter" >
            <QuarterlyComponent  {...inputData} fileUpdated={this.fileUpdated} />;
          </TabPanel>
        </TabView>
      </div>
    );
  }
}

export default App;
