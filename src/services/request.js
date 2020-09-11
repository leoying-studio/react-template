import axios from 'axios'
const baseURL = window.powerMonkey.baseURL || 'https://hou.mengdodo.com/'

const instance = axios.create({
	baseURL,
	timeout: 5000,
	headers: {'X-Custom-Header': 'foobar'},
});


const getTempList = (params) => {
	return instance.get('/api/template/list?page=' + params.page)
}

const uploadImg = (formData, config = {}) => {
	return instance.post('/api/post/upload', formData, config)
}

const add = (params) => {	
	return instance.post('/api/post/add', params)
}

const preprocess  = (params) => {
	return instance.post('/aetherupload/preprocess', params)
}

const uploading = (params, config = {}) => {
	return instance.post('/aetherupload/uploading', params, config)
}

export default{
	getTempList,
	uploadImg,
	add,
	preprocess,
	uploading
}