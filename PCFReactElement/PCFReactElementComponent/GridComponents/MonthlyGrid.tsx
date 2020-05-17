import React from "react";
// import "./CSS/App.css";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DialogDemo } from "./Summary/Common/popupComponent";

export interface Props {
  data: any[];
  columns: [];
  parentCallback :any;
  
}
export interface State {
  SelectedLayout: string;
  columslist: any[],
  products: any[],
  parsedJson : any[]
}
export class GridMonthlyComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    debugger;
    this.state = {
      products: this.props.data,
      SelectedLayout: "Monthly",
      columslist: this.props.columns,
      parsedJson :this.props.data
      
    };

    debugger;
    this.janEdit = this.janEdit.bind(this);
    this.febEdit = this.febEdit.bind(this);
    this.marEdit = this.marEdit.bind(this);
    this.aprEdit = this.aprEdit.bind(this);
    this.mayEdit = this.mayEdit.bind(this);
    this.junEdit = this.junEdit.bind(this);
    this.julEdit = this.julEdit.bind(this);
    this.augEdit = this.augEdit.bind(this);
    this.sepEdit = this.sepEdit.bind(this);
    this.octEdit = this.octEdit.bind(this);
    this.novEdit = this.novEdit.bind(this);
    this.decEdit = this.decEdit.bind(this);
    this.cashFlowEdit = this.cashFlowEdit.bind(this);
    this.PPREdit = this.PPREdit.bind(this);
    this.fiscalEdit = this.fiscalEdit.bind(this);
    this.lineEdit = this.lineEdit.bind(this);
    this.requiredValidator = this.requiredValidator.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    debugger;
        if (state.products !== props) {
          return {
            products: props
          }
        }
      }

      componentDidMount(){

        this.parseJson();
        debugger;
      }
    

  componentDidUpdate() {

    this.parseJson();
    debugger;
  }

 sendData = (childproduct :any) => {
   debugger;
  this.props.parentCallback(childproduct);
}

parseJson()
{
  debugger;
  let product: any[] = this.state.products;
    let columslist: any[] = this.state.columslist;
    let uniqyear = Object.values(product).map(i => i.FinacialYear);
    var uniqueItems = Array.from(new Set(uniqyear))
    let result = {};


    let ChildResultArray: any[];
    let ResultArray: any[];
    ResultArray = [];
    for (let i = 0; i < uniqueItems.length - 1; i++) {
      let data = Object.values(product);
      const year = uniqueItems[i];
      ChildResultArray = [];
      let x: number = 0;
      data.map(p => {
        if (p.FinacialYear === year) {
          
          let childrenData = {
            "key": i.toString().concat('-',x.toString()),
            data: {             
              "CFNAME": p.CFNAME,
              "PPR": p.PPR,
              "FinacialYear": p.FinacialYear,
              "April": p.April,
              "August": p.August,
              "December": p.December,
              "February": p.February,
              "January": p.January,
              "July": p.July,
              "June": p.June,
              "LineTotal": p.LineTotal,
              "March": p.March,
              "May": p.May,
              "November": p.November,
              "October": p.October,
              "September": p.September,
              "id": p.key
            }}
          x++;
          ChildResultArray.push(childrenData)
        }})

      let resultData = {
        key:i.toString(),
        data:{
          "FinacialYear": year,
        },
        children: ChildResultArray
      }
      ResultArray.push(resultData);
      this.setState({ parsedJson : ResultArray });

    }
    debugger;
    console.log(JSON.stringify(ResultArray));
}


componentWillMount()
{
  debugger;
  this.parseJson();
}


  render() {
    debugger;
    
    let parsed = this.state.parsedJson;
    
    return (
     
      <div>


        <DataTable
          value={parsed}
          paginator={true}
          rows={5}
          rowsPerPageOptions={[5, 10, 30]}
        >
          <Column
            field="CFNAME"
            header="Cash Flow Item Name"
            editor={this.cashFlowEdit}
            editorValidator={this.requiredValidator}
            style={{ height: "3.5em" }}
          />
          <Column
            field="displayName"
            header="PPR"
            editor={this.PPREdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="FinacialYear"
            header="Fiscal year"
            editor={this.fiscalEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="January"
            header="Jan"
            editor={this.janEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="February"
            header="Feb"
            editor={this.febEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="March"
            header="March"
            editor={this.marEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="April"
            header="April"
            editor={this.aprEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="May"
            header="May"
            editor={this.mayEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="June"
            header="June"
            editor={this.junEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="July"
            header="July"
            editor={this.julEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="August"
            header="August"
            editor={this.augEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="September"
            header="September"
            editor={this.sepEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="October"
            header="October"
            editor={this.octEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="November"
            header="November"
            editor={this.novEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="December"
            header="December"
            editor={this.decEdit}
            style={{ height: "3.5em" }}
          />
          <Column
            field="LineTotal"
            header="Line total"
            editor={this.lineEdit}
            style={{ height: "3.5em" }}
          />
        </DataTable>
        <span>
          <DialogDemo />
        </span>
      </div>
    );
  }

  /* Cell Editing */
  onEditorValueChange(props, value) {
    let updatedProducts = [...props.value];
    updatedProducts[props.rowIndex][props.field] = value;
    debugger;
    this.setState({ products: updatedProducts });
  }

  inputTextEditor(props, field) {
    return (
      <InputText
        type="text"
        value={props.rowData[field]}
        onChange={(e) => this.onEditorValueChange(props, e.currentTarget.value)}
      />
    );
  }

  cashFlowEdit(props) {
    return this.inputTextEditor(props, "name");
  }

  PPREdit(props) {
    return this.inputTextEditor(props, "name");
  }

  fiscalEdit(props) {
    return this.inputTextEditor(props, "price");
  }

  janEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  febEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  marEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  aprEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  mayEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  junEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  julEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  augEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  sepEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  octEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  novEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  decEdit(props) {
    return this.inputTextEditor(props, "place");
  }
  lineEdit(props) {
    return this.inputTextEditor(props, "place");
  }

  requiredValidator(props) {
    let value = props.rowData[props.field];
    return value && value.length > 0;
  }
}
