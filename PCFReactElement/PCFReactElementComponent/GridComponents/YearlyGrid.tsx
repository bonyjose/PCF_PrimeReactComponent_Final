import React  from "react";
// import "./CSS/App.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {InputText} from 'primereact/inputtext';
 
export interface Props {
  data: any;
  columns:[];
  parentCallback :any;
}
export interface State {
  SelectedLayout: string;
  products:any;
}
 export class GridYearlyComponent extends React.Component<Props,State> {
   clonedProducts: {};
   
    constructor(props: Props) {
     
      super(props);
      debugger;
      this.state = {
        products: this.props,
        SelectedLayout: "Yearly"
    };
   
    // this.setState({ products : this.props["columns"]});
    debugger;

      this.clonedProducts = {};
      this.vinEditor = this.vinEditor.bind(this);
      this.yearEditor = this.yearEditor.bind(this);
      this.brandEditor = this.brandEditor.bind(this);
      this.colorEditor = this.colorEditor.bind(this);
      this.requiredValidator = this.requiredValidator.bind(this);
    }

    parseResult()
    {
      // // let obj = {};
      // this.state.products.forEach(item => this.clonedProducts[item.Field] = item.Value);
      // debugger;
      // console.log(this.clonedProducts);
      debugger;

      for(let currentRecordId of this.state.products){
        debugger;
        for(let curr of currentRecordId){
debugger;
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
      debugger;
      if (state.products !== props) 
      {
        return{
          products: props
        } 
      }
      else{
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

   sendData = (childproduct :any) => {
    debugger;
   this.props.parentCallback(childproduct);
 }

   
    render() {
      debugger;
      this.parseResult();
      let products = this.state.products;
      let json : any = JSON.stringify(products[0]);
      let jsonNew = JSON.parse('{"CFNAME":"123123","PPR":"ABC-456","FiscalYear":"2020","October":"50000","November":"","December":"","January":"","February":"","March":"","April":"","May":"","June":"","July":"","August":"","September":"","LineTotal":""}' );
      console.log(products[0]);
      console.log(jsonNew);
      debugger;
      return (
        <DataTable
          value={jsonNew}
          paginator={true}
          rows={5}
          editMode ="Cell"
          rowsPerPageOptions={[5, 10, 30]}
        >
          <Column field="CFNAME" header="Cash Flow Item Name"   style={{height: '3.5em'}}/>
          <Column field="LineTotal" header="PPR" style={{height: '3.5em'}}/>
          <Column field="December" header="Fiscal year"    style={{height: '3.5em'}} />
          <Column field="FiscalYear" header="Line total"   style={{height: '3.5em'}} />
        </DataTable>
      );
    }



     /* Cell Editing */
     onEditorValueChange(props, value) {
      let updatedProducts = [...props.value];
      updatedProducts[props.rowIndex][props.field] = value;
      debugger;
      this.setState({products: updatedProducts});
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