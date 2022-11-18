// Sorting functions to be used for column sorting

export const orderDatetime = (rowA, rowB, columnId) => {

    let a = getRowValueByColumnID(rowA, columnId)
    let b = getRowValueByColumnID(rowB, columnId)

    if (a === '' && b === '') {
        return 0;
    }
    else if (a === '') {
        return -1;
    }
    else if (b === '') {
        return 1;
    }
    else {
        if (a != null)
        {
        a = a.getTime()
        }
if (b != null)
{        b = b.getTime()
}
    return compareBasic(a, b)
    }
} 

// Utils

function compareBasic(a, b) {
    return a === b ? 0 : a > b ? 1 : -1
  }

function getRowValueByColumnID(row, columnId) {
    return row.values[columnId]
  }