import React, { Fragment, useEffect, useState, useRef, useCallback, useImperativeHandle, forwardRef}  from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import { useEvent } from 'uses/useEvent'

function TopView({onClose, children, type = 'popup', contentStyle, closeable = true}, ref) {

    const [animation, setAnimation] = useState(false)

    const closeRef = useRef(onClose)

    useEffect(() => {
        closeRef.current = onClose
    })

    useEffect(() => {
        setAnimation(true)
    }, [])

    const close = useCallback(() => {
        setAnimation(false)
        setTimeout(() => {
            closeRef.current && closeRef.current()
        }, 500)
    }, [])

    const style = type === 'popup' ? {
        transform: animation ? 'translateY(0)' : 'translateY(100vh)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    } : {}
    
    return (
        <div className="topview" style={animation? {opacity: 1} : {}} onClick={() => {
            closeable && close()
        }}>
            <div className="topview-inner" style={{...style, ...contentStyle}}>
                {
                    React.Children.map(children, (child) => {
                        return React.cloneElement(child, {
                            close
                        })
                    })
                }
            </div>
        </div>
    )
}

export default TopView 