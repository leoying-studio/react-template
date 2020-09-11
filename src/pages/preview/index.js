import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.scss'
import NavBar from './../../components/nav-bar'
import useToast from './../../uses/useToast'
import { useHistory, useLocation } from 'react-router-dom';
import { useEvent } from '../../uses/useEvent';
const maxLen = 400
const Preview = () => {
	const toast = useToast()
	const his = useHistory()
	const {state = {}} = useLocation()
	const [title, setTitle] = useState(state.remarks[state.key] || '')
	const {emit} = useEvent()
	const inputRef = useRef('')

	useEffect(() => {
		setTimeout(() => {
			inputRef.current && inputRef.current.focus()
		}, 600)
    }, [])

    const onBack = () => {
		his.goBack()
    }
    
    const onSubmitSave = () => {
		emit('set-remark', state.key, title)
		his.goBack()
    }

    return (
       <div className="outer-preview">
            <NavBar title="添加备注"/>
			<img src={state.img || 'https://dummyimage.com/300'} 
			className="preview-img" 
			alt=""></img>
			<form className="form-container">
					<textarea 
						ref={inputRef}
                        autoFocus
						multiple
						value={title}
						className="text-input" 
						maxLength={maxLen}
						placeholder="可以在这里给照片加些话" 
						onChange={(e) => {
							setTitle(e.target.value)
						}}></textarea>
						<footer>
							{title.length} / {maxLen}
						</footer>
			</form>
            <footer className="btn-wrapper">
                <button className="btn" type="button" onClick={onBack}>返回工作台</button>
                <button className="btn" type="button" onClick={onSubmitSave}>保存</button>
            </footer>
       </div>
    )
}

export default Preview