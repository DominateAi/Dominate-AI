import React from 'react'

const CloseButton = ( props ) => {
    return (
        <div className="close_button_main_container">
            <div className="close_area">
                <i className="fa fa-times fa-2x" aria-hidden="true" onClick={ props.onClose }></i>
            </div>
        </div>
    )
}

export default CloseButton
