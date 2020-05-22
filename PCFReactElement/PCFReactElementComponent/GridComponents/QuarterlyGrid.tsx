 import React  from "react";
// import "./CSS/App.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TreeTable } from "primereact/treetable";
import { InputText } from "primereact/inputtext";
import { DialogDemo } from "../GridComponents/Summary/Common/popupComponent"
import { IInputs, IOutputs } from "../generated/ManifestTypes"
interface Props {
  data: any[];
  columns?: any[];
  context: ComponentFramework.Context<IInputs>;
  IsUpdated:boolean
 
}
interface State {
  SelectedLayout: string;
  nodes: [],
  sampledata: any,
  IsUpdated:boolean
}
 export class GridQuarterlyComponent extends React.Component<Props,State> {
    
    constructor(props: Props) {
      super(props);
      this.state = {
        nodes: [],
        sampledata: this.props,
        SelectedLayout: "Quarterly",
        IsUpdated:this.props.IsUpdated
      };
    }

    ParseToQuarter()
    {

      let product: any[] = Object.values(this.props.data);
      let data = Object.values(product);
      let i=0;
      for (let columns of data) {
      let q1 =(Number(columns["January"]) + Number(columns["February"]) + Number(columns["March"]));
      let q2 =(Number(columns["April"]) + Number(columns["May"]) + Number(columns["June"]) );
      let q3 = (Number(columns["July"]) + Number(columns["August"]) + Number(columns["September"]));
      let q4 = (Number(columns["October"]) + Number(columns["November"]) + Number(columns["December"]));
        data[i].Q1 = q1 == 0 ? '': q1;
        data[i].Q2 = q2 == 0 ? '': q2;
        data[i].Q3 = q3 == 0 ? '': q3;
        data[i].Q4 = q4 == 0 ? '': q4;
        console.log(data[i]);
        i++;
      }
      // this.setState({sampledata : data});
      return data;

    }


    
    componentDidUpdate(prevProps, prevState) {

      if ((this.props.IsUpdated) && (!this.state.IsUpdated))  {
          // this.setState({sampledata : this.props});
          let QuarterData = this.ParseToQuarter();

          let data = this.createJsonTreestructure(QuarterData);
          let newNodes = JSON.parse(data);
          this.setState({ nodes: newNodes });
          this.setState({ IsUpdated: this.props.IsUpdated });
      }
    }
    componentDidMount() {
      if (!this.state.IsUpdated||this.props.data.length>0) {
          // this.setState({sampledata : this.props});
          let QuarterData = this.ParseToQuarter();

          let data = this.createJsonTreestructure(QuarterData);
          let newNodes = JSON.parse(data);
          this.setState({ nodes: newNodes });
        
      }
    }

    createJsonTreestructure = (QuarterData : any) => {

      let product: any[] = Object.values(QuarterData);

      let uniqyear = product.map(i => i.FinacialYear);
      var uniqueItems = Array.from(new Set(uniqyear))
      let result = {};


      let ChildResultArray: any[];
      let ResultArray: any[];
      ResultArray = [];
      for (let i = 0; i < uniqueItems.length; i++) {
          let data = Object.values(product);
          const year = uniqueItems[i];
          ChildResultArray = [];
          let x: number = 0;
          data.map(p => {
              if (p.FinacialYear === year) {

                  let childrenData = {
                      "key": i.toString().concat('-', x.toString()),
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
                          "id": p.key,
                          "Q1": p.Q1,
                          "Q2": p.Q2,
                          "Q3": p.Q3,
                          "Q4": p.Q4

                      }
                  }
                  x++;
                  ChildResultArray.push(childrenData)
              }
          })

          let resultData = {
              key: i.toString(),
              data: {
                  "FinacialYear": year,
              },
              children: ChildResultArray
          }
          ResultArray.push(resultData);
      }
      // console.log(JSON.stringify(ResultArray));

      return JSON.stringify(ResultArray);

  }
      


    createJsonForAPI= () => {

      let product: any[] = Object.values(this.props);
      let result = {};


      let ChildResultArray: any[];
      let ResultArray: any[];
      ResultArray = [];
      let data = Object.values(product);

          ChildResultArray = [];
          let x: number = 0;
          data.map(p => {
            let childrenData = {
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
                      }
                  ChildResultArray.push(childrenData)
          })
          ResultArray.push(ChildResultArray);

          console.log(JSON.stringify(ResultArray));
          return JSON.stringify(ResultArray);
}


