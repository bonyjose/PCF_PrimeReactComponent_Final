import React, { Component, Props } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { DialogDemo } from "../Common/popupComponent";
import { IInputs, IOutputs } from "../../../generated/ManifestTypes"
import { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button';

type AppMonthProps = {
    data: any[];
    columns: any[];
    context: ComponentFramework.Context<IInputs>;
    IsUpdated: boolean
}
type monthState = {
    nodes: [],
    sampledata: any[],
    IsUpdated: boolean,
    coldef: any[],
    isSaved: boolean,
    gridResponsiveWidth: number;
    rowEditedKey: [],
    rowEditedData : []
}

export class MonthlySummary extends Component<AppMonthProps, monthState>{
    public InputDataNodes:any[];
    constructor(props: AppMonthProps) {
        
        super(props);

   
        this.state = {
            nodes: [],
            sampledata: this.props.data,
            IsUpdated: false,
            coldef: [],
            isSaved: false,
            gridResponsiveWidth: 0,
            rowEditedKey : [],
            rowEditedData :[]
        };

    }
  

    componentDidUpdate(prevProps, prevState) {

        if ((this.props.IsUpdated) && (!this.state.IsUpdated)) {
            this.InputDataNodes=this.createJsonTreestructure();
            this.setState({ IsUpdated: this.props.IsUpdated });
        }

    }
    componentDidMount() {
        debugger;
        if (!this.state.IsUpdated || this.props.data.length > 0) {
            this.InputDataNodes=this.createJsonTreestructure();
        }
       
    }

    onEditorValueChange(props: any, event) {
        debugger;
        let gridEntity: string = this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
        let nodes =this.InputDataNodes;
        let editedNode = this.findNodeByKey(nodes, props.node.key);
        editedNode.data[props.field] = event.target.value;
    

        var rowEdited =Array();
        rowEdited  = this.state.rowEditedKey ;
        rowEdited.push(props.node.nodeKey);

        
       
        editedNode.data[props.field] = event.target.value;
        let editedField = props.field;
        let editedObject = this.createApiUpdateRequest(editedNode.data, editedField);

        this.props.context.webAPI.updateRecord(gridEntity,editedNode.nodeKey,editedObject).then(this.successCallback,this.errorCallback);
        try{
            this.props.context.parameters.sampleDataSet.refresh();
        }
        catch (Error)   
        {  
          console.log(Error.message);  
        }  
        this.forceUpdate();


        var newStateArray =Array();
         newStateArray = this.state.rowEditedData;
        newStateArray.push(editedObject);

        this.setState({ rowEditedKey : rowEdited as any})
        this.setState({ rowEditedData : newStateArray as any})
        console.log(this.state.rowEditedData);
        debugger;

      //  this.props.parentCallback;
    }

    onBlur = (props: any, event) => {
        // debugger;
        // let gridEntity: string = this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
        // let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        // let editedNode = this.findNodeByKey(newNodes, props.node.key);
        // editedNode.data[props.field] = event.target.value;
        // this.setState({
        //     nodes: newNodes
        // });

        // let editedField = props.field;
        // let editedObject = this.createApiUpdateRequest(editedNode.data, editedField);
        // console.clear();
        // console.log(editedObject);
        // this.props.context.webAPI.updateRecord(gridEntity, editedNode.nodeKey, editedObject).then(this.successCallback, this.errorCallback);
        // try {
        //     this.props.context.parameters.sampleDataSet.refresh();
        // }
        // catch (Error) {
        //     console.log(Error.message);
        // }
        // this.forceUpdate();
    }

    createApiUpdateRequest(editNode: any, editedField: string) {
        debugger;
        let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        var entity = {};
        let lineTotal;
        if (typeof (this.props.context.parameters) !== 'undefined') {
            lineTotal = this.props.context.parameters.lineTotal.raw;
        }
        for (let Column in editNode) {
            if ((Column == editedField)) {
                entity[Column] = Number(editNode[editedField]);
            }
            entity[lineTotal] =0;
            if(months.includes(Column))
            {
              entity[lineTotal] += Number(editNode[Column]);
            }
        }
        return entity;
    }

    successCallback() {
        // console.log("api create success");
        console.log("api update success");
    }

    errorCallback() {
        console.log("api update failed");
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
        return <InputText type="text" defaultValue={props.node.data[field]}
            
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

    createColDefinition=()=> {


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
        cols = [];
        Object.values(this.props.columns).map(p => {
            let expander: boolean = false;
            switch (p.fieldName) {
                case expandYear:
                    resultData = {
                        field: p.fieldName, header: "Year", expander: true
                    }
                    cols.push(resultData);
                    break;
                case cashFlow:
                    resultData = {
                        field: p.fieldName, header: "Cash Flow", expander: expander
                    }
                    cols.push(resultData);
                    break;
                case ppr:
                    resultData = {
                        field: p.fieldName, header: "PPR", expander: expander
                    }
                    cols.push(resultData);
                    break;
                case lineTotal:
                    resultData = {
                        field: p.fieldName, header: "Total", expander: expander
                    }
                    cols.push(resultData);
                    break;
                default:
                    resultData = {
                        field: p.fieldName, header: p.name, expander: expander
                    }
                    cols.push(resultData);
                    break;
            }
        });
        let datas = this.sortByKey(Object.values(cols), 'expander');
      
        return datas;
    }

    sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
    createJsonTreestructure = () => {
debugger;
        let expandYear;
        if (typeof (this.props.context.parameters) !== 'undefined') {
            expandYear = this.props.context.parameters.expandYear.raw;
        }
        else {
            expandYear = "FinacialYear";
        }
        const yearHead = expandYear.toString();
       
        let product: any[] = Object.values(this.props.data);
        let field = Object.values(this.props.columns).map(p => p.fieldName);
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

            data.map(p => {
                if (p[expandYear] === year) {
                    let result = {};
                    for (let k = 0; k <= column.length; k++) {
                        
                        currentKey = column[k];
                        currentVal = p[currentKey];
                        result[currentKey] = currentVal;
                    }
                    var childrenData={};
                     childrenData = {
                        key: i.toString().concat('-', x.toString()),
                        data: result,
                        nodeKey: p.key
                    } 
                 
                    ChildResultArray[x]=childrenData;
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
        return JSON.parse(JSON.stringify(ResultArray));     
      
    }
    saveGrid(): void {
        debugger;
        let gridEntity: string = this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
        let gridrowKey = this.state.rowEditedKey;
        let gridrowKeyData = this.state.rowEditedData;
        for (let i = 0; i < gridrowKey.length; i++)
        {
            let rowKey = gridrowKey[i];
            let rowkeyData =  gridrowKeyData[i];
            this.props.context.webAPI.updateRecord(gridEntity, rowKey, rowkeyData).then(this.successCallback, this.errorCallback);
        }
        try {
            this.props.context.parameters.sampleDataSet.refresh();
        }
        catch (Error) {
            console.log(Error.message);
        }
    }
     refreshPage=()=> {
        window.location.reload(false);
      }

    render() {
        debugger;
        let inputData = {

            context: this.props.context,
            IsUpdated: this.state.IsUpdated
        }
        
        let coldef:any[]=this.createColDefinition();
        let datanode:any[]=this.InputDataNodes;
        const dynamicColumns = Object.values(coldef).map((col, i) => {
            return <Column key={col.field} field={col.field} header={col.header} expander={col.expander} editor={col.expander ? undefined : this.vinEditor} style={{ width: '100px' }} headerClassName="p-col-d" />;
        });
        return (

            <div className="scrollbar scrollbar-primary">
                <div className="content-section implementation monthlyGrid month">
                    <DialogDemo {...inputData} />
                    <TreeTable value={datanode} rowClassName={this.rowClassName} className="monthlyGrid" paginator={true} rows={5} scrollable style={{ width: 75+"vw" }} scrollHeight="55vh">
                        {dynamicColumns}
                    </TreeTable >
                    <Button label="Save" className="addnewBtn" icon="pi pi-external-link" onClick={() => this.saveGrid()} iconPos="left" />

                </div>
            </div>

        )
    }
   
}