import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss'
import { useHistory } from 'react-router-dom';

const NavBar = (props) => {

    const his = useHistory()

    const renderLeft = () => {

        const leftView = (
                <i className="iconfont iconleft-arrow left-icon"/>
        )

        let container = props.leftView ? props.leftView : leftView
        return (
            <div className="left-contaienr" onClick={() => {
                if (props.onGoBack) {
                    props.onGoBack()
                } else {
                    his.goBack()
                }
            }}>
                {container}
            </div>
        )
    }

    return (
        <div className="nav-container">
            <div className="inner">
                {renderLeft()}
                <h1 className="title">{props.title}</h1>
           </div>
           <div className="placeholder"></div>
        </div>
      
    )
}

export default NavBar