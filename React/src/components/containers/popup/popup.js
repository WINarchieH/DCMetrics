import React from 'react';
import PropTypes from 'prop-types';
import './popup.scss';


const PopupButton = ({name, className, disabled, onClick}) => {
    /** 
     * Component for opening popup.
     * 
    * @param {string} className - CSS button styling
    * @param {boolean} disabled (optional) - disables onClick 
    * @param {func} onClick - event on button click
    */
    return (
        <div className={className} onClick={disabled ? null : onClick}>{name}</div>
    );
}

PopupButton.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

const Popup = ({showPopup, title, children}) => {
    /**
     * Component for Popup.
     * 
     * @param {boolean} showPopup (optional) - Specifies if popup is visible
     * @param {string} title - Modal title
     * @param {element} children - Content of popup
     */

    return (
        <div className={showPopup ? 'popup-position' : null}>
            <div className={showPopup ? 'popup-background' : null}></div>
            <div className={showPopup ? 'popup-container popup-container--display' : 'popup-container--hide'}>
                <h3 className='popup-title'>{title}</h3>
                {children}
            </div>
        </div>
    );
} 

Popup.propTypes = {
    showPopup: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ])
};

export default Popup;
export {PopupButton};




