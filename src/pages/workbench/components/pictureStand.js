import React, { useMemo, useState, useCallback, useEffect, useRef, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { UploadContext } from './../uses/useUpload'
import PictureRow from './pictureRow'
import Api from './../../../services/request'
import useToast from './../../../uses/useToast'
import FillPhone from './../components/fillphone'
import useOverlay from './../../../uses/useOverlay'
import {PictureStandContext} from './../uses/usePictureStand'
import { useHistory } from 'react-router-dom';
import { useEvent } from '../../../uses/useEvent';
import { GlobalState } from '../../common/state';
import Indictor from '../../../components/indicator';

function PictureStand({title, id}) {
	const toast = useToast()
    const overlay = useOverlay()
	const [deletable, setDeleteable] = useState(false)
	const [uploadInfo, uploadEvents, clear] = useContext(UploadContext)
	const history = useHistory()
	const {on, remove} = useEvent()
	const remarkRef = useRef(GlobalState.remark || {})
	const lockRef = useRef(false)

	useEffect(() => {
		remove('set-remark')
		on('set-remark', ([key, value]) => {
			remarkRef.current[key] = value
			GlobalState.remark = {...remarkRef.current}
		})
	}, [on, remove])

	const onRemove = (data) => {
		delete remarkRef.current[data.key]
		uploadEvents.onRemoveImg(data)
	}


	useEffect(() => {
		if (history.action === 'PUSH') {
			GlobalState.remark = null	
			remarkRef.current = {}
			clear()
		}
	}, [history.action, clear])

	useEffect(() => {
		if (!uploadInfo.localImages.length) {
			setDeleteable(false)
		}
	}, [uploadInfo.localImages])

	function onReUpload() {
		uploadEvents.actionUploadImage()
	}

	function onPressImg(item, index) {
		if (deletable) {
			return toast.show('请确认完成编辑状态后添加备注')
		}
		history.push('/preview', {
			...item,
			remarks: {
				...remarkRef.current
			}
		})
	}

	function onDragStart(result) {
		console.log(result)
	}
	  
	function onDragEnd(result) {
		if (!result.destination) {
		  return;
		}
		const getIndex = function(key) {
			const {index, droppableId} = result[key]
			return droppableId * 3 + index
		  }
		const targetIndex = getIndex('destination')
		const sourceIndex = getIndex('source')
		if (targetIndex === sourceIndex) {
		  return;
		}
		uploadEvents.onReorder(sourceIndex, targetIndex)
	}

	const onSubmit= () => {
		const {imageUrlRef,pictureSource } = uploadInfo

		if (!title) {
			return toast.show('请填写书名', 1000)
		}
		if (!pictureSource.length) {
			return toast.show('您还没有选择照片哦~', 1000)
		}
		if (deletable) {
			return toast.show('当前照片为编辑状态，请确认完成')
		}

        overlay.show( <FillPhone
             onClose={overlay.close} 
             onComplete={(phone) => {
				if (lockRef.current) {
					return toast.show("正在提交，请稍后...")
				}
			
                const material = Array.from(imageUrlRef.current.values())
                if (!material.length) {
                    return toast.show('还没有已上传完成的照片哦', 1000)
				}
				let remark = Array(material.length).fill('')
				const keys = Array.from(imageUrlRef.current.keys())
				Object.entries(remarkRef.current).forEach(([k, v]) => {
					const i = keys.findIndex(item => item === Number(k))
					if (i > -1) {
						remark[i] = v
					}
				})
				lockRef.current = true
                Api.add({
                    template_id: id,
                    title,
                    phone,
					material,
					remark
                }).then(() => {
					lockRef.current = false
                    overlay.close()
                    history.push('/result')
                }).catch((e) => {
					lockRef.current = false
					toast.show(e.message || '服务异常，请稍候重试')
				})
             }}
        />)
    }

	const renderTopBar = () => {
		const {pictureSource } = uploadInfo
		let len = uploadInfo.uploaded.length ? `(${uploadInfo.uploaded.length})` : ''
		return (
			<header className="photo-header">
				<div className="photo-left" >
					<div className="btn-default" >
						添加照片
						<input accept="image/*" 
						type="file"
						multiple="multiple"
						className="btn-default-upload" 
						onChange={uploadEvents.onImageFileChange}/>
					</div>
					<div className="btn-default" onClick={() => {
						if (!pictureSource.length) {
							return toast.show('还未上传照片哦~', 1000)
						}
						setDeleteable(!deletable)
					}}>{deletable ? '取消删除' : '删除照片'}</div>
				</div>  
				<div className="del-btn" 
					onClick={onSubmit}>提交照片{len}</div>  
			</header>
		)
	}


	const renderPlaceholder = () => {
		if (uploadInfo.loadLocalImg) {
			return (
				<div className="upload">
					<Indictor text={'正在准备照片,请稍后...'}></Indictor>
				</div>
			)
		}
		if (!uploadInfo.localImages.length) {
			return (
				<div className="upload">
					<img src={require('./../images/icon_paizhao@3x.png')} alt='' className="upload-img"></img>
					<small className="img-tip">点击上面的添加照片按钮，添加图片吧</small>
				</div>
			)
		} 
		return null
	}

	const holder = renderPlaceholder()

	return (
		<PictureStandContext.Provider value={{
			onReUpload,
			onPressImg,
			onRemove,
			deletable
		}}>
			<section className="picturestand">
				{renderTopBar()}
				<div style={{}}>
					<small className="tip-text">拖拽照片调整顺序或点击照片添加备注</small>
					{
						holder ? holder: (
							<DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
								{uploadInfo.pictureSource.map((item, index) => <PictureRow pictures={item} key={index} droppableId={ index + ''}></PictureRow>)	}
							</DragDropContext>
						)	
					}
				</div>
			</section>
		</PictureStandContext.Provider>
	)
}

export default PictureStand