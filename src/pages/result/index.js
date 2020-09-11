import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.scss'
import NavBar from './../../components/nav-bar'
import useToast from './../../uses/useToast'
import { useHistory, Redirect } from 'react-router-dom';
const Result = () => {
	const toast = useToast()
	const title = useRef('')
    const history = useHistory()
    const [canBack, setCanback] = useState(false)

    if (canBack) {
        return <Redirect to="/"></Redirect>
    }

    return (
        <div className="result-outer">
             <NavBar title="上传成功" 
             onGoBack={() => {
                setCanback(true)
             }}/>
             <div>
                 <i className="icon iconfont iconClouduploadstorage icon-upload"></i>
             </div>
            <h2 className="title">上传成功</h2>
            <div className="tip-wrapper">
                <p className="tip">图片已经上传成功</p>
                <p className="tip">中途有任何问题请及时与客服联系</p>
            </div>
            <button className="btn" onClick={() => {
                setCanback(true)
            }}>返回首页</button>
        </div>
    )
}

export default Result