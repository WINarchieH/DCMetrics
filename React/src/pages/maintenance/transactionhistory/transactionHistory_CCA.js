import React, { useState, useEffect, useMemo, useRef } from 'react';

import { useSelector } from 'react-redux';
import '../../../assets/common.scss';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectDate, SelectMultipleFilter } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, { checkChange } from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput, isStartDateTimeSmallerThanEndDateTime, dateObjToInput } from '../../../components/fields/dateHelpers';
import DropDown from '../../../components/fields/dropdown';
import Toggle, { booleanToOutput, outputToBoolean } from '../../../components/fields/toggle';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';

// Ag Grid

// Importing Ag Grid Community Version
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { lighten, makeStyles } from '@material-ui/core/styles';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import Edit from '@material-ui/icons/Edit';
import './transactionHistory.scss';
import '../../../assets/_modal.scss';
const tableTitle = 'Transaction History';

const defaultInput = {
    'BatchNumber': '',
    'TaskType':'',
    'FullName':'',
    'StartDate': '',
    'StartTime': '',
    'EndDate': '',
    'EndTime': '',
    'ActualTime': '',
    'TotalBreak': '',
    'FromLocation': '',
    'ProductCode': '',
    'ProductWeight': '',
    'ProductCube': '',
    'PickQuantity': '',
    'AddDate': '',
    'ProductDescription': '',
    'FullCase_SplitCase': '',
    'Site': '',
    'OperatorID': '',
    'Comment': '',
    'UpdatedBy': '',
    'DCMUser': '',
    'ToLocation':''
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
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
      flex: '1 1 50%',
      fontFamily :'calibri',
      fontSize: 'small'
    },
  }));


// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'Reason For Update': [],
    'UserList': []
};

const today = new Date();

