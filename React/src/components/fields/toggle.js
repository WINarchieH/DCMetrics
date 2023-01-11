import React from 'react';
import './toggle.scss';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const Toggle = ({name, label, checked, onChange, }) => {
    /**
     * Toggle Component 
     * 
     * @param {string} name = name associated with toggle (used for inputState hook)
     * @param {string} label - title of toggle to be displayed 
     * @param {bool} checked - determines whether the default mode is checked or not
     * @param {func} onChange - handler for changing toggle value
     *
     */
    return (
        <div className='modal-item'>
            <div style={{ fontFamily:'Montserrat'}} className='modal-fields modal-fields--center'>
                <FormGroup row>
                    <FormControlLabel 
                        label={label}
                        control={
                            <Switch
                                checked={checked || false}
                                onChange={e => onChange(!checked)}
                                name={name}
                                color="primary"
                             
                            />
                        } />
                </FormGroup>
            </div>
            {/* // Old toggle
                <label className='label label--position'>{label}</label>
                <label className='toggle-container'>
                    <input
                        name={name} 
                        type='checkbox' className='toggle-checkbox'
                        checked={checked || false}  
                        onChange={e => onChange(!checked)} 
                    ></input>            
                    <div className='toggle-slider'></div>                
                </label>  */}
        </div>
    );
};

export default Toggle;

export function booleanToOutput(x) {
    if (x) {
        return 'Y';
    }
    return 'N';
}

export function outputToBoolean(x) {
    if (x === '1' || x === 'Y') {
        return true;
    }
    return false;
}