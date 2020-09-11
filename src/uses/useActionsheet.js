import React from 'react'
import Actionsheet from 'components/actionsheet'
import useOverlay from './useOverlay'

const useActionsheet = () => {
    const overlay = useOverlay()

    const show = (props, config) => {
        return new Promise((resolve, reject) => {
        const ActionSheetTransfer = function({close}) {
            return <Actionsheet {...props} onSelect={(item, index) => {
                resolve(item, index)
                close()
            }} onCancel={() => {
                reject()
                close()
            }} />
        }
            overlay.show(<ActionSheetTransfer></ActionSheetTransfer>, config)
        })
    }

    return {
        show
    }
}

export {useActionsheet}