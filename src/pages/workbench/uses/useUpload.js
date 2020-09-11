import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import useToast from '../../../uses/useToast'
import Api from 'services/request'
import { useHistory } from 'react-router-dom';

export const UploadContext = React.createContext({
    
})

export const UploadProvider = (props) => {
    const [localImages, setLocalImages] = useState([])
    const [uploadProgress, setUploadProgress] = useState({})
    const fileInfoRef = useRef([])
    const imageUrlRef = useRef(new Map())
    const hasUploadingRef = useRef(false)
    const toast = useToast()
    const uploaded = Object.values(uploadProgress).filter(item => item.progress === 100)
    const [loadLocalImg, setLoadLocalImg] = useState(false)

    const onRemoveImg = (data) => {
        let index = localImages.findIndex(item => item.key === data.key)    
        localImages.splice(index, 1)
        setLocalImages([...localImages])
        imageUrlRef.current.delete(data.key)
        setUploadProgress((preProgress) => {
            return {
                ...preProgress,
                [data.key]: {} 
            }
        })
    }

    const clear = useCallback(() => {
        fileInfoRef.current = []
        imageUrlRef.current = new Map()
        setLocalImages([])
        setUploadProgress({})
	}, [])

    const onReorder = (startIndex, endIndex) => {
		const result = Array.from(localImages);
		const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        // 整理imageUrlRef
        const newMap = new Map()
        result.forEach((item, index) => {
            const value = imageUrlRef.current.get(item.key)
            newMap.set(item.key, value)
        })
        imageUrlRef.current = newMap
        setLocalImages(result)
	};

    const pictureSource = useMemo(() => {
        let rows = []	
		let row = []
        const source = localImages.map((item, index) => { 
            return {
                ...item,
                ...uploadProgress[item.key],
                key: item.key
            }
        })
		source.forEach((item, index) => {
		  if (!row.length) {
			rows.push(row)
		  }
		  row.push(item)
		  if (row.length > 2) {
			row = []
		  }
		})
		return rows
    }, [localImages, uploadProgress])


    const onUploadError = function(e) {
        hasUploadingRef.current = false
        let formData = fileInfoRef.current[0]
        setUploadProgress((preProgress) => {
            return {
                ...preProgress,
            [formData.key]: {
                progress: 0,
                status: false
            }
            }
        })
        toast.show(e.message || '上传失败，请稍后重试!', 1000)
    }

    const generateSlice = (file, res, hash) => {
        
        const chunkSize = res.chunkSize || 1024 * 1024;

        const totle =  Math.ceil(file.size / chunkSize)


        return Array(totle).fill(null).map((item, index) => {

            const formData = new FormData();

            const start = index * chunkSize;

            const end = Math.min(file.size, start + chunkSize);

            formData.append('resource_chunk', file.slice(start, end));

            formData.append('resource_ext', res.resourceExt);
    
            formData.append('chunk_total', totle);
    
            formData.append('chunk_index', index + 1);
    
            formData.append('resource_temp_basename', res.resourceTempBaseName);
    
            formData.append('group', 'file');
    
            formData.append('group_subdir', res.groupSubDir);
    
            formData.append('locale', 'zh');
    
            formData.append('resource_hash', hash);

            return formData
        })
    }

    const actionUploadSlice = (slices) => {
        const newSlices = Array.from(slices)
    
        const config = {
            onUploadProgress: e => {
                let progress = (e.loaded / e.total * 100 | 0)
                let formData = fileInfoRef.current[0]
                if (formData) {
                    setUploadProgress((preProgress) => {
                        const no = slices.length - newSlices.length + 1
                        return {
                            ...preProgress,
                        [formData.key]: {
                            progress: (progress / slices.length * no).toFixed(0),
                            status: true
                        }
                        }
                    })
                }
            }
        }
        return new Promise((resolve, reject) => {
            const action = function() {
                const currentSlice = newSlices[0]
                if (!currentSlice) {
                    return
                }
                Api.uploading(currentSlice, config).then((res) => {
                    newSlices.shift()
                    if (!newSlices.length) {
                        resolve(res)
                    } else {
                        action()
                    }
                }).catch(onUploadError)
            }
            action()
        })
    }

    const calculateHash = function (file) { //计算hash
        let clientChunkSize = 4000000,
        
        blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        
        chunks = Math.ceil(file.size / clientChunkSize),

        currentChunk = 0,

        spark = new window.SparkMD5.ArrayBuffer(),

        fileReader = new FileReader();

        function loadNext() {
    
            let start = currentChunk * clientChunkSize,

            end = start + clientChunkSize >= file.size ? file.size : start + clientChunkSize;

            const ArrayBuffer = fileReader.readAsBinaryString ||  fileReader.readAsArrayBuffer
            
            ArrayBuffer(blobSlice.call(file, start, end));
        }

        return new Promise((resolve, reject) => {
            fileReader.onload = function (e) {

                spark.append(e.target.result);

                ++currentChunk;

                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    resolve(spark.end())
                };
        
                fileReader.onerror = function () {
        
                };
            }
            loadNext();
        })
    }

    const actionUploadImage = () => {
        const start = (fileInfo) => {
            if (!fileInfo) {
                hasUploadingRef.current = false
                return
            }
            hasUploadingRef.current = true 
            Api.preprocess(fileInfo.preprocessInfo).then((res) => {
                const slices = generateSlice(fileInfo.file, res.data, fileInfo.hash)
                actionUploadSlice(slices).then((res) => {
                    imageUrlRef.current.set(fileInfo.key, res.data.savedPath)
                    fileInfoRef.current.shift()
                    start(fileInfoRef.current[0])
                })
            }).catch(onUploadError)
        }
        if (!hasUploadingRef.current) {
            start(fileInfoRef.current[0])
        }
    }

    const onImageFileChange = (e) => {
        const files =  Array.from(e.target.files)
        if (!files.length) {
           return
        }
        setLoadLocalImg(true)
        const localImageFiles = []
        const fileInfo = []
        if (files.some((item) => item.file >= 8 * 1024 * 1024)) {
            toast.show('选择相片包含较大文件，请耐心等待...', 1500)
        }
        files.forEach((item, index) => {
            const key = localImages.length ? localImages[localImages.length - 1].key + index + 1 : index
            calculateHash(item).then((hash) => {
                fileInfo.push({
                    key,
                    file: item,
                    hash,
                    preprocessInfo: {
                        resource_name: item.name,
                        resource_size: item.size,
                        // hash 暂时省略
                        resource_hash: hash,
                        locale: 'zh',
                        group: 'file'
                    }
                })

                const fr = new FileReader()
                fr.readAsDataURL(item)
                fr.onload = (e) => {
                    localImageFiles.push({
                        key,
                        img: e.target.result,
                        name: item.name
                    })
                    if (localImageFiles.length === files.length) {
                        setLocalImages((preList) => {
                            return [...preList, ...localImageFiles]
                        })
                        setLoadLocalImg(false)
                    }
                }
                if (fileInfo.length === files.length) {
                    fileInfoRef.current = [...fileInfoRef.current, ...fileInfo]
                    actionUploadImage()
                }
            })
        })
    }
    
    return (
        <UploadContext.Provider value={ [{
            uploaded,
            loadLocalImg,
            localImages,
            uploadProgress,
            pictureSource,
            imageUrlRef
        }, {
            onRemoveImg,
            onImageFileChange,
            actionUploadImage,
            onReorder
        }, clear]}>
            {props.children}
        </UploadContext.Provider>
    )
}

