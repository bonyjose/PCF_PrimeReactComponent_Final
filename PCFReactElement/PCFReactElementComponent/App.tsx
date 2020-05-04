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

interface Props {}
interface State {
  LayoutType: { label: string; value: string }[];
  SelectedLayout: string;
}

export class App extends React.Component<Props, State> {
  products: { id: string; name: string; place: string; price: string }[];
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
    this.products = [
      {
        id: "1",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "2",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "3",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "4",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "5",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "6",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
      {
        id: "7",
        name: "nijomon",
        place: "Kply",
        price: "30",
      },
    ];
    this.handleChange = this.handleChange.bind(this);
  }

  LayoutGridYearly() {
    return (
      <DataTable
        value={this.products}
        paginator={true}
        rows={5}
        rowsPerPageOptions={[5, 10, 30]}
      >
        <Column field="id" header="ID" />
        <Column field="name" header="Name" />
        <Column field="PRice" header="Price" />
        <Column field="place" header="place" />
      </DataTable>
    );
  }

  LayoutGridMonthly() {
    debugger;
    return (
      <DataTable
        value={this.products}
        paginator={true}
        rows={5}
        rowsPerPageOptions={[5, 10, 30]}
      >
        <Column field="id" header="ID" />
        <Column field="name" header="Name" />
        <Column field="PRice" header="Price" />
        <Column field="place" header="place" />
      </DataTable>
    );
  }

  LayoutGridQuarterly() {
    return (
      <DataTable
        value={this.products}
        paginator={true}
        rows={5}
        rowsPerPageOptions={[5, 10, 30]}
      >
        <Column field="id" header="ID" />
        <Column field="name" header="Name" />
        <Column field="PRice" header="Price" />
        <Column field="place" header="place" />
      </DataTable>
    );
  }
  chooseLayout() {
    debugger;
    if (this.state.SelectedLayout == "Yearly") {
      return <this.LayoutGridYearly />;
    } else if (this.state.SelectedLayout == "Quarterly") {
      return <this.LayoutGridQuarterly />;
    } else if (this.state.SelectedLayout == "Monthly") {
      <this.LayoutGridMonthly />;
    }
  }

  handleChange(e: { originalEvent: Event; value: any }) {
    this.setState({ SelectedLayout: e.value });
    debugger;
    // this.chooseLayout();
  }

  public render() {
    const SelectedLayout = this.state.SelectedLayout;
    let Div;
    if (SelectedLayout == "Yearly")
    {
      Div = <GridYearlyComponent />;
    } 
    else if (SelectedLayout == "Monthly")
    {
      Div = <GridMonthlyComponent/>;
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
