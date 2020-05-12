import React, { Component, Props } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { DialogDemo } from "../Common/popupComponent";



const data = {
    data: [
        {
            "key": "0",
            "data": {
                "CFName": "",
                "PPR": "",
                "Year": "2020",
                "Jan": " ",
                "Feb": "",
                "Mar": "",
                "April": " ",
                "Jun": " ",
                "Jul": "",
                "Aug": "",
                "Sep": " ",
                "Oct": " ",
                "Nov": " ",
                "Dec": " ",
                "Total": " "
            },
            "children": [
                {
                    "key": "0-0",
                    "data": {
                        "CFName": "Sample",
                        "PPR": "CD1234",
                        "Year": "2020",
                        "Jan": "100 ",
                        "Feb": "",
                        "Mar": "",
                        "April": " ",
                        "Jun": "50 ",
                        "Jul": "",
                        "Aug": "",
                        "Sep": " ",
                        "Oct": " ",
                        "Nov": " ",
                        "Dec": " ",
                        "Total": "150 "
                    }
                },
                {
                    "key": "0-1",
                    "data": {
                        "CFName": "Sample",
                        "PPR": "CD1234",
                        "Year": "2020",
                        "Jan": " ",
                        "Feb": "",
                        "Mar": "",
                        "April": "500",
                        "Jun": " ",
                        "Jul": "",
                        "Aug": "",
                        "Sep": "10000 ",
                        "Oct": " ",
                        "Nov": " ",
                        "Dec": " ",
                        "Total": "10500 "
                    }
                }
            ]
        },
        {
            "key": "1",
            "data": {
                "CFName": "",
                "PPR": "",
                "Year": "2021",
                "Jan": " ",
                "Feb": "",
                "Mar": "",
                "April": " ",
                "Jun": " ",
                "Jul": "",
                "Aug": "",
                "Sep": " ",
                "Oct": "",
                "Nov": " ",
                "Dec": " ",
                "Total": ""
            },
            "children": [
                {
                    "key": "1-0",
                    "data": {
                        "CFName": "Sample",
                        "PPR": "CD1234",
                        "Year": "2021",
                        "Jan": " ",
                        "Feb": "",
                        "Mar": "25",
                        "April": " ",
                        "Jun": " ",
                        "Jul": "",
                        "Aug": "",
                        "Sep": " ",
                        "Oct": "25",
                        "Nov": " ",
                        "Dec": " ",
                        "Total": "50 "
                    }
                },
                {
                    "key": "1-1",
                    "data": {
                        "CFName": "Sample",
                        "PPR": "CD1234",
                        "Year": "2021",
                        "Jan": " ",
                        "Feb": "",
                        "Mar": "",
                        "April": "100",
                        "Jun": " ",
                        "Jul": "",
                        "Aug": "120",
                        "Sep": " ",
                        "Oct": " ",
                        "Nov": " ",
                        "Dec": " ",
                        "Total": " 220"
                    }
                }
            ]
        }
    ]
};

const response={
    "root": [
          {
            "key": "0-0",
            "data": {
              "CFName": "Sample",
              "PPR": "CD1234",
              "Year": "2020",
              "Jan": "100 ",
              "Feb": "",
              "Mar": "",
              "April": " ",
              "Jun": "50 ",
              "Jul": "",
              "Aug": "",
              "Sep": " ",
              "Oct": " ",
              "Nov": " ",
              "Dec": " ",
              "Total": "150 "
            }
          },
          {
            "key": "0-1",
            "data": {
              "CFName": "Sample",
              "PPR": "CD1234",
              "Year": "2020",
              "Jan": " ",
              "Feb": "",
              "Mar": "",
              "April": "500",
              "Jun": " ",
              "Jul": "",
              "Aug": "",
              "Sep": "10000 ",
              "Oct": " ",
              "Nov": " ",
              "Dec": " ",
              "Total": "10500 "
            }
          }
    ]
  }
type AppMonthProps = {
    data?: any;
}
type monthState = {
    nodes: any[]
}
export class MonthlySummary extends Component<AppMonthProps, monthState>{

    constructor(AppMonthProps) {
        super(AppMonthProps);
        this.state = {
            nodes: []
        };

    }

    componentDidMount() {
        let newNodes = JSON.parse(JSON.stringify(data.data));
        this.setState({ nodes: newNodes })
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
                    <TreeTable value={this.state.nodes} rowClassName={this.rowClassName}>
                        <Column field="Year" header="Year*" style={{ height: '3.5em' }} expander={true} />
                        <Column field="CFName" header="CFN*" style={{ height: '3.5em' }} />
                        <Column field="PPR" header="PPR" style={{ height: '3.5em' }} />

                        <Column field="Jan" header="Jan" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Feb" header="Feb" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Mar" header="Mar" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="April" header="April" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="May" header="May" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Jun" header="Jun" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Jul" header="Jul" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Aug" header="Aug" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Sep" header="Sep" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Oct" header="Oct" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Nov" header="Nov" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Dec" header="Dec" editor={this.vinEditor} style={{ height: '3.5em' }} />
                        <Column field="Total" header="Total*" editor={this.vinEditor} style={{ height: '3.5em' }} />
                    </TreeTable >

                    <label style={{ float: "left", color: "#ab9999" }} >Total*: Line Total</label><br />


                    <label style={{ float: "left", color: "#ab9999" }} >CFN*: Cash Flow Name</label><br />

                    <label style={{ float: "left", color: "#ab9999" }} >Year*: Finacial Year</label><br />



                </div>
                <DialogDemo />
            </div>

        )
    }
}