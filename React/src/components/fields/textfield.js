import React from 'react';
import PropTypes from 'prop-types';
import './textfield.scss';

// Predefined restriction pattern checks
const patterns = { // eslint-disable-next-line
    default: '^[\\w]+([\\s\\-]*[\\w.]+)*$',   // Start with any character/digit, end with character/digit/.
    password: '^[A-Za-z0-9]+$', // Character/digits at least 1
    number: '^[0-9]+$', // Numbers only (must end in non-zero number)
    name: '^[A-Za-z,.\'-]+'
}

export default  function TextField(props) {
    /**
     * TextField component
     * 
     * @param {string} props.name - Name associated with the input and used with useInputState hook.
     * @param {string} props.label (optional) - Label associated with textfield
     * @param {func} props.onChange - Function for setting input value
     * @param {var} props.value (optional) - Default value of text field and paired with onChange
     * @param {boolean} props.required (optional) - Specifies whether textfield is required.
     * @param {string} props.restrictions (optional) - Specifies input restrictions predefined in `patterns`
     * @param {string} props.type (optional) - Specifies input type eg. date 
     * @param {boolean} props.disabled (optional) - Specifies whether input can be changed.
     */

    const pattern = patterns[props.restrictions|| 'default'];

    return (
        <div className='modal-item'>
            <label className='label label--position'  hidden ={props.hidden}>{ props.label }</label>
            <input 
                name={props.name}
                className={props.type === 'date' ? 'modal-fields modal-fields--outline modal-fields--date' :  'modal-fields modal-fields--outline'} 
                value={props.value}  
                type={props.type || 'text'}
                pattern= {props.restrictions ? pattern : null}
                onChange={props.onChange}
                required={props.required}
                disabled={props.disabled}
                minLength={props.minLength}
                maxLength={props.maxlength}
                min={props.min}
                hidden ={props.hidden}
                step={props.step}
              
                placeholder={props.placeholder || null}
             ></input>
        </div>
    )
};

TextField.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    required: PropTypes.bool,
    restrictions: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool
};