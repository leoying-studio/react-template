import React, { useCallback, Fragment, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import TopView from './../components/topview'

const useOverlay = () => {
    const containerRef = useRef(document.createElement('div'))
    const topRef = useRef()

    const onClose = useCallback(() => {
        ReactDOM.unmountComponentAtNode(containerRef.current)
        document.body.removeChild(containerRef.current)
    }, [])

    const show = useCallback((component, props) => {
        document.body.append(containerRef.current)
        ReactDOM.render(<TopView onClose={onClose}  {...props}>{component}</TopView>, containerRef.current)
    }, [onClose])

    return {
        show
    }
}

export default useOverlay