onEditorValueChange(props: any, value: any) {
  debugger;

  let gridEntity: string=this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
  let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
  let editedNode = this.findNodeByKey(newNodes, props.node.key);
  debugger;
  editedNode.data[props.field] = value;
  let editedObject = this.buildUpdateNode(editedNode.data);
  console.log(editedObject);
  this.setState({
      nodes: newNodes
  });
  this.props.context.webAPI.createRecord(gridEntity, editedNode).then(this.successCallback, this.errorCallback);
  debugger;
}

buildUpdateNode(editNode : any)
{
  debugger;
  let Q1Split = Number(editNode["Q1"])/4;
  let Q2Split = Number(editNode["Q2"])/4;
  let Q3Split = Number(editNode["Q3"])/4;
  let q4Split = Number(editNode["Q4"])/4;

  editNode["January"]= Q1Split;
  editNode["February"]= Q1Split;
  editNode["March"]= Q1Split;
  editNode["April"]= Q2Split
  editNode["May"]= Q2Split;
  editNode["June"]= Q2Split;
  editNode["July"]= Q3Split;
  editNode["August"]= Q3Split;
  editNode["September"]= Q3Split;
  editNode["October"]= q4Split;
  editNode["November"]= q4Split;
  editNode["December"]= q4Split;

  return editNode;

//   var entity = {};
//   // @ts-ignore 
// entity.m360_apramount = Number(parseFloat(25).toFixed(0));
// // @ts-ignore 
// entity.m360_cashflowitemname = "Test API";
// // @ts-ignore 
// entity.m360_janamount = Number(parseFloat(250).toFixed(0));
// // @ts-ignore 
// entity.m360_fiscalyear = 555080001;
// // @ts-ignore 
// entity.m360_novamount = Number(parseFloat(500).toFixed(0));
}


successCallback()
{
  console.log("api create success");
}

errorCallback()
{
  console.log("api create failed");
}

findNodeByKey(nodes: any, key: any) {
  debugger;
  let path = key.split('-');
  let node;

  while (path.length) {
      let list = node ? node.children : nodes;
      node = list[parseInt(path[0], 10)];
      path.shift();
  }

  return node;
}

inputTextEditor = (props: any, field: any) => {

  return <InputText type="text" value={props.node.data[field] ? props.node.data[field] : ""} onChange={(
      ev: React.ChangeEvent<HTMLInputElement>): void => {

      this.onEditorValueChange
          (props, ev.target.value.toString())
  }} />;
}
rowClassName(node) {

  return { 'p-highlight_custom': (node.children && node.children.length > 0) };
}

vinEditor = (props: any) => {

  let field = props.field
  return this.inputTextEditor(props, field);
}

  
    render() {

      return (
        <div>
        <div className="content-section implementation">
        <DialogDemo />
                    <TreeTable value={this.state.nodes} rowClassName={this.rowClassName}  paginator={true} rows={1}>
                        <Column field="FinacialYear" header="Year*" style={{ height: '3.5em' }} expander={true} />
                        <Column field="CFNAME" header="CFN*" style={{ height: '3.5em' }} />
                        <Column field="PPR" header="PPR" style={{ height: '3.5em' }} />
{/* 
                        <Column field="January" header="Jan" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="February" header="Feb" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="March" header="Mar" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="April" header="April" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="May" header="May" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="June" header="Jun" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="July" header="Jul" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="August" header="Aug" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="September" header="Sep" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="October" header="Oct" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="November" header="Nov" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="December" header="Dec" editor={this.vinEditor} style={{ height: '3.5em' }} /> */}

                        <Column field="Q1" header="Quarter 1" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Q2" header="Quarter 2" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Q3" header="Quarter 3" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Q4" header="Quarter 4" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="LineTotal" header="Total*" editor={this.vinEditor} style={{ height: '3.5em' }} />
                    </TreeTable >
                    <label style={{ float: "left", color: "#ab9999" }} >Total*: Line Total</label><br />
                    <label style={{ float: "left", color: "#ab9999" }} >CFN*: Cash Flow Name</label><br />
                    <label style={{ float: "left", color: "#ab9999" }} >Year*: Finacial Year</label><br />
                </div>

              </div>
          );
      }
} 