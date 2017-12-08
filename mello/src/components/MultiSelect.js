
import React, { Component } from 'react';
import Select from 'react-select'
import 'react-select/dist/react-select.css';

export default class MultiSelect extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const FLAVOURS = [
			{ label: 'Chocolate', value: 'chocolate' },
			{ label: 'Vanilla', value: 'vanilla' },
			{ label: 'Strawberry', value: 'strawberry' },
			{ label: 'Caramel', value: 'caramel' },
			{ label: 'Cookies and Cream', value: 'cookiescream' },
			{ label: 'Peppermint', value: 'peppermint' },
		];

		return (
			<Select
				closeOnSelect={false}
				disabled={false}
				multi
				onChange={(value) => this.props.handleSelectChange(value)}
				options={this.props.options}
				removeSelected={true}
				simpleValue
				value={this.props.selected}
			/>
		)
	}
}