import React from 'react';
import CustomButton from '../custom-button/custom-button.component';


const Modal = (props) => {
    const { onClose, message } = props;
    return (
        <>
            <div className>{message}</div>
            <CustomButton onClick={onClose}></CustomButton>
        </>
    )
}

export default Modal;