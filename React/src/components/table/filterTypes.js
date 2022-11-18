import {inputToDateObj} from '../fields/dateHelpers';
// Filtering Functions

export const filterText = (rows, id, filterValue) => { // Text contains value
    return rows.filter(row => {
        const rowValue = row.values[id];
        return rowValue !== undefined
          ? String(rowValue)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase())
          : true;
    });
};
filterText.autoRemove = val => !val;

export const filterEquality = (rows, id, filterValue) => { // Equals Filter Value Exactly
    return rows.filter(row => {
        const rowValue = row.values[id];
        return rowValue !== undefined ? rowValue === filterValue : true;
    });
};
filterEquality.autoRemove = val => !val

export const filtergreaterthanEquality = (rows, id, filterValue) => {
     // Equals Filter Value Exactly
   rows= rows.sort();
     return rows.filter(row => {
        const rowValue = row.values[id];
       
        return rowValue !== undefined ? rowValue >= filterValue : true;
    });
};
filtergreaterthanEquality.autoRemove = val => !val

export const filterContains = (rows, id, filterValue) => {
    return rows.filter(row => {
        const rowValue = row.values[id];
      
        return (rowValue !== undefined  && filterValue.length !== 0) ? filterValue.includes(rowValue) : true;
    });
}
filterContains.autoRemove = val => !val;

export const filterDatesRange = (rows, id, filterValue) => {
    let [min,max] = [new Date(-8640000000000000), new Date(8640000000000000)];
    if (filterValue) {
        [min,max] = [inputToDateObj(filterValue[0]), inputToDateObj(filterValue[1])];
        if (max instanceof Date) {
            // Set the max time to 23:59:59 for particular end date
            max.setHours(23);
            max.setMinutes(59);
            max.setSeconds(59);
        }
    } // Note. Assumes order is preserved for filter values.

    return rows.filter(row => {
        const rowValue = row.values[id];
        if (rowValue) {
            if (max === undefined || max === '') {
                return rowValue >= min;
            }
            else if (min === undefined || min === '') {
                return rowValue <= max;
            }
            else {
                return rowValue >= min && rowValue <= max;
            }
        }
        return false;   // Always show rows with missing dates.     
    });
}
filterDatesRange.autoRemove = val => !val;

export const filterFromDate = (rows, id, filterValue) => {
    const min = inputToDateObj(filterValue);
    return rows.filter(row => {
        const rowValue = row.values[id];
        return rowValue >= min;
    });
};
filterFromDate.autoRemove = val => !val;

export const filterToDate = (rows, id, filterValue) => {
    const max = inputToDateObj(filterValue);
    return rows.filter(row => {
        const rowValue = row.values[id];
        return rowValue <= max;
    });
};
filterToDate.autoRemove = val => !val;

export const filterDatesRangePicker = (rows, id, filterValue) => {
    let [min,max] = [new Date(-8640000000000000), new Date(8640000000000000)];
    if (filterValue) {
        min = filterValue[0] ? filterValue[0].toDate() : '';
        max = filterValue[1] ? filterValue[1].toDate() : '';
    } // Note. Assumes order is preserved for filter values.
    return rows.filter(row => {
        const rowValue = row.values[id];
        if (rowValue) {
            if (max === undefined || max === '') {
                return rowValue <= max;
            }
            else if (min === undefined || min === '') {
                return rowValue >= min;
            }
            else {
                return rowValue >= min && rowValue <= max;
            }
        }
        return false;   // Always show rows with missing dates.     
    });
}
filterDatesRangePicker.autoRemove = val => !val;

export const everything = (rows, id, filterValue) => {
    console.log(filterValue);
    return rows.filter(row => true);
}