const TransactionHistory = () => {
    defaultInput.StartDate = dateObjToInput(today);
    defaultInput.EndDate = dateObjToInput(today);

    const [tableData, setTableData] = useState([]);
    const user = useSelector(store => store.user); // update by will be dcm user 
    defaultInput.UpdatedBy = user | 'Login Error';
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    
    defaultInput.DCMUser = user ;

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Time and Attendance');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);


    // Current State
    const [tableLoading, setTableLoading] = useState(true);

   
 
        // const originalInput = usePrevious(input);
     const [gridApi, setGridApi] = useState(null);
     const [gridColumnApi, setGridColumnApi] = useState(null);
     const [rowparams, setrowparams] = useState(null);
    
          //Backdrop
     const [open, setOpen] = React.useState(false);
    
    
          //CSS Classes 
     const classes = useToolbarStyles();

    // Parameter handlers for modal
    const startDateHandler = (e) => { setInputName('StartDate', inputToDate(e.currentTarget.value)) };
    const endDateHandler = (e) => { setInputName('EndDate', inputToDate(e.currentTarget.value)) };
    const otExceptionHandler = (e) => { setInputName('OTException', booleanToOutput(e)) };
    const mealAllowanceHandler = (e) => { setInputName('MealAllowance', booleanToOutput(e)) };

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const dateRange = useRef([]);
    const [FullName, setFullName] = useState('');

    const tableColumns = useMemo(() => ([
        { Header: 'Operator ID', accessor: 'OperatorID', modalType: 'textbox' },
        { Header: 'Full Name', accessor: 'FullName', modalType: 'textbox' },
        { Header: 'Task Type', accessor: 'TaskType', modalType: 'textbox' },
        { Header: 'Start Date', accessor: 'StartDate', Filter: SelectDate, filter: 'dateFrom', modalType: 'textbox', Cell: DateCell, FilterValue: startDate, SetFilterValue: setStartDate },
        { Header: 'Start Time', accessor: 'StartTime', modalType: 'textbox' },
        { Header: 'End Date', accessor: 'EndDate', Filter: SelectDate, filter: 'dateTo', modalType: 'textbox', Cell: DateCell, FilterValue: endDate, SetFilterValue: setEndDate },
        { Header: 'End Time', accessor: 'EndTime', modalType: 'textbox' },
        { Header: 'Actual Time', accessor: 'ActualTime', modalType: 'textbox' },
        { Header: 'Total Break', accessor: 'TotalBreak', modalType: 'textbox' },
        { Header: 'From Location', accessor: 'FromLocation', modalType: 'textbox' },
        { Header: 'To Location', accessor: 'ToLocation', modalType: 'textbox' },
        { Header: 'Product Code', accessor: 'ProductCode', modalType: 'textbox' },
        { Header: 'Product Weight', accessor: 'ProductWeight', modalType: 'textbox' },
       
        { Header: 'Product Cube', accessor: 'ProductCube', modalType: 'textbox' },
        { Header: 'Pick Quantity', accessor: 'PickQuantity', modalType: 'textbox' },
        { Header: 'Product Description', accessor: 'ProductDescription', modalType: 'textbox' },
        { Header: 'FullCase/SplitCase', accessor: 'FullCase_SplitCase', modalType: 'textbox' },
        { Header: 'Team Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'  },
        { Header: 'ID', accessor: 'ID', modalType: 'textbox' },
        { Header: 'Batch Number', accessor: 'BatchNumber', modalType: 'textbox' },
        { Header: 'Updated By', accessor: 'UpdatedBy', modalType: 'textbox' },
        { Header: 'Comment', accessor: 'Comment', modalType: 'textbox' },
    ]), [startDate, setStartDate, endDate, setEndDate]);

    // Event Handlers for Table
    const addTableHandler = () => {
        setShowModal(true);
        setModalMode(1);
        setInput(defaultInput);
        setModalMessage('');
        setModalMessageError('');
    };

    const updateTableHandler = (data) => {
       
        data = { ...data, StartDate: dateObjToDate(data.StartDate), EndDate: dateObjToDate(data.EndDate) };
        data.UpdateBy = user;
        data.DCMUser = user;
        setShowModal(true);
        setModalMode(2);
        setInput(data);
        setOriginalInput(data);
        setModalMessage('');
        setModalMessageError('');
    };

   

    const getTable = async (startDate, endDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            StartDate: startDate,
            EndDate: endDate,
            DCMUser: user
        });
        setTableLoading(true);
        await api.post('/Maintenance/TransactionHistory/GetCCATransaction', body).then(
            res => {
                let data = res.data;
                // Convert dates to date objects  
            
                data = data.map(x => {
                   
                    x.StartDate = dateToDateObj(x.StartDate);
                    
                    if (x.EndDate)
                    {
                         x.EndDate = dateToDateObj(x.EndDate);
                    }
                   
                    return x;
                });

          
                setTableData(data);
                setTableLoading(false);
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {
                        console.log(err.response)
                    }
                    else {
                    }
                }
            );
    };

    const updateHandler = async () => { // TODO: Update event handler
       
        if (!checkChange(originalInput, input)) {
            setModalMessageError('Error: No changes have been made.');
            setLoadModal(false);
            return;
        }

       
        if (dateToDateObj(input.EndDate) < dateToDateObj(input.StartDate)) {
            setModalMessageError(`Error: Start date after end date. Please set end date after start date.`);
            setLoadModal(false);
            return;
        }

        //check if log on is after log off
        if (isStartDateTimeSmallerThanEndDateTime(input.StartDate, input.StartTime, input.EndDate, input.EndTime) === false) {
            setModalMessageError('Error: Log on time cannot be greater than log off time!');
            setLoadModal(false);
            return;
        }

  input.UpdatedBy = user ;
       
let body = new URLSearchParams(input);
        await api.post('/Maintenance/TransactionHistory/UpdateTransaction', body).then(
            res => {
                let response = res.data;

                if (response === 'Transaction Updated') {
                    setModalMessage(`Transaction Updated`);
                    // Update table on the frontend
                    let data = tableData.slice();
                    let index = data.map(x => x.ID).indexOf(originalInput.ID);

                    // Convert input to appropriate data type
                    let newTableInput = Object.assign({},input);
                    newTableInput.StartDate = dateToDateObj(newTableInput.StartDate);
                    newTableInput.EndDate = dateToDateObj(newTableInput.EndDate);
                    data[index] = newTableInput;

                    setTableData(data);
                }
              
                else {
                    setModalMessageError(response);
                }
                setLoadModal(false);
            }).catch(
                err => { // TODO: Error handling
                    //console.log(err);
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                    setLoadModal(false);
                }
            );
    };
   

    const onSubmit = (event) => { // Form switchs submit eveent
        event.preventDefault();
        setLoadModal(true);
        setModalMessage('');
        setModalMessageError('');

        if (modalMode === 1) {
           
        }
        else {
            updateHandler(event);
        }
    };

    useEffect(() => { // Update table on date filter change
        if (startDate && endDate) {
            if (checkValidInput(startDate) && checkValidInput(endDate)) { // Only update table if valid dates
                const startDateObj = inputToDateObj(startDate);
                const endDateObj = inputToDateObj(endDate);
                console.log(dateRange);
                if (startDateObj <= dateRange.current[0] || endDateObj > dateRange.current[1]) {
                    getTable(inputToDate(startDate), inputToDate(endDate));
                    dateRange.current = [startDateObj, endDateObj];
                }
            }
        }
    }, [startDate, endDate]);

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add Transaction');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Transaction');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Data
        // Default date range [today,today]
        dateRange.current = [today, today]; // Store current date range

        setStartDate(dateObjToInput(today));
        setEndDate(dateObjToInput(today));

        // Retrieve Dropdown Dat
    }, []);

    // TODO: Add Modal fields
    return (
        <div>
            <TableScreen
                table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle}  isLoading={tableLoading}
                     editHandler={updateTableHandler} ></Table>}
                modal={
                    <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} unrestrictWidth={true}
                        setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                         <div className='modal-grouping--col-4'>
                            
                            <TextField name='BatchNumber' label='Batch Number' value={input.BatchNumber} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='FullName' label='Full Name' value={input.FullName} onChange={handleInputEvent} restrictions='name' disabled={true}></TextField>
                            <TextField name='TaskType' label='Task Type' value={input.TaskType} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='ID' label='ID' value={input.ID} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='StartDateTime' label='Start Date' value={dateToInput(input.StartDate)} onChange={startDateHandler} type='date' required disabled={true}></TextField>
                            <TextField name='StartTime' label='Start Time' value={input.StartTime} onChange={handleInputEvent} type='time' required disabled={true}></TextField>
                            <TextField name='EndDateTime' label='End Date' value={dateToInput(input.EndDate)} onChange={endDateHandler} type='date' required  disabled={true}></TextField>
                            <TextField name='EndTime' label='End Time' value={input.EndTime} onChange={handleInputEvent} type='time' required ></TextField>
                            <TextField name='ActualTime' label='Actual Time' value={input.ActualTime} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='TotalBreak' label='Total Break' value={input.TotalBreak} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='From Location' label='From Location' value={input.FromLocation} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='From Location' label='To Location' value={input.ToLocation} onChange={handleInputEvent} disabled={true} ></TextField>
                            <TextField name='ProductCode' label='Product Code' value={input.ProductCode} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='ProductCube' label='Product Cube' value={input.ProductCube} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='ProductWeight' label='Product Weight' value={input.ProductWeight} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='PickQuantity' label='Pick Quantity' value={input.PickQuantity} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='Product Description' label='Product Description' value={input.ProductDescription} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='FullCase_SplitCase' label='FullCase/SplitCase' value={input.FullCase_SplitCase} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='OperatorID' label='Operator ID' value={input.OperatorID} onChange={handleInputEvent} restrictions='default' disabled={true} ></TextField>
                            <TextField name='Comment' label='Comment' value={input.Comment} onChange={handleInputEvent} restrictions='default' required ></TextField>
                           


                         
                     

                            
                        </div>
                    </Modal>}
            />
        </div>

    )
};

export default TransactionHistory;  