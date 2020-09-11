import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import './index.scss'

const Modal = (props) => {
    const { content, title, onConfirm, onCancel } = props
    
	return (
        <div className="modal">
             <header className="title">{title}</header>
                <p>{content}</p>
             <footer className="footer">
                <div onClick={onCancel}>取消</div>
                <div onClick={onConfirm}>确定</div>
             </footer>
        </div>
    )
}

export default Modal