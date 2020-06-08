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
  columns: any[];
  context: ComponentFramework.Context<IInputs>;
  IsUpdated:boolean;
  // parentCallback :any;
 
}
interface State {
  SelectedLayout: string;
  nodes: [],
  sampledata: any,
  IsUpdated:boolean,
  coldef: any[],
  monthDetails: any[],
  rowEditedKeyData: any[],
  rowEditedKey: []
}
 export class GridQuarterlyComponent extends React.Component<Props,State> {
    
    constructor(props: Props) {
      super(props);
      this.state = {
        nodes: [],
        sampledata: this.props,
        SelectedLayout: "Quarterly",
        IsUpdated:this.props.IsUpdated,
        coldef: [],
        monthDetails: [],
        rowEditedKeyData: [],
        rowEditedKey: []
      };
      
    }

    ParseToQuarter()
    {
      debugger;
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
      debugger;
      return data;

    }
    // createQuarterColumnDef()
    // {
    //   debugger;
    //   let columnsProps: any[] = Object.values(this.props.columns);
    //   let columns = Object.values(columnsProps);
    //   let i=0;
    //   for (i=0;i<4;i++) {

    //     let row =  {} ;
    //     row["fieldName"] = "Q" + Number(i+1);
    //     row["name"] = "Q" + Number(i+1);
    //     columns.push(row);
    //   }
    //   // this.setState({sampledata : data});
    //   return columns;

    // }


    
    componentDidUpdate(prevProps, prevState) {

      if ((this.props.IsUpdated) && (!this.state.IsUpdated))  {
          // this.setState({sampledata : this.props});
          let QuarterData = this.ParseToQuarter();

          let data = this.createJsonTreestructure(QuarterData);
          let newNodes = JSON.parse(data);
          this.setState({ nodes: newNodes });
          this.setState({ IsUpdated: this.props.IsUpdated });
      }
      // this.props.parentCallback;
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

    createMonthDefinition = () => {

      let expandYear, ppr, lineTotal, cashFlow;
      if (typeof (this.props.context.parameters) !== 'undefined') {
          expandYear = this.props.context.parameters.expandYear.raw;
          ppr = this.props.context.parameters.ppr.raw;
          lineTotal = this.props.context.parameters.lineTotal.raw;
          cashFlow = this.props.context.parameters.cashFlow.raw;
      }
      else {
          expandYear = "FinacialYear";
      }

      let resultData = {};
      let cols: any[];
      let month: any[] = [];
      cols = [];
      Object.values(this.props.columns).map(p => {
          let expander: boolean = false;
          switch (p.fieldName) {
              case expandYear:
              case cashFlow:
              case ppr:
              case lineTotal:
                  {
                      break;
                  }
              default:
                  resultData = {
                      field: p.fieldName, header: p.name, expander: expander
                  }
                  cols.push(resultData);
                  month.push(p.fieldName);
                  break;
          }
      });
      this.setState({ monthDetails: month })
  }

 
  createJsonTreestructure = (QuarterData : any[]) => {
    debugger;
    let expandYear ;
    if (typeof (this.props.context.parameters) !== 'undefined') {
        expandYear = this.props.context.parameters.expandYear.raw;
    }
    else {
        expandYear = "FinacialYear";
    }
    const yearHead=expandYear.toString();
    this.createColDefinition()
    let product: any[] = Object.values(QuarterData);
    debugger;
    let cols = this.createfieldDef();
    debugger;
    let field = Object.values(cols).map(p => p.fieldName);
    let uniqYear = product.map(i => i[expandYear]);
    var uniqueItems = Array.from(new Set(uniqYear))
    let result = {};
    let ChildResultArray: any[];
    let ResultArray: any[];
    let sampleArray: any[];
    ResultArray = [], sampleArray = [];
    for (let i = 0; i < uniqueItems.length; i++) {
        let data = Object.values(product);
        let column = Object.values(field);
        var currentKey;
        var currentVal;
        const year = uniqueItems[i];
        ChildResultArray = [];
        let x: number = 0;
        let childrenData: any[];
        let result = {};
        data.map(p => {
            if (p[expandYear] === year) {
                for (let k = 0; k <= column.length; k++) {
                    currentKey = column[k];
                    currentVal = p[currentKey];
                    result[currentKey] = currentVal;
                }

                let childrenData = {
                    key: i.toString().concat('-', x.toString()),
                    data: result,
                    nodeKey: p.key
                }
                x++;
                ChildResultArray.push(childrenData)
            }
        });
        let resultData = {
            key: i.toString(),
            data: {
                "FinacialYear": year,
            },
            children: ChildResultArray
        }
        ResultArray.push(resultData);
    }
    debugger;
    return JSON.stringify(ResultArray);
}

createfieldDef()
{
  debugger;
  let cols: any[] = Object.values(this.props.columns);
  let data = Object.values(cols);
  let i=0;
  for (i=0;i<4;i++) {

    let row =  {} ;
    row["fieldName"] = "Q" + Number(i+1);
    cols.push(row);
  }
  // this.setState({sampledata : data});
  debugger;
  return cols;

}

createColDefinition = () => {

  debugger;
  let expandYear, ppr, lineTotal, cashFlow;
  if (typeof (this.props.context.parameters) !== 'undefined') {
      expandYear = this.props.context.parameters.expandYear.raw;
      ppr = this.props.context.parameters.ppr.raw;
      lineTotal = this.props.context.parameters.lineTotal.raw;
      cashFlow = this.props.context.parameters.cashFlow.raw;
  }
  else {
      expandYear = "FinacialYear";
  }
  // let expandYear=this.context.parameters.expandYear.raw.toString()!=null?this.context.parameters.expandYear.raw.toString():"FinacialYear";

  let resultData = {};
  let cols: any[];
  let month: any[] = [];
  cols = [];
  Object.values(this.props.columns).map(p => {
      let expander: boolean = false;
      switch (p.fieldName) {
          case expandYear:
              resultData = {
                  field: p.fieldName, header: "Year", expander: true,isEditable:false
              }
              cols.push(resultData);
              break;
          case cashFlow:
              resultData = {
                  field: p.fieldName, header: "Cash Flow", expander: expander,isEditable:false
              }
              cols.push(resultData);
              break;
          case ppr:
              resultData = {
                  field: p.fieldName, header: "PPR", expander: expander,isEditable:false
              }
              cols.push(resultData);
              break;
          case lineTotal:
              resultData = {
                  field: p.fieldName, header: "Total", expander: expander,isEditable:false
              }
              cols.push(resultData);
              break;

             
          default:
            
      }

       
  });
  resultData = {
    field: "Q1", header: "Quarter 1", expander: false,isEditable:true
}
cols.push(resultData);

resultData = {
    field: "Q2", header: "Quarter 2", expander: false,isEditable:true
}
cols.push(resultData);

resultData = {
    field: "Q3", header: "Quarter 3", expander: false,isEditable:true
}
cols.push(resultData);

resultData = {
    field: "Q4", header: "Quarter 4", expander: false,isEditable:true
}
cols.push(resultData);
  let datas = this.sortByKey(Object.values(cols), 'expander');

  debugger;
  return datas;
}

sortByKey(array, key) {
  return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}




onEditorValueChange(props: any, event) {
  debugger;
  let gridEntity: string = this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
  let nodes = this.state.nodes;
  let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
  let editedNode = this.findNodeByKey(newNodes, props.node.key);
  editedNode.data[props.field] = event.target.value;
  var rowEdited: any[];
  rowEdited = this.state.rowEditedKeyData;
  rowEdited.push(props.node.key);
  let EditedKeyArray: any[];
  this.setState({
      nodes: newNodes,
      rowEditedKey: props.node.key as any,
      rowEditedKeyData: rowEdited
  });
}

onBlur = (props: any, event) => {
  debugger;
  let gridEntity: string=this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
  let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
  let editedNode = this.findNodeByKey(newNodes, props.node.key);
  editedNode.data[props.field] = event.target.value;
  this.setState({
      nodes: newNodes
  });

  let editedField = props.field;
  let editedObject = this.createApiUpdateRequest(editedNode.data,editedField);
  this.props.context.webAPI.updateRecord(gridEntity,editedNode.nodeKey,editedObject).then(this.successCallback,this.errorCallback);
  try{
      this.props.context.parameters.sampleDataSet.refresh();
  }
  catch (Error)   
  {  
    console.log(Error.message);  
  }  
  this.forceUpdate();
}

createApiUpdateRequest(editNode : any,editedField : string)
{
  debugger;
  let months: any[] = [];
  if (this.state.monthDetails.length == 0) {
      this.createMonthDefinition();//Define Months

  }
  months = this.state.monthDetails;
  var entity = {};
  let total=0;
  let lineTotal;
  if (typeof (this.props.context.parameters) !== 'undefined') {
      lineTotal = this.props.context.parameters.lineTotal.raw;
  }
  let Q1 = ["January","February","March"];
  let Q2 = ["April","May","June"];
  let Q3 = ["July","August","September"];
  let Q4 = ["October","November","December"];
  let currentSum = 0;
  let newSum = 0;
  for(let Column in editNode)
  {
    if(Column == editedField)
    {
      if ( Column =="Q1" )
      {
        for (var i = 0; i < Q1.length; i++) 
        {
          entity[Q1[i]] = Number(editNode[editedField])/3;
          currentSum += Number(editNode[Q1[i]]);
          newSum +=entity[Q1[i]];
        }
      }
      else if ( Column =="Q2" )
      {
          // entity["April"] = Math.round( ( ( (Number(editNode[editedField])/3) * 100) / 100) );
          for (var i = 0; i < Q2.length; i++) 
        {
          entity[Q2[i]] = Number(editNode[editedField])/3;
          currentSum += Number(editNode[Q2[i]]);
          newSum +=entity[Q3[i]];
        }
      }
      else if (Column =="Q3" )
      {
        for (var i = 0; i < Q3.length; i++) 
        {
          entity[Q3[i]] = Number(editNode[editedField])/3;
          currentSum += Number(editNode[Q3[i]]);
          newSum +=entity[Q3[i]];
        }
      }
      else if (Column =="Q4" )
      {
        for (var i = 0; i < Q4.length; i++) 
        {
          entity[Q4[i]] = Number(editNode[editedField])/3;
          currentSum += Number(editNode[Q4[i]]);
          newSum +=entity[Q4[i]];
        }
      }
    }
      if(months.includes(Column))
      {
        entity[lineTotal] += Number(editNode[Column]);
      }
  }
  entity[lineTotal] = entity[lineTotal] - currentSum + newSum;
  debugger;
  return entity;
}


successCallback()
{
  // console.log("api create success");
  console.log("api update success");
}

errorCallback()
{
  console.log("api update failed");
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
  return <InputText type="text" defaultValue={props.node.data[field]}
      onBlur={(e) => this.onBlur(props,e)} onKeyDown={(e) =>
           this.onEditorValueChange(props,e)}
            />
}
rowClassName(node) {

  return { 'p-highlight_custom': (node.children && node.children.length > 0) };
}

vinEditor = (props: any) => {

  let field = props.field
  return this.inputTextEditor(props, field);
}

  
    render() {

      let coldef: any[] = this.createColDefinition();
      debugger;
      let inputData = {
        columns: coldef,
        context: this.props.context,
        IsUpdated: this.state.IsUpdated,
        monthDetails :this.state.monthDetails
    }

    let datanode: any[] = this.state.nodes;
        const dynamicColumns = Object.values(coldef).map((col, i) => {
            return <Column key={col.field} field={col.field} header={col.header} expander={col.expander} editor={col.isEditable ? this.vinEditor :undefined} style={{ width: '100px' }} headerClassName="p-col-d" />;
        });
    return (

        <div className="scrollbar scrollbar-primary">
            <div className="content-section implementation monthlyGrid">
                <DialogDemo {...inputData} />
                <TreeTable value={datanode} rowClassName={this.rowClassName} paginator={true} rows={5} scrollable style={{width: '1000px'}}  scrollHeight="400px">
                    {dynamicColumns}
                </TreeTable >
                <label style={{ float: "left", color: "#ab9999" }} >Total*: Line Total</label><br />
                <label style={{ float: "left", color: "#ab9999" }} >CFN*: Cash Flow Name</label><br />
                <label style={{ float: "left", color: "#ab9999" }} >Year*: Finacial Year</label><br />
            </div>
        </div>

    )
      }
} 