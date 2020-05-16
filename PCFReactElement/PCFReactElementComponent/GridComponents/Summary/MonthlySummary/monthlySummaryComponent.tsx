import React, { Component, Props } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { DialogDemo } from "../Common/popupComponent";
import { IInputs, IOutputs } from "../../../generated/ManifestTypes"


type AppMonthProps = {

    data: any[];
    columns?: any[];
    context: ComponentFramework.Context<IInputs>;
    IsUpdated:boolean
}
type monthState = {
    nodes: [],
    sampledata: any[],
    conext: ComponentFramework.Context<IInputs>
    IsUpdated:boolean

}
export class MonthlySummary extends Component<AppMonthProps, monthState>{

    constructor(props: AppMonthProps) {
        super(props);
        this.state = {
            nodes: [],
            sampledata: this.props.data,
            conext: this.props.context,
            IsUpdated:this.props.IsUpdated
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

        if (!this.state.IsUpdated||this.props.data.length>0) {
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



    createJsonTreestructure = () => {
        let product: any[] = Object.values(this.props.data);
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
                           // [a]: p[a],
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
        console.log(JSON.stringify(ResultArray));

        return JSON.stringify(ResultArray);

    }
    render() {
        return (

            <div>
                <div className="content-section implementation"> 
                <DialogDemo />
                    <TreeTable value={this.state.nodes} rowClassName={this.rowClassName} paginator={true} rows={1}>
                        <Column field="FinacialYear" header="Year*" style={{ height: '3.5em' }} expander={true} />
                        <Column field="CFNAME" header="CFN*" style={{ height: '3.5em' }} />
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
                        <Column field="LineTotal" header="Total*" editor={this.vinEditor} style={{ height: '3.5em' }} />
                    </TreeTable >

                    <label style={{ float: "left", color: "#ab9999" }} >Total*: Line Total</label><br />


                    <label style={{ float: "left", color: "#ab9999" }} >CFN*: Cash Flow Name</label><br />

                    <label style={{ float: "left", color: "#ab9999" }} >Year*: Finacial Year</label><br />



                </div>

            </div>

        )
    }
}