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
            if (this.state.gridResponsiveWidth == 0) {
                this.resizeGrid();
            }
            let data = this.createJsonTreestructure();
            let newNodes = JSON.parse(data);
            this.setState({ nodes: newNodes, IsUpdated: true });
            return
        }
        else {

            if (this.state.IsUpdated && this.state.isSaved) {
                if (this.state.gridResponsiveWidth == 0) {
                    this.resizeGrid();
                }
                let data = this.createJsonTreestructure();
                let newNodes = JSON.parse(data);
                this.setState({ nodes: newNodes, IsUpdated: true, isSaved: false });
            }
        }
    }
    componentDidMount() {


        if (!this.state.IsUpdated || this.props.data.length > 0) {
            if (this.state.gridResponsiveWidth == 0) {
                this.resizeGrid();
            }
            let data = this.createJsonTreestructure();
            let newNodes = JSON.parse(data);
            this.setState({ nodes: newNodes })
        }
    }

    resizeGrid = () => {

        const tabDiv = document.querySelector(".p-tabview-panels")
        if (!tabDiv) {
            return {};
        }
        const tabDivrect = tabDiv.getBoundingClientRect();
        let tabDivwidth = tabDivrect.width
        const addnewDiv = document.querySelector(".addNewButton")
        if (!addnewDiv) {
            return {};
        }
        const addnewDivrect = tabDiv.getBoundingClientRect();
        const addnewDivwidth = addnewDivrect.width
        var extraWidth = 12;

        let diffaddnewDivwidth = addnewDivwidth - extraWidth;


        this.setState({ gridResponsiveWidth: (76) })

    }

    onEditorValueChange(props: any, event) {
        debugger;
        let gridEntity: string = this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        let editedNode = this.findNodeByKey(newNodes, props.node.key);
        editedNode.data[props.field] = event.target.value;
        // this.setState({
        //     nodes: newNodes
        // });

     

        var rowEdited =Array();
        rowEdited  = this.state.rowEditedKey ;
        rowEdited.push(props.node.nodeKey);

        
        console.log(this.state.rowEditedKey);
        debugger;
        editedNode.data[props.field] = event.target.value;
        let editedField = props.field;
        let editedObject = this.createApiUpdateRequest(editedNode.data, editedField);
        var newStateArray =Array();
         newStateArray = this.state.rowEditedData;
        newStateArray.push(editedObject);
        this.setState({
            nodes: newNodes
        });
        this.setState({ rowEditedKey : rowEdited as any})
        this.setState({ rowEditedData : newStateArray as any})
        console.log(this.state.rowEditedData);
        debugger;
        // this.forceUpdate();
        // this.props.parentCallback;
    }

    onBlur = (props: any, event) => {
        debugger;
        let gridEntity: string = this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        let editedNode = this.findNodeByKey(newNodes, props.node.key);
        editedNode.data[props.field] = event.target.value;
        this.setState({
            nodes: newNodes
        });

        let editedField = props.field;
        let editedObject = this.createApiUpdateRequest(editedNode.data, editedField);
        console.clear();
        console.log(editedObject);
        this.props.context.webAPI.updateRecord(gridEntity, editedNode.nodeKey, editedObject).then(this.successCallback, this.errorCallback);
        try {
            this.props.context.parameters.sampleDataSet.refresh();
        }
        catch (Error) {
            console.log(Error.message);
        }
        this.forceUpdate();
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

    createColDefinition() {
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

        debugger;
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
        this.setState({ coldef: datas });
        console.log(datas);
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
        this.createColDefinition()
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
                    [expandYear]: year,
                },
                children: ChildResultArray
            }
            ResultArray.push(resultData);
        }
        console.log([expandYear]);
        console.log(ResultArray);
        console.log("Data:", product);
        return JSON.stringify(ResultArray);
    }



    render() {

        let inputData = {
            // data: this.state.products,
            // columns: this.state.columns,
            context: this.props.context,
            IsUpdated: this.state.IsUpdated
        }
        const dynamicColumns = Object.values(this.state.coldef).map((col, i) => {
            return <Column key={col.field} field={col.field} header={col.header} expander={col.expander} editor={col.expander ? undefined : this.vinEditor} style={{ width: '100px' }} headerClassName="p-col-d" />;
        });
        return (

            <div className="scrollbar scrollbar-primary">
                <div className="content-section implementation monthlyGrid month">
                    <DialogDemo {...inputData} />
                    <TreeTable value={this.state.nodes} rowClassName={this.rowClassName} paginator={true} rows={5} scrollable style={{ width: this.state.gridResponsiveWidth + "vw" }} scrollHeight="55vh">
                        {dynamicColumns}
                    </TreeTable >
                    <Button label="Save" className="addnewBtn" icon="pi pi-external-link" onClick={() => this.saveGrid()} iconPos="left" />

                </div>
            </div>

        )
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
}