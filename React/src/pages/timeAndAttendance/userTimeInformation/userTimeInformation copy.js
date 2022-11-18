import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import {DateCell} from '../../../components/table/tableCells';
import {SelectDate} from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput} from '../../../components/fields/dateHelpers';
// import Toggle, {booleanToOutput, outputToBoolean} from '../../../components/fields/toggle';
import {useInputState, usePrevious} from '../../../components/hooks/hooks';
import {orderDatetime} from '../../../components/table/sortingFunctions';

const tableTitle = 'User Time Information';

const defaultInput = {
    'UserID': '',
    'FirstName': '',
    'Surname': '',
    'ShiftCode': '',
    'StartDate': '',
    'StartTime': '',
    'EndDate': '',
    'EndTime': '',
    'ShortBreakStart':'',
    'ShortBreakEnd':'',
    'ShortBreak':'',
    'LongBreakStart':'',
    'LongBreakEnd':'',
    'LongBreak':'',
    'OtherBreakStart':'',
    'OtherBreakEnd':'',
    'OtherBreak':'',
    'UpdatedBy':'',
    'DCMUser': ''
};

// Relabelling Dropdown labels
// const dropdownLabels = {
// };

const UserTimeInformation =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const user = useSelector(store => store.user); 
    
    defaultInput.DCMUser = user ;

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('User Time Information'); 
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);

    // Current State
    const [tableLoading, setTableLoading] = useState(true);

    // Parameter handlers for modal
    const startDateHandler = (e) => { setInputName('StartDate', inputToDate(e.currentTarget.value)) };
    const endDateHandler = (e) => { setInputName('EndDate', inputToDate(e.currentTarget.value)) };

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const dateRange = useRef([]);
    
    const tableColumns = useMemo(() => [
        {Header: 'Employee ID', accessor: 'UserID', modalType: 'textbox'},
        {Header: 'First Name', accessor: 'FirstName', modalType: 'textbox'},
        {Header: 'Surname', accessor: 'Surname', modalType: 'textbox'}, 
        {Header: 'Start Date', accessor: 'StartDate', Filter: SelectDate, filter: 'dateFrom', modalType: 'textbox', Cell: DateCell, FilterValue: startDate, SetFilterValue: setStartDate, sortType: orderDatetime},
        {Header: 'Start Time', accessor: 'StartTime', modalType: 'textbox'},
        {Header: 'End Date', accessor: 'EndDate',  Filter: SelectDate, filter: 'dateTo', modalType: 'textbox', Cell: DateCell, FilterValue: endDate, SetFilterValue: setEndDate, sortType: orderDatetime},
        {Header: 'End Time', accessor: 'EndTime', modalType: 'textbox'},
        {Header: 'Short Break Start', accessor: 'ShortBreakStart', modalType: 'textbox'},
        {Header: 'Short Break End', accessor: 'ShortBreakEnd', modalType: 'textbox'},
        {Header: 'Short Break', accessor: 'ShortBreak', modalType: 'textbox'},
        {Header: 'Long Break Start', accessor: 'LongBreakStart', modalType: 'textbox'},
        {Header: 'Long Break End', accessor: 'LongBreakEnd', modalType: 'textbox'},
        {Header: 'Long Break', accessor: 'LongBreak', modalType: 'textbox'},
        {Header: 'Other Break Start', accessor: 'OtherBreakStart', modalType: 'textbox'},
        {Header: 'Other Break End', accessor: 'OtherBreakEnd', modalType: 'textbox'},
        {Header: 'Other Break', accessor: 'OtherBreak', modalType: 'textbox'},
        
        {Header: 'Allowance', accessor: 'Allowance', modalType: 'textbox'},
    ], [startDate, endDate, setStartDate, setEndDate]);
    

    // Event Handlers for Table
    const updateTableHandler = (data) => {
        data = {...data, StartDate: dateObjToDate(data.StartDate), EndDate: dateObjToDate(data.EndDate)};
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
        await api.post('/Maintenance/UserTimeInformation/GetAllEntries', body).then( 
            res => {
                let data = res.data;  
                // Convert dates to date objects  
                data = data.map(x => {
                    x.StartDate = dateToDateObj(x.StartDate);
                    x.EndDate = dateToDateObj(x.EndDate);
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
        if (dateToDateObj(input.EndDate) < dateToDateObj(input.StartDate)) {
            setModalMessageError(`Error: Start date after end date. Please set end date after start date.`);
            setLoadModal(false);
            return;
        }
       

        if (input.StartTime > input.EndTime ) {
            setModalMessageError(`Error: Start Time after end Time. Please set end Time after start Time.`);
            setLoadModal(false);
            return;
        }

        if (input.ShortBreakStart > input.ShortBreakEnd ) {
            setModalMessageError(`Error: ShortBreak End Time after shortBreak end Time. Please set end Time after start Time.`);
            setLoadModal(false);
            return;
        }

        if (input.LongBreakStart > input.LongBreakEnd ) {
            setModalMessageError(`Error: LongBreak Start Time after Long Break EndTime. Please set end Time after start Time.`);
            setLoadModal(false);
            return;
        }

        if (input.OtherBreakStart > input.OtherBreakEnd ) {
            setModalMessageError(`Error: OtherBreak Start Time after OtherBreak End Time. Please set end Time after start Time.`);
            setLoadModal(false);
            return;
        }
        
        if (!checkChange(originalInput, input)) { 
            setModalMessageError('Error: No changes have been made.'); 
            setLoadModal(false);
            return;
        }
input.UpdatedBy = user;
input.DCMUser = user;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/UserTimeInformation/UpdateUserTimeEntry', body).then( 
            res => {
                let response = res.data;

                if (response === 'User Time Entry Updated')
                 { 
                    setModalMessage(`Roster for ${input.FirstName} updated.`); 
                    let data = tableData.slice();
                    let index = data.map(x => x.UserID).indexOf(originalInput.UserID);

                    // Convert input to appropriate data type
                    let newTableInput = Object.assign({},input);
                    newTableInput.StartDate = dateToDateObj(newTableInput.StartDate);
                    newTableInput.EndDate = dateToDateObj(newTableInput.EndDate);


                    data[index] = newTableInput;
                    setTableData(data);
                }
                else if (response === 'Changes are locked by payroll for this date. Please contact payroll supervisor.') 
                {
                    setModalMessageError(`Update Failed:Payroll Data is Locked for the User`);
                }
               
                else {
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`); 
                }
                setLoadModal(false);
            }).catch(
                err => { // TODO: Error handling
                    console.log(err);
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
        updateHandler(event);
    };

    const handleDateChange = useCallback(() => {
        if (startDate && endDate) {
            if (checkValidInput(startDate) && checkValidInput(endDate)) { // Only update table if valid dates
                const startDateObj = inputToDateObj(startDate);
                const endDateObj = inputToDateObj(endDate);
                
                if (startDateObj <= dateRange.current[0] || endDateObj > dateRange.current[1]) {
                  
                    getTable(inputToDate(startDate), inputToDate(endDate));
                    dateRange.current = [startDateObj, endDateObj];
                }
            }
        }
    }, [startDate, endDate]);

    useEffect(() => { // Update table on date filter change
        handleDateChange();
    }, [startDate, endDate, handleDateChange]);

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add User Time Information');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update User Time Information'); 
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Data
        // Default date range [today,today]
        let today = new Date();
        dateRange.current = [today, today]; // Store current date range
        today = dateObjToDate(today);

        setStartDate(dateToInput(today));
        setEndDate(dateToInput(today));
        
        }, []);

        // TODO: Add Modal fields
    return (
        <div>
            <TableScreen
                        table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading}
                                 editHandler={updateTableHandler} ></Table>}
                        modal={
                                <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal}  unrestrictWidth={true}
                                        setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                                    <div className='modal-grouping--col-3'>
                                    <TextField   name='UserID' label='User ID' value={input.UserID} onChange={handleInputEvent} required restrictions='default' disabled ></TextField>
                                    <TextField   name='FirstName' label='First Name' value={input.FirstName} onChange={handleInputEvent} required restrictions='default' disabled ></TextField>
                                    <TextField   name='Surname' label='Sur Name' value={input.Surname} onChange={handleInputEvent} required restrictions='default' disabled ></TextField>
                                    
                                    </div>
                                    <div className='modal-grouping--col-4'>
                                    <TextField name='StartDate' label='Start Date' value={dateToInput(input.StartDate)} onChange={startDateHandler} type='date' required></TextField>
                                <TextField name='StartTime' label='Start Time' value={input.StartTime} onChange={handleInputEvent} type='time' required></TextField>
                                <TextField name='EndDate' label='End Date' value={dateToInput(input.EndDate)} onChange={endDateHandler} type='date' required></TextField>
                                <TextField name='EndTime' label='End Time' value={input.EndTime} onChange={handleInputEvent} type='time' required></TextField>
                                    </div>
                                    <div className='modal-grouping--col-3'>
                                    <TextField name='ShortBreakStart' label='Short Break Start' value={input.ShortBreakStart} onChange={handleInputEvent} type='time' required></TextField>
                                    <TextField name='ShortBreakEnd' label='Short Break End' value={input.ShortBreakEnd} onChange={handleInputEvent} type='time' required></TextField>
                                    <TextField   name='Short Break' label='Short Break' value={input.ShortBreak} onChange={handleInputEvent} required restrictions='number' ></TextField>
                                    <TextField name='LongBreakStart' label='Long Break Start' value={input.LongBreakStart} onChange={handleInputEvent} type='time' required></TextField>
                                    <TextField   name='LongBreakEnd' label='Long Break End' value={input.LongBreakEnd} onChange={handleInputEvent} type='time' required ></TextField>
                                    <TextField name='LongBreak' label='Long Break'value={input.LongBreak} onChange={handleInputEvent} type='number' required></TextField>


                                    <TextField name='OtherBreakStart' label='Other Break Start' value={input.OtherBreakStart} onChange={handleInputEvent} type='time' required></TextField>
        
                                    <TextField name='OtherBreakEnd' label='Other Break End' value={input.OtherBreakEnd} onChange={handleInputEvent} type='time' required></TextField>
                                    <TextField   name='OtherBreak' label='Other Break' value={input.OtherBreak} onChange={handleInputEvent} required restrictions='number' ></TextField>

                                        </div>
                                
                                </Modal>
                        }
                    />
        </div>
        
    )
};

export default UserTimeInformation;