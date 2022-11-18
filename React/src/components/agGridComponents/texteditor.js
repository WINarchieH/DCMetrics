import React, { useState, forwardRef, useImperativeHandle } from "react";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

export default forwardRef((props, ref) => {
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const classes = useStyles();
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
        <TextField id="standard-basic" style={{ padding: '0 10px' }} onChange={onChangeHandler}
        inputValue={inputValue}/>
       
    );
})
