import React, { useState, forwardRef, useImperativeHandle } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default forwardRef((props, ref) => {
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');

    function onChangeHandler(e, value) {
        setValue(value);
    }

    function onInputChangeHandler(e, inputValue) {
        setInputValue(inputValue);
    }

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value;
            },
            afterGuiAttached: () => {
                setValue(props.value)
            }
        };
    });

    return (
        <Autocomplete
            style={{ padding: '0 10px' }}
            options={props.options}
            value={value}
            onChange={onChangeHandler}
            inputValue={inputValue}
            onInputChange={onInputChangeHandler}
            disableClearable
            renderInput={(params) => (
                <TextField
                    {...params}
                    style={{ fontFamily:'calirbi', padding: '3px 0' }}
                    placeholder={'Select..' } />
            )}
        />
    );
})
