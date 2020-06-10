import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App,Props,State } from './App';
export class PCFReactElementComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private childData:[];
	private notifyOutputChanged: () => void;
	private theContainer: HTMLDivElement;	_labelElement: HTMLElement;
	private theContext: ComponentFramework.Context<IInputs>;
	// private props: IProps = { value : "", onChange : this.notifyChange.bind(this) };

	private _props: Props = {
		data: [],
		columns: [],
		onChange : this.notifyChange.bind(this),
		context: this.theContext,
		IsUpdated:false
	}

	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this.notifyOutputChanged = notifyOutputChanged;
		// this.props.numberOfFaces = context.parameters.numberOfFaces.raw || 3;
		this.theContainer = container;
		this._props.data = context.parameters.sampleDataSet;
		// let arraData=this._props.data ;
		// context.parameters.sampleDataSet.paging.setPageSize(50);
		// const dataSet = context.parameters.sampleDataSet;
		// let datasetColumns: any[] = this._columns(dataSet);
		// let dataItems: any[] = this._items(dataSet, datasetColumns);
		// this._props.data = dataItems;
		// this._props.columns = datasetColumns;
		
		debugger;

	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if (!context.parameters.sampleDataSet.loading) 
		{
			if(context.parameters.sampleDataSet.paging != null && context.parameters.sampleDataSet.paging.hasNextPage == true) 
			{
			//set page size
				context.parameters.sampleDataSet.paging.setPageSize(100);
				//load next paging
				context.parameters.sampleDataSet.paging.loadNextPage();
			} 
			else 
			{
				const dataSet = context.parameters.sampleDataSet;
				// dataSet.paging.setPageSize(50);

				let datasetColumns: any = this._columns(dataSet);
				let dataItems: any = this._items(dataSet, datasetColumns);

				console.log(dataItems);
				this._props.data =dataItems;
				this._props.columns =datasetColumns;
				this._props.context=context;
				const element = React.createElement(
					App ,
					this._props
				);
				ReactDOM.render(element ,
					this.theContainer
				);
			} 
		}
	}

	// this event will collect the modified grid array from child react component 
	notifyChange(value:[]){

		this.childData = value;
		console.log(this.childData);
		this.notifyOutputChanged();
	}
	ContextSetChange(){
	return this.theContext;
	}
	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

	
	/********** PRIVATE PROPERTIES & FUNCTIONS **********/

	// Get the columns from the dataset
	private _columns = (ds: DataSet): any[] => {
		let dataSet = ds;
		let iColumns: any[] = [];

		for (var column of dataSet.columns) {

			let iColumn: any = {
				key: column.name,
				name: column.displayName,
				fieldName: column.alias,
				dataType:column.dataType,
				currentWidth: column.visualSizeFactor,
				data: { isPrimary: column.isPrimary },
				minWidth: column.visualSizeFactor,
				maxWidth: column.visualSizeFactor,
				isResizable: true,
				sortAscendingAriaLabel: 'A to Z',
				sortDescendingAriaLabel: 'Z to A',
				className: 'detailList-cell',
				headerClassName: 'detailList-gridLabels',
				isPrimary: column.isPrimary
				
			}


			 if (column.dataType === 'SingleLine.Text') {
				iColumn.dataType = "Number";
			}
			else if (column.dataType === 'SingleLine.Phone') {
				iColumn.dataType = "Phone";
			}
			else if ((column.dataType === 'Currency')||(column.dataType === 'Decimal') ||(column.dataType.startsWith("Whole")))
			{
				iColumn.dataType = "Numeric";
			}
			else
			{
				iColumn.dataType = "column.dataType";
			}

			let isSorted = dataSet?.sorting?.findIndex(s => s.name === column.name) !== -1 || false;
			iColumn.isSorted = isSorted;
			if (isSorted) {
				iColumn.isSortedDescending = dataSet?.sorting?.find(s => s.name === column.name)?.sortDirection === 1 || false;
			}

			iColumns.push(iColumn);
		}
		return iColumns;
	}

	// Get the items from the dataset
	private _items = (ds: DataSet, _columns: any[]) => {
		let dataSet = ds;

		var resultSet = dataSet.sortedRecordIds.map(function (key) {
			var record = dataSet.records[key];
			var newRecord: any = {
				key: record.getRecordId()
			};

			for (var column of _columns) {
				newRecord[column.key] = record.getFormattedValue(column.key);
				
			}

			return newRecord;
		});

		return resultSet;
	}

	private navigateToPage(pageCommand: string): void {
		switch (pageCommand) {
			case 'next':
				if (this.theContext.parameters.sampleDataSet.paging.hasNextPage) {
					this.theContext.parameters.sampleDataSet.paging.loadNextPage();
				}
				break;
			case 'previous':
				if (this.theContext.parameters.sampleDataSet.paging.hasPreviousPage) {
					this.theContext.parameters.sampleDataSet.paging.loadPreviousPage();
				}
				break;
		}
	}
}