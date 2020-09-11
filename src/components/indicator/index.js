import React from 'react'
import './index.scss'

const Indictor = ({type, text}) => {

    const renderLoading = () => {
        return (
            <footer className="footer">
                <div><i className="icon iconfont iconloading loading"></i></div>
                <p>{text}</p>   
            </footer>
        )
    }

    if (type === 'loading') {
        return renderLoading()
    }

    return (
        <div>
            
        </div>
    )
}

Indictor.defaultProps = {
    type : 'loading',
    text: '正在加载...'
}


export default Indictor