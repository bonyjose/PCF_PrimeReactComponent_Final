import React from "react";
import { Column } from "primereact/column";
import { TreeTable } from "primereact/treetable";
import { InputText } from "primereact/inputtext";
import { DialogDemo } from "../Common/popupComponent"
import { IInputs, IOutputs } from "../../../generated/ManifestTypes"
import { Button } from "primereact/button";
import { Messages } from 'primereact/messages';
import LoadingOverlay from 'react-loading-overlay';
interface Props {
  data: any[];
  columns: any[];
  context: ComponentFramework.Context<IInputs>;
  IsUpdated: boolean;
  fileUpdated(boolean): any
  EntitySetName: string
}
interface State {
  SelectedLayout: string;
  nodes: [],
  sampledata: any,
  IsUpdated: boolean,
  coldef: any[],
  monthDetails: any,
  rowEditedKeyData: any[],
  rowEditedKey: [],
  loading: boolean,
  isSaved: boolean
}
export class QuarterlyComponent extends React.Component<Props, State> {
  public messages = React.createRef<any>();
  constructor(props: Props) {
    super(props);
    this.state = {
      nodes: [],
      sampledata: this.props,
      SelectedLayout: "Quarterly",
      IsUpdated: this.props.IsUpdated,
      coldef: [],
      monthDetails: [],
      rowEditedKeyData: [],
      rowEditedKey: [],
      loading: false,
      isSaved: false
    };

  }

  ParseToQuarter(month: any) {
    let months = month;
    let lineTot
    if (typeof (this.props.context.parameters) !== 'undefined') {
      lineTot = this.props.context.parameters.lineTotal.raw;
    }
    let product: any[] = Object.values(this.props.data);
    let data = Object.values(product);
   
    let i = 0;
    let q1 = 0;
    let q2 = 0;
    let q3 = 0;
    let q4 = 0;
    try {
      for (let columns of data) {
        if (typeof (columns[months[3]]) !== 'undefined' && columns[months[3]] !== null) {
          try {
            q1 = this.convertCurrency(columns[months[0]]) + this.convertCurrency(columns[months[1]]) + this.convertCurrency(columns[months[2]]);
            q2 = this.convertCurrency(columns[month[3]]) + this.convertCurrency(columns[months[4]]) + this.convertCurrency(columns[months[5]]);
            q3 = this.convertCurrency(columns[months[6]]) + this.convertCurrency(columns[months[7]]) + this.convertCurrency(columns[months[8]]);
            q4 = this.convertCurrency(columns[month[9]]) + this.convertCurrency(columns[months[10]]) + this.convertCurrency(columns[months[11]]);
          }
          catch {
          }
        }

        try {
          data[i].Q1 = q1 == 0 ? '' : "$" + q1.toFixed(2);
          data[i].Q2 = q2 == 0 ? '' : "$" + q2.toFixed(2);
          data[i].Q3 = q3 == 0 ? '' : "$" + q3.toFixed(2);
          data[i].Q4 = q4 == 0 ? '' : "$" + q4.toFixed(2);
          if (data[i][lineTot] !== null && typeof (data[i][lineTot]) !== 'undefined' && data[i][lineTot] !== "") {
            data[i][lineTot] = "$" + this.numberTryParse(data[i][lineTot]).toFixed(2);
          }
        }
        catch
        {
        }
        i++;
      }
    }
    catch {

    }
    return data;
  }

  numberTryParse(string) {
    var tempCur = Number(string.replace(/[^0-9.-]+/g, ""))
    var returnValue = 0;
    if (!isNaN(tempCur) && tempCur != null) {
      returnValue = tempCur;
    }
    return returnValue;
  }

