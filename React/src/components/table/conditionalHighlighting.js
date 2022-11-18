/**
 * This file is used to define conditions for highlighting table cells.
 * The functions defined should do the following:
 * - take the table cell `value`
 * - return a css colour style in `table.scss` depending on value conditions
 * - return `null` for no colouring
 */

export const colourLostTime = (value) => {
    if (value && parseFloat(value) > 0) {
        return 'table-cell--red';
    }
    // else if (value && parseFloat(value) === 0) {
    //     return 'table-cell--green';
    // }
    

    return null;
}

export const colorPerformanceReport = (value) => {
    if ((value && parseFloat(value) < 50) )  {
        return 'table-cell--red';
    }
    else if ((value && parseFloat(value) > 50) && (value && parseFloat(value) <75)) {
        return 'table-cell--yellow';
    }
    else if ((value && parseFloat(value) >= 75)) {
        return 'table-cell--green';
    }
    

    return null;
}

export const colorIdleReport = (value) => {
  
    if ((value === 'Idle') )  {
        return 'table-cell--red';
    }
    return null;
}

export const boldRow = (value) => {
  
    if ((value === 'Total') )  {
        return 'table-cell--red';
    }
    return null;
}