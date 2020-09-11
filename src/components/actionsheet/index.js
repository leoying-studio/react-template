import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.scss'
import { useEvent } from 'uses/useEvent';

const ActionSheet = ({menus, onSelect, onCancel, close}) => {

	const renderItem = () => {
		return menus.map((item, index) => {
			return 	<div 
				key={item.value || index}
				className="menu-item" onClick={() => {
				onSelect && onSelect(item, index)
			}}>{item.text}</div>
		})
	}

	return (
		<div className="actionsheet-container">
				<div className="menu-wrapper">
					{renderItem()}
				</div>
				<footer className="footer" onClick={() => onCancel && onCancel()}>
						取消
				</footer>
	
		</div>
	)
}

ActionSheet.defaultProps = {
	menus: [{
		text: 'first'
	}]
}

export default ActionSheet