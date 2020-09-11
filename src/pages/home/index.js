import React from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom';
import NavBar from './../../components/nav-bar'
import Indicator from './../../components/indicator'
import useList from './../../uses/useList'
import useToast from './../../uses/useToast'
import './index.scss'

const Home = (props) => {
    const [list, status] = useList({fn: 'getTempList', onError: () => {}})
    const toast = useToast()
    const his = useHistory();   
    
    const renderItem = (item, index) => {
        return (
            <div className="list-item" key={item.id} onClick={() => {
               his.push(`tempdetail`, {
                  ...item
               });
            }}>   
                <img 
                    alt={item.name}
                    className="img"
                    src={item.image}></img> 
                <footer className="list-item-footer">
                <em className="content">{item.name}</em>   
                </footer>
            </div>
        )
    }

    return (
       <section className="outer">
            <NavBar leftView={<div/>} title="充电猴印画社"/>
            {list.map(renderItem)}
            {
                status === 'noMore' ? <p className="tips">没有更多了</p> :
                <Indicator></Indicator>
            }
       </section> 
    )
}

export default Home