import React, { useState, useImperativeHandle, useRef, useContext } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {PictureStandContext} from './../uses/usePictureStand'
import './pictureRow.scss'

function DraggablePictureItem({ data, index }) {
	const {deletable, onPressImg, onReUpload, onRemove } = useContext(PictureStandContext)
	const styles =  (index + 1) % 3 === 0 ? {marginRight: 0} : {}
	let uploadText = data.progress ? data.progress + '%' : '等待上传'
	if (data.status === false) {
		uploadText = '上传失败'
	}
	let backgroundColor = {backgroundColor: `rgba(0,0,0,${1 - data.progress / 100 })`}
	const isDragDisabled = Number(data.progress) === 100 || deletable
	return (
	  <Draggable draggableId={ data.key + ''} index={index} isDragDisabled={!isDragDisabled}> 
		{provided => (
		  <div
		  className='p-item'
		  style={{
			...provided.draggableProps.style,
			alignSelf: 'flex-start',
			...styles
		  }}
		   ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
		  >
			  <div className={deletable ? 'p-delete' : ''}>
				<div className="img-wrapper" onClick={() => {
					onPressImg(data, index)
				}}>
					<img className="img" src={data.img} alt="" />
				</div>	
				{
					Number(data.progress) === 100 ? null : (
						<div className="upload-progress" 
						onClick={() => {
							onReUpload(data, index)
						}}
						style={backgroundColor}>{uploadText}</div>
					)
				}
				{
						deletable ? 
						<div className="del" 
						onClick={() => {
							onRemove(data)
						}}>
							<i className="icon iconfont icondel del-icon"></i>
						</div> : null
					}
			</div>
		  </div>
		)}
	  </Draggable>
	);
}

function PictureRow({pictures = [], droppableId, ...otherProps}) {

	const renderPictureList = (item, index) => {
		return pictures.map((item, index) => (
			<DraggablePictureItem data={item} index={index} key={item.key} />
		  ));
	}

  return (
      <Droppable droppableId="list" direction="horizontal" droppableId={droppableId} >
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} style={{
			display: 'flex',	
			flexWrap: 'wrap',
			height: '1.66rem',
			marginBottom: '.1rem',
			overflow: 'hidden'
          }}>
			{renderPictureList()}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
  );
}

export default PictureRow
