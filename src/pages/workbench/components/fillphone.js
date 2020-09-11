import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './fillphone.scss'
import useToast from './../../../uses/useToast';
import { useHistory } from 'react-router-dom';

const FillPhone = (props) => {

	const toast = useToast()
    const his = useHistory()
    const [phone, setPhone] = useState('')
    const inputRef = useRef()
    const isValid = /^1[3456789]\d{9}$/.test(phone)

    useEffect( () => {
        setTimeout(() => {
            inputRef.current.focus()
        }, 600)
    }, [])

    const onComplete = () => {
        if (!phone) {
            return toast.show("手机号码不能为空", 1000)
        } 
        if (phone.length !== 11) {
            return toast.show('请输入11位手机号码', 1000)
        }
        if(!isValid){ 
            return toast.show('手机号码有误', 1000)
        } 
        props.onComplete && props.onComplete(phone)
    }

    return (
       <div className="fill-phone-container" onClick={(e) => {
        e.nativeEvent.stopImmediatePropagation()
       }}>
           <hgroup className="title-group">
                <small>
                    为了能及时与您联系
                </small>
                <p>请告知我们您的手机号码</p>
           </hgroup>
            <form className="form">
                <input type="input" 
                    ref={inputRef}
                    autoFocus
                    maxLength={11}
                    onChange={(e) => {
                    setPhone(e.target.value) 
                }}></input>
            </form>
            <button 
                className="btn" 
                type="button" 
                style={!isValid ? {backgroundColor: '#cccccc'} : null}
                onClick={onComplete}>填写完毕</button>
            <div className="close" onClick={() => {
                props.onClose && props.onClose()
            }}>
                <i className="icon iconfont icondel"></i>
            </div>
       </div>
    )
}

export default FillPhone