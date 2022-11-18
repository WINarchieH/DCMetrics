import React, {useRef, useEffect, forwardRef} from 'react'
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '../../components/icons/Edit.png';
import DeleteOutline from '../../components/icons/Bin.png';

/**
 * 
 * File containing custom table cell UIs.
 * 
 */

// Actions Column Cell UI
export const ActionsCell = ({row, editHandler, deleteHandler, conditionalAction}) => {
    const onDelete = () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteHandler(row.original);
        }
    };    
    return (
        <div>
            { editHandler ? <Tooltip title="Edit">
                                <IconButton aria-label="edit" onClick={() => {editHandler(row.original)}}>
                                <img height={30} width ={30} src={Edit}></img>
                                </IconButton>
                            </Tooltip> : null}
            { deleteHandler ? <Tooltip title="Delete">
                                <IconButton aria-label="delete" onClick={onDelete}>
                                    <img   height={30} width ={30} src={DeleteOutline}></img>
                                </IconButton>
                            </Tooltip> : null}
            { conditionalAction ? conditionalAction(row) : null}
        </div>
    )
};

export const DateCell = ({value: date}) => {
    
    if (date === null || date === ''|| date === undefined) {
        return null;
        
    } 
    return  date.getDate() + '/' + (date.getMonth()+1)  + '/' + date.getFullYear();
};

DateCell.propTypes = {
  value: PropTypes.objectOf(PropTypes.instanceOf(Date))
};

export const CheckboxCell = forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = useRef()
      const resolvedRef = ref || defaultRef
  
      useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
      return (
        <>
          <Checkbox ref={resolvedRef} {...rest} />
        </>
      )
    }
  )
