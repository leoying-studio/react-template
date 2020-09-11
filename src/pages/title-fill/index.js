import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.scss'
import NavBar from './../../components/nav-bar'
import useToast from './../../uses/useToast'
import { useHistory, useLocation } from 'react-router-dom';
const TitleFill = () => {

	const toast = useToast()
	const title = useRef('')
	const his = useHistory()
	const location = useLocation()
	const inputRef = useRef(null)

	useEffect(() => {
		setTimeout(() => {
			inputRef.current && inputRef.current.focus()
		}, 600)
	}, [])

	const onNextPage = () => {
		if (!title.current) {
			return toast.show('未填写书名', 1000)
		}

		if (title.current.length > 20) {
			return toast.show('书名最多20个字', 1000)
		}

		const containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)  (\<)(\>)(\?)(\)]+/);  
		if (containSpecial.test(title.current)) {
			return toast.show('书名暂不支持特殊字符', 1000)
		}
		
		his.push('workbench', {
			...location.state,
			title: title.current
		})
	}

    return (
       <div className="titlefill-outer">
            <NavBar title="填写书名"/>
			<div className="title-wrapper">
				<h2 className="title">可以给书起个名字</h2>
				<small className="tip">书名不超过15个字</small>
			</div>
			<form className="form-container">
				<div className="input-wrapper">
					<input 
						ref={inputRef}
						autoFocus
						className="text-input" 
						maxLength={15}
						placeholder="请输入" 
						onChange={(e) => {
							title.current = e.target.value
							if (title.current.length >= 15) {
								toast.show('书名最多输入15个字')
							}
						}}></input>
				</div>

				<button className="btn" type="button" onClick={onNextPage}>填写完毕，开始上传照片</button>
				<p className="btn-tip" onClick={() => {
						his.push('workbench', {
							...location.state,
							title: ''
						})
				}}>不写书名，上传照片</p>
			</form>
       </div>
    )
}

export default TitleFill