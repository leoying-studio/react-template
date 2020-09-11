import React from 'react'
import Modal from './../components/modal'
import useOverlay from './useOverlay'

const useModal = () => {
    const overlay = useOverlay()

    const show = (props) => {
        return new Promise((resolve, reject) => {
            overlay.show(<Modal {...props} onConfirm={resolve} onCancel={reject}/>)
        })
    }

    return {
        show,
        close: overlay.close
    }
}

export {useModal}