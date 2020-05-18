import React, { Component, Props } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { DialogDemo } from "../Common/popupComponent";
import { IInputs, IOutputs } from "../../../generated/ManifestTypes"


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
    coldef: any[]

}
export class MonthlySummary extends Component<AppMonthProps, monthState>{

    constructor(props: AppMonthProps) {
        super(props);
        this.state = {
            nodes: [],
            sampledata: this.props.data,
            IsUpdated: this.props.IsUpdated,
            coldef: []
        };
    }

    componentDidUpdate(prevProps, prevState) {

        if ((this.props.IsUpdated) && (!this.state.IsUpdated)) {
            let data = this.createJsonTreestructure();
            let newNodes = JSON.parse(data);
            this.setState({ nodes: newNodes });
            this.setState({ IsUpdated: this.props.IsUpdated });
        }
    }
    componentDidMount() {

        if (!this.state.IsUpdated || this.props.data.length > 0) {
            let data = this.createJsonTreestructure();
            let newNodes = JSON.parse(data);
            this.setState({ nodes: newNodes })
        }
    }

    onEditorValueChange(props: any, value: any) {

        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        let editedNode = this.findNodeByKey(newNodes, props.node.key);
        editedNode.data[props.field] = value;
        this.setState({
            nodes: newNodes
        });
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
        if (!props.expander) {
            return <InputText type="text" value={props.node.data[field] ? props.node.data[field] : ""} onChange={(
                ev: React.ChangeEvent<HTMLInputElement>): void => {

                this.onEditorValueChange
                    (props, ev.target.value.toString())
            }} />;
        }
        else {
            return <label >
                {props.node.data[field] ? props.node.data[field] : ""}
            </label>
        }
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
        let resultData = {};
        let cols: any[];
        cols = [];
        Object.values(this.props.columns).map(p => {
            let expander: boolean = false;
            if (p.fieldName == "FinacialYear") {
                resultData = {
                    field: p.fieldName, header: "Year*", expander: true
                }
            }
            else if (p.fieldName == "CFNAME") {
                resultData = {
                    field: p.fieldName, header: "CFN*", expander: expander
                }
            }
            else if (p.fieldName == "LineTotal") {
                resultData = {
                    field: p.fieldName, header: "Total*", expander: expander
                }
            }
            else if (p.name.length > 2) {
                let name = p.name.replace(/\w+/g,
                    function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); });
                resultData = {
                    field: p.fieldName, header: name.substring(0, 3), expander: expander
                }
            }
            else {
                resultData = {
                    field: p.fieldName, header: p.name, expander: expander
                }
            }
            cols.push(resultData);

        });
        let datas = this.sortByKey(Object.values(cols), 'expander');
        this.setState({ coldef: datas });
    }
    sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
    createJsonTreestructure = () => {
        this.createColDefinition()
        let product: any[] = Object.values(this.props.data);
        let field = Object.values(this.props.columns).map(p => p.fieldName);
        let uniqyear = product.map(i => i.FinacialYear);
        var uniqueItems = Array.from(new Set(uniqyear))
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
                if (p.FinacialYear === year) {
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
        return JSON.stringify(ResultArray);
    }
    render() {
        const dynamicColumns = Object.values(this.state.coldef).map((col, i) => {
            return <Column key={col.field} field={col.field} header={col.header} expander={col.expander} editor={this.vinEditor} style={{ height: '3.5em' }} headerClassName="p-col-d" />;
        });
        return (

            <div>
                <div className="content-section implementation monthlyGrid">
                    <DialogDemo />
                    <TreeTable value={this.state.nodes} rowClassName={this.rowClassName} paginator={true} rows={5} resizableColumns={true} scrollable={true} scrollHeight="200px">
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