  numberTryParseQuarter(string) {
    var returnValue = 0;
    if (!isNaN(string) && string != null && string != "") {
      returnValue = Number.parseFloat(string);
    }
    return returnValue;
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.props.IsUpdated) && (!this.state.IsUpdated)) {
      let months = this.createMonthDefinition();
      this.setState({ monthDetails: months });
      let QuarterData = this.ParseToQuarter(months);
      let data = this.createJsonTreestructure(QuarterData);
      let newNodes = JSON.parse(data);
      this.setState({ nodes: newNodes });
      this.setState({ IsUpdated: this.props.IsUpdated });
    }
    else if (prevProps.data != this.props.data) {
      let months = this.createMonthDefinition();
      this.setState({ monthDetails: months });
      let QuarterData = this.ParseToQuarter(months);
      let data = this.createJsonTreestructure(QuarterData);
      let newNodes = JSON.parse(data);
      this.setState({ nodes: newNodes });
      this.setState({ IsUpdated: this.props.IsUpdated });
    }
  }

  componentDidMount() {
    if (!this.state.IsUpdated || this.props.data.length > 0) {
      let months = this.createMonthDefinition();
      this.setState({ monthDetails: months });
      let QuarterData = this.ParseToQuarter(months);
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
    return month;
  }

  createJsonTreestructure = (QuarterData: any[]) => {
    let expandYear;
    if (typeof (this.props.context.parameters) !== 'undefined') {
      expandYear = this.props.context.parameters.expandYear.raw;
    }
    else {
      expandYear = "FinacialYear";
    }
    const yearHead = expandYear.toString();
    let product: any[] = Object.values(QuarterData);
    let cols = this.createfieldDef();
    let field = Object.values(cols).map(p => p.fieldName);
    let uniqYear = product.map(i => i[expandYear]);
    var uniqueItems = Array.from(new Set(uniqYear)).sort()
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

      data.map(p => {
        if (p[expandYear] === year) {
          let result = {};
          for (let k = 0; k <= column.length; k++) {

            currentKey = column[k];
            currentVal = p[currentKey];
            result[currentKey] = currentVal;
          }
          var childrenData = {};
          childrenData = {
            key: i.toString().concat('-', x.toString()),
            data: result,
            nodeKey: p.key
          }

          ChildResultArray[x] = childrenData;
          x++;
        }
      });
      let resultData = {
        key: i.toString(),
        data: {
          [expandYear]: year,
        },
        children: ChildResultArray
      }
      ResultArray.push(resultData);
    }
    return JSON.stringify(ResultArray);
  }

  createfieldDef() {
    let cols: any[] = Object.values(this.props.columns);
    let data = Object.values(cols);
    let i = 0;
    for (i = 0; i < 4; i++) {

      let row = {};
      row["fieldName"] = "Q" + this.numberTryParseQuarter(i + 1);
      cols.push(row);
    }
    return cols;

  }

  createColDefinition = (IsQuarterEdit: Boolean) => {
    let expandYear, ppr, lineTotal, cashFlow, EditViewEnabled;
    if (typeof (this.props.context.parameters) !== 'undefined') {
      expandYear = this.props.context.parameters.expandYear.raw;
      ppr = this.props.context.parameters.ppr.raw;
      lineTotal = this.props.context.parameters.lineTotal.raw;
      cashFlow = this.props.context.parameters.cashFlow.raw;
      EditViewEnabled = this.props.context.parameters.EditViewEnabled.raw;
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
          resultData = {
            field: p.fieldName, header: "Year", expander: true, isEditable: false
          }
          cols.push(resultData);
          break;
        case cashFlow:
          resultData = {
            field: p.fieldName, header: "Cash Flow", expander: expander, isEditable: false
          }
          cols.push(resultData);
          break;
        case ppr:
          resultData = {
            field: p.fieldName, header: "PPR", expander: expander, isEditable: false
          }
          cols.push(resultData);
          break;
        case lineTotal:
          resultData = {
            field: p.fieldName, header: "Total", expander: expander, isEditable: false
          }
          cols.push(resultData);
          break;
        default:
      }
    });
    resultData = {
      field: "Q1", header: "Quarter 1", expander: false, isEditable: IsQuarterEdit
    }
    cols.push(resultData);

    resultData = {
      field: "Q2", header: "Quarter 2", expander: false, isEditable: IsQuarterEdit
    }
    cols.push(resultData);

    resultData = {
      field: "Q3", header: "Quarter 3", expander: false, isEditable: IsQuarterEdit
    }
    cols.push(resultData);

    resultData = {
      field: "Q4", header: "Quarter 4", expander: false, isEditable: IsQuarterEdit
    }
    cols.push(resultData);
    let datas = this.sortByKey(Object.values(cols), 'expander');
    datas.push(datas.splice(3, 1)[0]); //moving total column to the last place.
    return datas;
  }

  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  }

  onEditorValueChange(props: any, event) {
    let data = this.messages.current.state.messages;
    if (data.length === 0) {
      this.messages.current.show({ sticky: true, severity: 'warn', detail: 'There are unsaved changes' });
    }

    let gridEntity: string = this.props.context.parameters.cashFlowDataSet.getTargetEntityType().toString();
    let nodes = this.state.nodes;
    this.props.fileUpdated(true);
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

  createApiUpdateRequest(editNode: any) {

    let months: any[] = [];
    if (this.state.monthDetails.length == 0) {
      this.createMonthDefinition();//Define Months
    }
    months = this.state.monthDetails;
    var entity = {};
    let total = 0;
    let lineTotal;
    if (typeof (this.props.context.parameters) !== 'undefined') {
      lineTotal = this.props.context.parameters.lineTotal.raw;
    }
    let January, February, March, April, May, June, July, August, September, October, November, December;
    for (let columns of this.props.columns) {

      if (columns.fieldName == "January") {
        January = columns.key;
      }
      else if (columns.fieldName == "February") {
        February = columns.key;
      }
      else if (columns.fieldName == "March") {
        March = columns.key;
      }
      else if (columns.fieldName == "April") {
        April = columns.key;
      }
      else if (columns.fieldName == "May") {
        May = columns.key;
      }
      else if (columns.fieldName == "June") {
        June = columns.key;
      }
      else if (columns.fieldName == "July") {
        July = columns.key;
      }
      else if (columns.fieldName == "August") {
        August = columns.key;
      }
      else if (columns.fieldName == "September") {
        September = columns.key;
      }
      else if (columns.fieldName == "October") {
        October = columns.key;
      }
      else if (columns.fieldName == "November") {
        November = columns.key;
      }
      else if (columns.fieldName == "December") {
        December = columns.key;
      }
    }
    for (let Column in editNode) {

      if (Column == "Q1") {
        var key = this.convert(editNode[Column]) / 3;;
        entity[January] = key;
        entity[February] = key;
        entity[March] = key;
        total = total + this.convert(editNode[Column]);
      }
      else if (Column == "Q2") {
        var key = this.convert(editNode[Column]) / 3;;
        entity[April] = key;
        entity[May] = key;
        entity[June] = key;
        total = total + this.convert(editNode[Column]);
      }
      else if (Column == "Q3") {
        var key = this.convert(editNode[Column]) / 3;;
        entity[July] = key;
        entity[August] = key;
        entity[September] = key;
        total = total + this.convert(editNode[Column]);
      }
      else if (Column == "Q4") {
        var key = this.convert(editNode[Column]) / 3;;
        entity[October] = key;
        entity[November] = key;
        entity[December] = key;
        total = total + this.convert(editNode[Column]);
      }
    }

    entity[lineTotal] = total;
    return entity;
  }

  isEmpty = (str) => {
    return (!str || 0 === str.length);
  }

  convert = (currency) => {
    var k, temp = "";
    for (var i = 0; i < currency.length; i++) {

      k = currency.charCodeAt(i);
      if (k > 47 && k < 58) {
        temp = currency.substring(i);
        break;
      }
    }
    if (temp != "") {
      temp = temp.replace(/, /, '');
    }

    return parseFloat(temp);
  }

  convertCurrency =(currency) => {
    return parseFloat(currency.substring(1));
  }

  findNodeByKey(nodes: any, key: any) {
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
    return <InputText keyfilter="money" defaultValue={props.node.data[field]}
      onChange={(e) =>
        this.onEditorValueChange(props, e)}
    />
  }
  rowClassName(node) {

    return { 'p-highlight_custom': (node.children && node.children.length > 0) };
  }

  vinEditor = (props: any) => {

    let field = props.field
    return this.inputTextEditor(props, field);
  }

  saveGrid(): void {
    this.messages.current.clear();
    let gridEntity: string = this.props.context.parameters.cashFlowDataSet.getTargetEntityType().toString();
    let gridrowKey = this.state.rowEditedKeyData;
    this.props.fileUpdated(false);
    let rowKeys: any[] = Object.values(gridrowKey);
    let field = Object.values(this.props.columns).map(p => p.fieldName);

    var uniqueKeys = Array.from(new Set(rowKeys))

    let nodes = this.state.nodes;
    let context: ComponentFramework.Context<IInputs>;
    context = this.props.context;
    let stateVariable = this;
    for (let i = 0; i < uniqueKeys.length; i++) {
      this.setState({ loading: true }, () => {
        setTimeout(() => {
          let rowKey = uniqueKeys[i];
          let editedNode = this.findNodeByKey(nodes, rowKey);
          let editedObject = this.createApiUpdateRequest(editedNode.data);
          var data = this.props.context.webAPI.updateRecord(gridEntity, editedNode.nodeKey, editedObject).then(function (result) {
            if (i === uniqueKeys.length - 1) {
              context.parameters.cashFlowDataSet.refresh();
              stateVariable.setState({ isSaved: true, loading: false, rowEditedKeyData: [] });
            }
          },
            function (result) {
              stateVariable.setState({ isSaved: false, loading: false });
            })
        }, 3000);
      });
    }

  }

  render() {
    let EditViewEnabled;
    if (typeof (this.props.context.parameters) !== 'undefined') {
      EditViewEnabled = this.props.context.parameters.EditViewEnabled.raw;
    }
    let isViewEditable: boolean;
    if (EditViewEnabled == "Quarterly") {
      isViewEditable = true;
    }
    else {
      isViewEditable = false;
    }
    let coldef: any[] = this.createColDefinition(isViewEditable);
    let inputData = {
      actualColDef: this.props.columns,
      columns: coldef,
      context: this.props.context,
      IsUpdated: this.state.IsUpdated,
      monthDetails: this.state.monthDetails,
      pannelType: "Q",
      isViewEditable: isViewEditable,
      EntitySetName: this.props.EntitySetName
    }

    let datanode: any[] = this.state.nodes;
    const dynamicColumns = Object.values(coldef).map((col, i) => {
      return <Column key={col.field} field={col.field} header={col.header} expander={col.expander} sortable={col.expander} editor={col.isEditable ? this.vinEditor : undefined} style={{ width: '100px' }} headerClassName="p-col-d" />;
    });
    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner>
        <div className="scrollbar scrollbar-primary">
          <Messages ref={this.messages} />
          <div className="content-section implementation monthlyGrid">
            <DialogDemo {...inputData} />
            <Button label="Save" disabled={!isViewEditable} className="saveBtn" icon="pi pi-save" onClick={() => this.saveGrid()} iconPos="left" />
            <TreeTable value={datanode} rowClassName={this.rowClassName} paginator={true} rows={5} scrollable style={{ width: 75 + "vw" }} scrollHeight="55vh" defaultSortOrder={-1} >
              {dynamicColumns}
            </TreeTable >
          </div>
        </div>
      </LoadingOverlay>

    )
  }
} 