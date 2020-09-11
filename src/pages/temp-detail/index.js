import React, { useMemo } from 'react';
import ReactDOM, { render } from 'react-dom';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import './index.scss'
import NavBar from '../../components/nav-bar';

const TempDetail = () => {
    const params = useParams()
    const his = useHistory()
    const location = useLocation()
    const current = location.state
    const {text = [], images = []} = current.content || {}

    const renderImages = () => {
        return (
            <div className="imgs-list-container" >   
                {
                    images.map((item, index) => {
                        return (
                            <img src={item} width="100%" className="img-item" key={index} alt=""></img>
                        )
                    })
                }
            </div>
        )
    }

    const renderTexts = () => {
        return (
           <div className="text-wrapper">
               {
                   text.map((item, index) => {
                       return (
                       <p className="text" key={index}>{item}</p>
                       )
                   })
               }
           </div>
        )
    }

    return (
        <div className="outer-container">
            <NavBar title={current.name}/> 
            {renderImages()}
            {renderTexts()}
            <div className="btn-action" onClick={() => {
                his.push('/titlefill', {
                    id:current.id
                })
            }}>
                立即制作
            </div>
        </div>
    )
}

export default TempDetail