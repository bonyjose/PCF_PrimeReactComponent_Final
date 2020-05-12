import React from "react";
// import "./CSS/App.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import linq from "linq";
import { InputText } from 'primereact/inputtext';

var Enumerable = require('../../node_modules/linq');
export interface Props {
  data: any[];
  columns: any[];
  parentCallback: any;
}
type xyz = {
  a: any
}
export interface State {
  SelectedLayout: string;
  columslist: any[],
  products: any[];
}
export class GridYearlyComponent extends React.Component<Props, State> {
  clonedProducts: {};

  constructor(props: Props) {

    super(props);
    debugger;
    this.state = {
      products: this.props.columns,
      columslist: this.props.columns,
      SelectedLayout: "Yearly"
    };

    // this.setState({ products : this.props["columns"]});

    this.clonedProducts = {};
    this.vinEditor = this.vinEditor.bind(this);
    this.yearEditor = this.yearEditor.bind(this);
    this.brandEditor = this.brandEditor.bind(this);
    this.colorEditor = this.colorEditor.bind(this);
    this.requiredValidator = this.requiredValidator.bind(this);
  }



  parseResult() {


    for (let currentRecordId of this.state.products) {

      for (let curr of currentRecordId) {

        let id = curr.value;
        console.log(id);
        this.clonedProducts = JSON.stringify(id);
        console.log(this.clonedProducts);
      }



    }

    // this.state.products.forEach(element => {
    //   let jsonobj =element.map((item: { [x: string]: string; }) => {

    //     Object.keys(item).map(ColumnData => {
    //        ColumnData
    // });

    //           //@ts-ignore
    //           // let currValue =Number(item[ColumnData].replace( /^\D+/g, ''));

    //           console.log(jsonobj);


    //   })

    // })


  }

  static getDerivedStateFromProps(props, state) {

    if (state.products !== props) {
      return {
        products: props
      }
    }
    else {
      return null;
    }
  }

  //   componentDidUpdate() {
  //     debugger;
  //     if (this.state.products !== this.props) 
  //     {
  //       this.setState({products: this.props});
  //       // this.render();
  //       let childproduct = this.state.products;
  //       this.sendData(childproduct);
  //   }
  //  }

  sendData = (childproduct: any) => {

    this.props.parentCallback(childproduct);
  }


  render() {

    this.parseResult();
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

    }
    console.log(JSON.stringify(ResultArray));








    // let json : any = JSON.stringify(products[0]);
    let jsonNew = JSON.parse('{"CFNAME":"123123","PPR":"ABC-456","FiscalYear":"2020","October":"50000","November":"","December":"","January":"","February":"","March":"","April":"","May":"","June":"","July":"","August":"","September":"","LineTotal":""}');
    // console.log(products[0]);
    console.log(jsonNew);

    return (
      <DataTable>
        {/* //   value={products}
        //   paginator={true}
        //   rows={5}
        //   editMode ="Cell"
        //   rowsPerPageOptions={[5, 10, 30]}
        // >
        //   <Column field="CFNAME" header="Cash Flow Item Name"   style={{height: '3.5em'}}/>
        //   <Column field="LineTotal" header="PPR" style={{height: '3.5em'}}/>
        //   <Column field="December" header="Fiscal year"    style={{height: '3.5em'}} />
        //   <Column field="FiscalYear" header="Line total"   style={{height: '3.5em'}} /> */}
      </DataTable>
    );
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }



  /* Cell Editing */
  onEditorValueChange(props, value) {
    let updatedProducts = [...props.value];
    updatedProducts[props.rowIndex][props.field] = value;

    this.setState({ products: updatedProducts });
  }

  inputTextEditor(props, field) {
    return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.currentTarget.value)} />;
  }

  vinEditor(props) {
    return this.inputTextEditor(props, 'id');
  }

  yearEditor(props) {
    return this.inputTextEditor(props, 'name');
  }

  brandEditor(props) {
    return this.inputTextEditor(props, 'price');
  }

  colorEditor(props) {
    return this.inputTextEditor(props, 'place');
  }

  requiredValidator(props) {
    let value = props.rowData[props.field];
    return value && value.length > 0;
  }
}