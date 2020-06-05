import React, { Component, Props } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { DialogDemo } from "../Common/popupComponent";
import { IInputs, IOutputs } from "../../../generated/ManifestTypes"
import { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
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
    monthDetails: any[],
    rowEditedKeyData: any[],
    loading: boolean
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
            rowEditedKey: [],
            rowEditedKeyData: [],
            monthDetails: [],
            loading: false
        };

    }


    componentDidUpdate(prevProps, prevState) {

        if ((this.props.IsUpdated) && (!this.state.IsUpdated)) {
            let jsonData = this.createJsonTreestructure();
            this.setState({ nodes: jsonData });
            this.setState({ IsUpdated: this.props.IsUpdated });
        }
        if (this.state.isSaved) {
            let jsonData = this.createJsonTreestructure();
            this.setState({ nodes: jsonData, loading: false });
            this.setState({ isSaved: false });
        }

    }
    componentDidMount() {
        let jsonData = this.createJsonTreestructure();
        this.setState({ nodes: jsonData });
    }

    onEditorValueChange(props: any, event) {
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

    createApiUpdateRequest(editNode: any) {
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
        for (let Column in editNode) {
            entity[Column] = editNode[Column];
            if (months.includes(Column)) {

                if (isNaN(entity[lineTotal])) {
                    entity[lineTotal] = 0;
                }
                else if (isNaN(editNode[Column])) {
                    var cur = this.convert(editNode[Column]);
                    total = total + (cur);
                }
                else if (this.isEmpty(editNode[Column])) {
                    total = total + 0;
                }
                else {
                    total = total + (parseFloat(editNode[Column]));
                }

            }
        }
        entity[lineTotal] = total;
        return entity;
    }
    // Function to convert 
    convert = (currency) => {
        var k, temp;
        for (var i = 0; i < currency.length; i++) {

            k = currency.charCodeAt(i);
            if (k > 47 && k < 58) {
                temp = currency.substring(i);
                break;
            }
        }
        temp = temp.replace(/, /, '');
        return parseFloat(temp);
    }

    isEmpty = (str) => {
        return (!str || 0 === str.length);
    }
    successCallback() {
        // console.log("api create success");
        return console.log("api update success");
    }

    errorCallback() {
        return console.log("api update failed");
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

    createColDefinition = () => {


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
                    month.push(p.fieldName);
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
        return JSON.parse(JSON.stringify(ResultArray));

    }
    saveGrid(): void {
        debugger;

        let gridEntity: string = this.props.context.parameters.sampleDataSet.getTargetEntityType().toString();
        let gridrowKey = this.state.rowEditedKeyData;

        let rowKeys: any[] = Object.values(gridrowKey);
        let field = Object.values(this.props.columns).map(p => p.fieldName);

        var uniqueKeys = Array.from(new Set(rowKeys))

        let nodes = this.state.nodes;
        let context: ComponentFramework.Context<IInputs>;
        context = this.props.context;
        let stateVariable = this;
        for (let i = 0; i < uniqueKeys.length; i++) {
            debugger;

            this.setState({ loading: true }, () => {
                setTimeout(() => {
                    let rowKey = uniqueKeys[i];
                    let editedNode = this.findNodeByKey(nodes, rowKey);
                    let editedObject = this.createApiUpdateRequest(editedNode.data);
                    var data = this.props.context.webAPI.updateRecord(gridEntity, editedNode.nodeKey, editedObject).then(function (result) {
                        debugger;
                        context.parameters.sampleDataSet.refresh();
                        stateVariable.setState({ isSaved: true, loading: false });
                        // const index = uniqueKeys.indexOf(rowKey);
                        // if (index > -1) {
                        //     uniqueKeys.splice(index, 1);
                        //     stateVariable.setState({rowEditedKeyData:uniqueKeys})
                        // }
                    },
                        function (result) {
                            stateVariable.setState({ isSaved: false, loading: false });
                            // const index = uniqueKeys.indexOf(rowKey);
                            // if (index > -1) {
                            //     uniqueKeys.splice(index, 1);
                            //     stateVariable.setState({rowEditedKeyData:uniqueKeys})
                            // }
                        })
                }, 3000);
            });
        }

    }

    render() {
        debugger;
        let inputData = {

            columns: this.state.coldef,

            context: this.props.context,
            IsUpdated: this.state.IsUpdated
        }
        const { loading } = this.state;

        let spinnerClass;
        if (this.state.loading) {
            spinnerClass = "spinnerdisplayinline"
        }
        else {
            spinnerClass = "spinnerdisplayNone"
        }
        let coldef: any[] = this.createColDefinition();
        let datanode: any[] = this.state.nodes;
        const dynamicColumns = Object.values(coldef).map((col, i) => {
            return <Column key={col.field} field={col.field} header={col.header} expander={col.expander} editor={col.expander ? undefined : this.vinEditor} style={{ width: '100px' }} headerClassName="p-col-d" />;
        });
        return (
            <div className="scrollbar scrollbar-primary">
                <div className="content-section implementation monthlyGrid month">

                    <DialogDemo {...inputData} />
                    <Button label="Save" className="saveBtn" icon="pi pi-save" onClick={() => this.saveGrid()} iconPos="left" />
                    <div>
                        <TreeTable value={datanode} rowClassName={this.rowClassName} className="monthlyGrid" paginator={true} rows={5} scrollable style={{ width: 75 + "vw" }} scrollHeight="55vh">
                            {dynamicColumns}
                        </TreeTable >
                        {
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" className={spinnerClass} fill="#EEEEEE" />
                        }
                    </div>
                </div>
            </div>

        )
    }


}