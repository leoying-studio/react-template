import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import ReactDOM from 'react-dom';
import './index.scss'
import NavBar from './../../components/nav-bar'
import PictureStand from './components/pictureStand'
import { useHistory, useLocation } from 'react-router-dom';
import {useModal} from './../../uses/useModal'
import { UploadContext } from './uses/useUpload'
import useToast from '../../uses/useToast';

const Workbench = () => {
    const {state} = useLocation()
    const [title, setTitle] = useState(state.title)
    const containerRef = useRef(null)
    const [{localImages}] = useContext(UploadContext)
    const history = useHistory()
    const modal = useModal()   
    const toast = useToast() 

    const onGoBack = () => {
        if (localImages.length) {
            modal.show({
                title: '还有待提交的内容，确定返回吗？'
            }).then(() => {
                modal.close()
                history.goBack()
            }).catch(() => {
                modal.close()
            })  
        } else {
            history.goBack()
        }
    }


    return (
        <div className="outer" ref={containerRef}>
                <NavBar title="工作台" onGoBack={onGoBack}/>
                <form className="title-form">
                    <label className="title-label">书名</label>
                    <input 
                        onChange={(e) => {
                            if (e.target.value.length >= 15) {
                                toast.show('书名最多输入15个字')
                            }
                            setTitle(e.target.value)
                        }}
                        placeholder="请填写书名..."
                        value={title}
                        maxLength={15}
                        type="text" 
                        name="title" 
                        id="male" 
                        className="title-input" />
                </form>
                <PictureStand title={title} id={state.id}/>    
        </div>
    )
}

export default Workbench
