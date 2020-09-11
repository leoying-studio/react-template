
import React, {  useRef, useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Toast from '../components/toast'
const useToast = () => {
    const body = document.querySelector('body')
    const container = useRef(document.createElement('div'))

    const onClose = useCallback(() => {
        ReactDOM.unmountComponentAtNode(container.current)
        body.removeChild(container.current)
    }, [])
    
    const show = useCallback((msg, duration) => {
        body.appendChild(container.current)
        ReactDOM.render(<Toast {...{msg, duration}} onClose={onClose}/>, container.current)
    }, [onClose])

    return {
        show,
        close: onClose
    }
}

export default useToast