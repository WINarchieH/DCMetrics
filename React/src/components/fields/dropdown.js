import React from 'react';
import PropTypes from 'prop-types'
import '../../assets/_modal.scss';

const DropDown = ({name, label, hidden, onChange, defaultValue, disabled, options, optionNames, required, className}) => {    
    /**
     * Dropdown Component
     * 
     * @param {string} name - name associated with dropdown
     * @param {string} label - title of dropdown to be shown on screen 
     * @param {bool} hidden - specifies whetehr dropdown label should be shown
     * @param {func} onChange - handler when value changes 
     * @param {var} defaultValue - default value of dropdown 
     * @param {bool} disabled - (optional) disables dropdown when true (default false)
     * @param {array} options - list of option values ['M','F','X']
     * @param {array} optionNames - (optional) list of names for each options to be displayed ['Male', 'Female', 'Unspecified']
     * @param {bool} required - (optional) specifies whether input is required
     * @param {string} className - (optional) overwrites css for the dropdown
     */
    return (
        <div className='modal-item'>
            { label ? <label className='label label--position' hidden={hidden}>{ label }</label> : null }
            <select 
                name={name}
                className={ className || 'modal-fields modal-fields--outline'}
                value={defaultValue || ''} 
                required={required}
                onChange={onChange} 
                disabled={disabled}
                hidden = {hidden}>
                <option key='' value='' style={{ fontfamily:'Montserrat'}} className='dropdown-item'>Select {label.toLowerCase()}</option>
                {
                
                    options.map((opt, i) => {
                    
                        return <option key={opt} value={opt}  style={{ fontfamily:'Montserrat'}} className='dropdown-item'>{optionNames ? optionNames[i] : opt}</option>
                    })
                }
                           
                </select>
        </div>
    );
};

DropDown.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string,PropTypes.number])).isRequired,
    optionNames: PropTypes.arrayOf(PropTypes.string),
    required: PropTypes.bool
};

export default DropDown;