import React from 'react';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import GlobalFilter from './globalFilter';
import IconButton from '@material-ui/core/IconButton';
import { lighten, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import ExportaddIcon from '../../components/icons/Add.png'
import ExportMenuIcon from '../../components/icons/Menu.png'

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const ToolBar = props => {
  /**
     * Component for Tool UI with Material UI Aesthetic
     * 
     * @param {object} preGlobalFilteredRows - object for global filtering
     * @param {object} setGlobalFilter - object for global filtering
     * @param {object} globalFilter - object for global filtering
     * @param {string} title - table title
     * @param {int} numSelected - number of checkboxes selected in table
     * @param {func} addHandler - event on add 
     * @param {func} menuHandler - event on menu click (opens modal in table)
     * @param {elementType} CheckBoxComponent - react element containing logic for checkbox selection
     * @param {elementType} ExportButtons - export buttons
     * @param {elementType} AdditionalButtons - additional buttons for the table uis
     */

  const classes = useToolbarStyles();
  const {
    preGlobalFilteredRows,
    setGlobalFilter,
    globalFilter,
    title,
    numSelected,
    selectedRowIds,
    addHandler,
    menuHandler,
    CheckBoxComponent,
    ExportButtons,
    AdditionalButtons
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0 ? 'light': null,
      })}
    >
      { // Displays Checkbox component option when something is selected. 
        // Potential to add more buttons when checkbox selected here
        CheckBoxComponent && numSelected > 0 ? 
        <React.Fragment>
          <CheckBoxComponent data={selectedRowIds}></CheckBoxComponent>
          <Typography className={classes.title} color='inherit' >
            {numSelected} selected
          </Typography>
        </React.Fragment>
         : null
      }
      { // Table Title and Filtering
        numSelected > 0 ? null :
        <React.Fragment>
          <Typography className={classes.title} variant="h6" id="tableTitle">
            {title}
          </Typography>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </React.Fragment>
      }
      { // Add Button
        addHandler && (numSelected ? numSelected === 0 : true) ? 
        <Tooltip title='Add'>
          <IconButton aria-label='add' onClick={addHandler}>
          <img  width ={30} height ={30} src={ExportaddIcon}></img>
          </IconButton>
        </Tooltip> : null}
      { // Additional Buttons - This can be moved before Add button to change button order
        AdditionalButtons ? (numSelected > 0 ? null :
        <AdditionalButtons></AdditionalButtons>
        ) : null
      }
      {  // Displays Export Button and Menu (which columns are visible option)    
        numSelected > 0 ? null :
        <React.Fragment>
          <ExportButtons></ExportButtons>
          <Tooltip title='Menu'>
            <IconButton aria-label='Menu' onClick={menuHandler}>
            <img  width ={30} height ={30} src={ExportMenuIcon}></img>
            </IconButton>
          </Tooltip>
        </React.Fragment> }
    </Toolbar>
  )
};

/**
 * CheckBoxComponent - Retrieves a component with a data property
 * data contains an array of indexes of selected rows
 */

ToolBar.propTypes = {
  setGlobalFilter: PropTypes.func.isRequired,
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string,
  CheckBoxComponent: PropTypes.elementType,
  title: PropTypes.string.isRequired
};

export default ToolBar;
