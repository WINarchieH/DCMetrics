import React from 'react';
import './selectButton.scss';

const SelectButton = ({data, onClick, closePopup}) => {
    /**
     * Select Button Component
     * 
     * @param {array} data - contains an array of values to be displayed 
     * @param {func} onClick - a function that takes in a value that is selected via clicking 
     * @param {func} closePopup (optional) - closes a popup when selecting an option 
     */

    const handleClick = (e) => {
        if (closePopup) {
            closePopup(false);
        }
        onClick(e.currentTarget.innerText);
    };

    return (
        <div className='select-container'>
            { data ? data.map((x) => {
                return (
                    <div key={x} className='select-item' onClick={handleClick}>{x}</div>
                );
            }) : null} 
        </div>
    )
};

export default SelectButton;