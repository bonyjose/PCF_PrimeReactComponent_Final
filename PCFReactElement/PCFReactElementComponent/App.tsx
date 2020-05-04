import React from "react";
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
      SelectedLayout: "",
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
    this.increment = this.increment.bind(this);
  }

  increment() {
    // this.setState({
    //     count: this.state.count + 1
    // });
  }

  // products:[];

  public render() {
    return (
      <div className="App">
        <label htmlFor="LayoutType"> Countries </label>
        <Dropdown
          value={this.state.SelectedLayout}
          options={this.state.LayoutType}
          onChange={(e) => {
            this.setState({ SelectedLayout: e.value });
          }}
          placeholder="Select a Layout"
        />

        <h3>DataTable</h3>
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
      </div>
    );
  }
}

export default App;
