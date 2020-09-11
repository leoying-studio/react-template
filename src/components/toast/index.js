import React, { Fragment, useEffect, useState, useRef}  from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Toast({msg, duration = 1000, onClose}) {

    const [fadeIn, setFadeIn] = useState(false)

    const closeRef = useRef(onClose)

    const timerRef = useRef(0)

    useEffect(() => {
        closeRef.current = onClose
    })

    useEffect(() => {
        setFadeIn(true)
        timerRef.current = setTimeout(() => {
            setFadeIn(false)
            setTimeout(() => {
                closeRef.current && closeRef.current()
            }, 500)
        }, duration)

        return () => {
            clearTimeout(timerRef.current)
        }
    }, [duration])

    return (
        <div className="toastor-container" style={fadeIn? {opacity: 1} : {}}>
            <span>{msg}</span>
        </div>
    )

}

export default Toast

