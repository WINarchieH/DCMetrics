import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker
} from '@material-ui/pickers';

export default forwardRef((props, ref) => {
  
      // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(null);

  const handleDateChange = (date) => {
      console.log(date);
    setSelectedDate(date);
  };
    
  

  useImperativeHandle(ref, () => {
    return {
        getValue: () => {
            let dateString = null;
            if (selectedDate) {
                console.log(selectedDate);
                dateString = format(selectedDate, 'HH:mm');
            }
            return dateString;
        },
        isCancelAfterEnd: () => {
            return !selectedDate;
        },
        afterGuiAttached: () => {
            if (!props.value) {
                return;
            }
            // const [_, day, month, year] = props.value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
            // let selectedDate = new Date(year, month - 1, day);
            console.log(new Date('2014-08-18T'+props.value));
            setSelectedDate(new Date('2014-08-18T'+props.value));
        }
    };
});

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
               style={{ width: '100%', margin: 0, padding: '6px 10px', }}
               margin="normal"
          value={selectedDate}
          onChange={handleDateChange}
        />
        </MuiPickersUtilsProvider>
    )
})
