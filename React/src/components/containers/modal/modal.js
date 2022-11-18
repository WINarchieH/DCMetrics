import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import './modal.scss';

const checkChange = (obj1, obj2) => {
    // Checks if two javascript objects are equivalent by key value.
    let keys = Object.keys(obj1);
    for (let i = 0; i < keys.length; i++) {
        if (obj1[keys[i]] !== obj2[keys[i]]) {
            return true;
        }
    }
    return false;
};

const Modal = (props) => {
    /**
     * Modal component
     * 
     * @param {string} props.title - modal title
     * @param {string} props.buttonName - modal button name
     * @param {boolean} props.unrestrictWidth (optional) - Allows for varied width (defaults false)
     * @param {boolean} props.showModal - External boolean specifying if modal is visible
     * @param {func} props.setShowModal (optional) - Associated setter function with props.showModal
     * @param {func} props.onSubmit - Function to run when modeal form submits
     * @param {boolean} props.loadModal (optional) - Specifies if modal is in 'loading' state
     * @param {element} props.children (optional) - Array of React Elements (eg. Textfields)
     */

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onClose = () => {
        if (props.setShowModal) {
            props.setShowModal(false);
        }
        else {
            setShowModal(false);
        }
    }

    useEffect(() => {
        setShowModal(props.showModal);
        setIsLoading(props.loadModal);
    }, [props]);
    
    return (
        <div>
            <div className={showModal ? 'modal-background' : null} onClick={onClose}></div>
            <div className={showModal ? 'modal-container modal-container--display' : 'modal-container--hide'}>
                <h3 className='modal-title'>{props.title}</h3>
                <form onSubmit={props.onSubmit} className={props.unrestrictWidth ? 'modal-form--max-width' : 'modal-form'}>
                    {props.children}
                    <div className='modal-item modal-item--success'>{props.message}</div>
                    <div className='modal-item modal-item--error'>{props.messageError}</div>
                    {
                        props.buttonName ?
                        <div className='modal-item modal-item--bottom'>
                        {isLoading ?
                        <button className='modal-button modal-button--styling modal-button--load hover-cursor'>Loading</button> :
                        <button className='modal-button modal-button--styling hover-cursor'>{props.buttonName}</button>
                        }
                    </div> : null
                    }
                </form>
                <button className='close-button hover-cursor' onClick={onClose}><CloseIcon></CloseIcon></button>
            </div>
        </div>      
    )
};

Modal.propTypes = {
    title: PropTypes.string,
    buttonName: PropTypes.string,
    unrestrictWidth: PropTypes.bool,
    showModal: PropTypes.bool,
    setShowModal: PropTypes.func,
    onSubmit: PropTypes.func,
    loadModal: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ])
};

export default Modal;

export {checkChange};