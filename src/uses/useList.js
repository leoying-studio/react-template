import { useEffect, useCallback, useState, useRef } from "react"
import Api from './../services/request'

const useList = (props) => {
	
	const [list, setList] = useState([])

	const onErrorRef = useRef(props.onError)

	const disabedRequest = useRef(false)

	const [loadingStatus, setLoadingStatus] = useState("loading")

	const timer = useRef(0)

	useEffect(() => {
		onErrorRef.current = props.onError
	})

	const paramsRef = useRef({...props.params, page: 1, pageSize: 10})

	const getNextPage = useCallback(() => {
		if (disabedRequest.current) {
			setLoadingStatus('noMore')
			return
		}
		setLoadingStatus('loading')
		Api[props.fn](paramsRef.current).then((res) => {
			if (res.data) {
				if(!res.data.data || res.data.data.length < paramsRef.current.pageSize) {
					disabedRequest.current = true
					setLoadingStatus('noMore')
				}
			}
			setList((preList) => {
				return [...preList, ...res.data.data]
			})
			if (!disabedRequest.current) {
				setLoadingStatus('ok')
			}
			paramsRef.current.page++
		}).catch((e) => {
			onErrorRef.current && onErrorRef.current(e)
		})
	}, [props.fn])

	useEffect(() => {
		getNextPage()
	}, [getNextPage])

	const onEndEvent = useCallback(() => {
			// 滚动条在Y轴上的滚动距离
		const getScrollTop = () => {
			let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
			if (document.body) {
				bodyScrollTop = document.body.scrollTop;
			}
			if (document.documentElement) {
				documentScrollTop = document.documentElement.scrollTop;
			}
			scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
			return scrollTop;
		}

		// 文档的总高度
		const getScrollHeight = () => {
			let scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
			if (document.body) {
				bodyScrollHeight = document.body.scrollHeight;
			}
			if (document.documentElement) {
				documentScrollHeight = document.documentElement.scrollHeight;
			}
			scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
			return scrollHeight;
		}

		// 浏览器视口的高度
		const getWindowHeight = () => {
			let windowHeight = 0;
			if (document.compatMode === "CSS1Compat") {
				windowHeight = document.documentElement.clientHeight;
			} else {
				windowHeight = document.body.clientHeight;
			}
			return windowHeight;
		}
		if(getScrollTop() + getWindowHeight() > getScrollHeight() - 700){
			clearTimeout(timer.current)
			timer.current = setTimeout(() => {
				getNextPage()
			}, 500)
		}
	}, [getNextPage])	

	useEffect(() => {
		window.addEventListener("scroll", onEndEvent)
		return () => {
			window.removeEventListener('scroll', onEndEvent)
		}
	}, [onEndEvent])

	return [list, loadingStatus]
}

export default useList