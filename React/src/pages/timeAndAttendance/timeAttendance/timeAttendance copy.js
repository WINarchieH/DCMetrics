import React, { useState, useEffect, useMemo, useRef } from 'react';

import { useSelector } from 'react-redux';
import '../../../assets/common.scss';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectColumnFilter, SelectDate, SelectMultipleFilter } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, { checkChange } from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { formatDate,inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput, isStartDateTimeSmallerThanEndDateTime, dateObjToInput } from '../../../components/fields/dateHelpers';
import DropDown from '../../../components/fields/dropdown';
import Toggle, { booleanToOutput, outputToBoolean } from '../../../components/fields/toggle';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import {orderDatetime} from '../../../components/table/sortingFunctions';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import AlarmIcon from '@material-ui/icons/Alarm';
import '../../../assets/_modal.scss';
import Clock from '../../../components/icons/Clock.png';
const tableTitle = 'Time and Attendance';

const defaultInput = {
    'UserID': '',
    'FirstName': '',
    'SurName': '',
    'ShiftCode': '',
    'StartDate': '',
    'StartTime': '',
    'EndDate': '',
    'EndTime': '',
    'ShiftStart': '',
    'ShiftEnd': '',
    'Approved': '',
    'ReasonForUpdate': '',
    'UpdateBy': '',
    'ID': '',
    'OTException': '',
    'Site': '',
    'CallBack': '',
    'MealAllowance': '',
    'FullName': '',
    'OTAtStart':'',
    'OTAtEnd':'',
    'ShiftType':'',
    'TeamManager':''
};

// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'Reason For Update': [],
    'UserList': []
};

const today = new Date();

const TimeAttendance = () => {
    defaultInput.StartDate = dateObjToInput(today);
    defaultInput.EndDate = dateObjToInput(today);

    const [tableData, setTableData] = useState([]);
    const user = useSelector(store => store.user); // update by will be dcm user 
    defaultInput.UpdateBy = user | 'Login Error';
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Time and Attendance');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [userDate, setuserDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [userendDate, setuserendDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [originalInput, setOriginalInput] = useInputState(null);
    const [originalInputobj, setOriginalInputobj] = useState('');

    // Current State
    const [tableLoading, setTableLoading] = useState(true);

    // Parameter handlers for modal
    const startDateHandler = (e) => { setInputName('StartDate', inputToDate(e.currentTarget.value)) };
    const endDateHandler = (e) => { setInputName('EndDate', inputToDate(e.currentTarget.value)) };
    const otExceptionHandler = (e) => { setInputName('OTException', booleanToOutput(e)) };
    const mealAllowanceHandler = (e) => { setInputName('MealAllowance', booleanToOutput(e)) };
    const OTatStarthandler = (e) => { setInputName('OTAtStart', booleanToOutput(e)) };
    const OTatEndhandler = (e) => { setInputName('OTAtEnd', booleanToOutput(e)) };

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const dateRange = useRef([]);
    const [FullName, setFullName] = useState(null);

    const [shifttype, setshiftype] = useState([]);
    const [shiftcode, setshiftcode] = useState([]);

    const tableColumns = useMemo(() => ([
        { Header: 'User ID', accessor: 'UserID', modalType: 'textbox' },
        { Header: 'First Name', accessor: 'FirstName', modalType: 'textbox' },
        { Header: 'Surname', accessor: 'SurName', modalType: 'textbox' },
        { Header: 'Start Date', accessor: 'StartDate', Filter: SelectDate, filter: 'dateFrom', modalType: 'textbox', Cell: DateCell, FilterValue: startDate, SetFilterValue: setStartDate, sortType: orderDatetime },
        { Header: 'End Date', accessor: 'EndDate', Filter: SelectDate, filter: 'dateTo', modalType: 'textbox', Cell: DateCell, FilterValue: endDate, SetFilterValue: setEndDate, sortType: orderDatetime },
        { Header: 'Start Time', accessor: 'StartTime', modalType: 'textbox' },
        { Header: 'End Time', accessor: 'EndTime', modalType: 'textbox' },
        { Header: 'Shift Start', accessor: 'ShiftStart', modalType: 'textbox' },
        { Header: 'Shift End', accessor: 'ShiftEnd', modalType: 'textbox' },
        { Header: 'Manager', accessor: 'TeamManager',  Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'OT At Start', accessor: 'OTAtStart', modalType: 'textbox' },
        { Header: 'OT At End', accessor: 'OTAtEnd', modalType: 'textbox' },
        { Header: 'Reason For Update', accessor: 'ReasonForUpdate', modalType: 'textbox' },
        { Header: 'Update By', accessor: 'UpdateBy', modalType: 'textbox' },
        { Header: 'Approved', accessor: 'Approved', modalType: 'textbox', Filter: SelectColumnFilter, filter: 'equality' },
        { Header: 'Shift Type', accessor: 'ShiftType',  Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue : shifttype, SetFilterValue : setshiftype },
        { Header: 'Shift Code', accessor: 'ShiftCode', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue : shiftcode, SetFilterValue : setshiftcode},
        { Header: 'ID', accessor: 'ID', modalType: 'textbox' },
        { Header: 'OT Exception', accessor: 'OTException', modalType: 'toggle' },
        { Header: 'Site', accessor: 'Site', modalType: 'textbox' },
        { Header: 'Call Back', accessor: 'CallBack', modalType: 'textbox' },
        { Header: 'Meal Allowance ', accessor: 'MealAllowance', modalType: 'textbox' }

    ]), [startDate, setStartDate, endDate, setEndDate,shifttype, setshiftype, shiftcode, setshiftcode]);

    // Event Handlers for Table
    const addTableHandler = () => {
        setuserDate(dateToInput(inputToDate(formatDate(new Date()))));
        setuserendDate(dateToInput(inputToDate(formatDate(new Date()))))
        setShowModal(true);
        setModalMode(1);
        setInput(defaultInput);
        setModalMessage('');
        setModalMessageError('');

    };

    const updateTableHandler = (data) => {

        
        data = { ...data, StartDate: dateObjToDate(data.StartDate), EndDate: dateObjToDate(data.EndDate) };
        data.UpdateBy = user;
        setShowModal(true);
        setModalMode(2);
        setInput(data);
        setuserDate(dateToInput(data.StartDate));
        setuserendDate(dateToInput(data.EndDate))
        setOriginalInput(data);
        setOriginalInputobj(data);
        setModalMessage('');
        setModalMessageError('');
     

    };

    const CheckBoxComponent = ({ data }) => {
        const approveHandler = () => {
            
            let checkedIndex = Object.keys(data).map((x) => Number(x));
            let checked = tableData.filter((row, idx) => (checkedIndex.includes(idx)));
            let checkedID = checked.map((row) => (row.ID));          

            let body = new URLSearchParams({
                'Approve': checkedID
            });

            if (checkedID) {
                api.post('/Maintenance/TimeAttendance/ApproveAllEntries', body).then(
                    res => {
                        if (res.data) {

                            window.alert('Selected Entries Approved');
                            window.location.reload();
                        }
                        else {
                            window.alert(res.data);
                        }
                    }

                ).catch(
                    err => { // TODO: Error handling
                        window.alert("Error: Failed to connect to server. Please try again.");
                    }
                );
            }

        };

        // const rejectHandler = () => {
        //     let checkedIndex = Object.keys(data).map((x) => Number(x));
        //     let checked = tableData.filter((row, idx) => (checkedIndex.includes(idx)));
        //     let checkedID = checked.map((row) => (row.ID));
        //     console.log(checked);
        //     console.log("checkid" + checkedID);
        // }

        return (
            <div className='set-div--row'>
                <Tooltip title='Approve'>
                    <IconButton aria-label='Approve' onClick={approveHandler}>
                        <CheckIcon />
                    </IconButton>
                </Tooltip>

            </div>
        )
    }

    const getTable = async (startDate, endDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            StartDate: startDate,
            EndDate: endDate,
            UpdateBy: user
        });
        setTableLoading(true);
        await api.post('/Maintenance/TimeAttendance/GetAllAttendence', body).then(
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

    const addHandler = () => { // TODO: Add event handler

        input.StartDate = inputToDate(userDate);
        input.EndDate = inputToDate(userendDate);
        //check if log on is after log off

        if (input.EndDate < input.StartDate)
        {
            setModalMessageError('Error: Start Date cannot be greater than End Date !');
            setLoadModal(false);
            return;

        }

         
         if (input.EndTime!= '')
         {

        if (isStartDateTimeSmallerThanEndDateTime(input.StartDate, input.StartTime, input.EndDate, input.EndTime) === false) {
            setModalMessageError('Error: Log on time cannot be greater than log off time!');
            setLoadModal(false);
            return;
        }
          }
        input.UpdateBy = user;

        let body = new URLSearchParams(input);

        api.post('/Maintenance/TimeAttendance/AddAttendance', body).then(
            res => {
                let response = res.data.response;

                if (response === 'Time and Attendance Transaction has been added successfully!') {
                    getTable(inputToDate(startDate), inputToDate(endDate));
                    setModalMessage(`Time and Attendance for user ${input.UserID} has been successfully added.`);
                }
                else {
                    setModalMessageError(response);
                }
                setLoadModal(false);
            }
        ).catch(
            err => { // TODO: Error handling
                console.log(err);
                setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                setLoadModal(false);
            }
        );
    };

    const updateHandler = async () => { // TODO: Update event handler
   
        
        input.StartDate = inputToDate(userDate);
        input.EndDate = inputToDate(userendDate);


        // if (!checkChange(originalInputobj, input)) {
        //     setModalMessageError('Error: No changes have been made in the Entry.');
        //     setLoadModal(false);
        //     return;
        // }

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

        let body = new URLSearchParams(input);
        await api.post('/Maintenance/TimeAttendance/UpdateAttendance', body).then(
            res => {
                let response = res.data.response;

                if (response === 'Time and Attendence Entry Updated') {
                    setModalMessage(`Entry updated.`);
                    // Update table on the frontend
                    let data = tableData.slice();
                    let index = data.map(x => x.UserID).indexOf(originalInput.UserID);

                    // Convert input to appropriate data type
                    let newTableInput = Object.assign({},input);
                    newTableInput.StartDate = dateToDateObj(newTableInput.StartDate);
                    newTableInput.EndDate = dateToDateObj(newTableInput.EndDate);


                    data[index] = newTableInput;


                    setTableData(data);
                }
                else if (response === 'Please update this record through the LeaveDetails') {
                    setModalMessageError(`Error: Please update this record through LeaveDetails`);
                }
                else if (response === 'Leave must be assigned from UserDetails window') {
                    setModalMessageError(`Error: Leave must be assigned from UserDetails window`);
                }
                else {
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
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

    //StartDate Change Handler
   const changestartDate = (e) =>
   {
       setuserDate(e.target.value);
       setuserendDate(e.target.value);
      

   };

    //EndDate Change Handler

    const changeendDate = (e) =>
    {
        setuserendDate(e.target.value);

    } 


    const deleteHandler = async (rowData) => { // TODO: Delete event handler
        // Delete row from table
        let data = tableData.slice();
        let index = data.indexOf(rowData);
       

        // API Call
        let body = new URLSearchParams({
            UserID: rowData.UserID,
            ID: rowData.ID,
            UpdateBy: user
        });
        await api.post('/Maintenance/TimeAttendance/DeleteAttendance', body).then(
            res => {
              let response = res.data.response;

              if (response ==="Selected Entry Deleted from the Database")
              {

                data.splice(index, 1);
                setTableData(data);
              }
              else if (response === "Please delete this record through the Leave Management screen")
              {
                  window.alert(response);
              }
              else
              {
                  window.alert(response);
              }
            }
        ).catch(
            err => { // TODO: Error handling
               window.alert(err);
            }
        );
    };

    const updateRosterHandler = async (rowData) => {

        setModalMessage('');
        setModalMessageError('');
        let data = tableData.slice();
        let index = data.indexOf(rowData);
        data.splice(index, 1);
        setTableData(data);

        // API Call
        let body = new URLSearchParams({
            UserID: rowData.UserID,
            ID: rowData.ID,
            ShiftStart: rowData.ShiftStart,
            ShiftEnd: rowData.ShiftEnd
        });

        if (rowData.ShiftStart === '' || rowData.ShiftEnd === '') {
            setModalMessageError('Roster Start and End Times need to be selected');
        }
        else if (isStartDateTimeSmallerThanEndDateTime('2020-11-26', rowData.ShiftStart, '2020-11-26', rowData.ShiftEnd) === false) {
            setModalMessageError('Roster Start time needs to be smaller than roster end time!');
        }
        else {
            await api.post('/Maintenance/TimeAttendance/UpdateRoster', body).then(
                res => {
                    let response = res.data.response;

                    if (response ==='Roster is updated for the user.')
                    {
                        let data = tableData.slice();
                        let index = data.map(x => x.UserID).indexOf(originalInput.UserID);
    
                        // Convert input to appropriate data type
                        let newTableInput = Object.assign({},input);
                        newTableInput.StartDate = dateToDateObj(newTableInput.StartDate);
                        newTableInput.EndDate = dateToDateObj(newTableInput.EndDate);
    
    
                        data[index] = newTableInput;
    
    
                        setTableData(data);
                    }
                    setModalMessage(response);
                    //console.log(res.data.response);
                }
            ).catch(
                err => { // TODO: Error handling
                    console.log(err);
                }
            );
        }


    };

    const UserListChange = (event) => {
       
            const username = event.target.value;
            if (username) {
                var names = username.split(' ');
                input.FirstName = names[0];
                input.SurName = names[names.length-2];
    
                names[names.length-1] = names[names.length-1].replace('(', '').replace(')', '');
                input.UserID = names[names.length-1];
               
                setFullName(username);
            }
        };
    const onSubmit = (event) => { // Form switchs submit eveent
        event.preventDefault();
        setLoadModal(true);
        setModalMessage('');
        setModalMessageError('');

        if (modalMode === 1) {
            addHandler(event);

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
             
                if (startDateObj <= dateRange.current[0] || endDateObj > dateRange.current[1]) {
                    getTable(inputToDate(startDate), inputToDate(endDate));
                    dateRange.current = [startDateObj, endDateObj];
                }
            }
        }
    }, [startDate, endDate]);

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add Attendance');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Time and Attendance');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Data
        // Default date range [today,today]
        dateRange.current = [today, today]; // Store current date range

        setStartDate(dateObjToInput(today));
        setEndDate(dateObjToInput(today));

        // Retrieve Dropdown Data
        api.post('/Maintenance/TimeAttendance/getAllReasons').then( // Reasons Codes List 
            res => {
                let data = res.data;
                dropdownData['Reason For Update'] = data.map(x => x['reasonCodes']);
            });

        api.post('/Maintenance/Pickers/GetAllUserNames').then( // Reasons Codes List 
            res => {
                let data = res.data;
                dropdownData['UserList'] = data.map(x => x);
            }).catch(() => {});
    }, []);

    // TODO: Add Modal fields
    return (
        <div>
            <TableScreen
                table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle} CheckBoxComponent={CheckBoxComponent} isLoading={tableLoading}
                    addHandler={addTableHandler} editHandler={updateTableHandler} deleteHandler={deleteHandler}></Table>}
                modal={
                    <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} unrestrictWidth={true}
                        setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                        <div className={modalMode === 1 ? 'modal-grouping--col-4' : 'modal-grouping--col-5'}>
                            <DropDown className="UserListDropDown modal-fields--outline" name='FullName' label='User List' options={dropdownData['UserList']} hidden={modalMode === 1 ? null : true} defaultValue={FullName} disabled={modalMode === 1 ? null : true} onChange={UserListChange} required></DropDown>
                            <TextField name='UserID' label='User ID' value={input.UserID} onChange={handleInputEvent} restrictions='default' disabled={true} hidden={modalMode === 1 ? true : null}></TextField>
                            <TextField name='FirstName' label='First Name' value={input.FirstName} onChange={handleInputEvent} restrictions='name' disabled></TextField>
                            <TextField name='SurName' label='Surname' value={input.SurName} onChange={handleInputEvent} restrictions='name' disabled></TextField>
                        </div>
                        <div className='modal-grouping--col-4'>
                            <div className='modal-item'>
                            <label className='label label--position' >Start Date</label>
                            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value ={userDate} onChange={changestartDate} required ></input>
                            </div>
                          
                            
                            <TextField name='StartTime' label='Start Time' value={input.StartTime} onChange={handleInputEvent} type='time' required></TextField>
                            <DropDown name='ReasonForUpdate' label='Reason For Update' options={dropdownData['Reason For Update']} defaultValue={input.ReasonForUpdate} onChange={handleInputEvent} required></DropDown>
                            <TextField name='ShiftStart' label='Shift Start' value={input.ShiftStart} onChange={handleInputEvent} type='time' ></TextField>
                            <div className='modal-item'>
                            <label className='label label--position' >End Date</label>
                            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value ={userendDate} onChange={changeendDate} required={modalMode === 1 ? null : true} ></input>
                            </div>
                    
                            <TextField name='EndTime' label='End Time' value={input.EndTime} onChange={handleInputEvent} type='time' required ={modalMode === 1 ? null : true}></TextField>
                            
                            <TextField name='UpdateBy' label='Update By' value={input.UpdateBy}  disabled required></TextField>
                            <TextField name='ShiftEnd' label='Shift End' value={input.ShiftEnd} onChange={handleInputEvent} type='time' ></TextField>
                        
                            <Toggle name='OTException' label='OT Exception' checked={outputToBoolean(input.OTException)} onChange={otExceptionHandler} required></Toggle>
                            {/*<TextField name='CallBack' label='Call Back' value={input.CallBack} onChange={handleInputEvent}  required></TextField>*/}
                            <Toggle name='MealAllowance' label='Meal Allowance' checked={outputToBoolean(input.MealAllowance)} onChange={mealAllowanceHandler} required></Toggle>
                            <Toggle name='OTAtStart' label='OT at Start' checked={outputToBoolean(input.OTAtStart)} onChange={OTatStarthandler}></Toggle>
                           
                           
                            <Tooltip title="Update Roster">
                                <IconButton aria-label="assign leave" onClick={() => { updateRosterHandler(input) }} >
                                <img width={25} height={25} src ={Clock}></img>
                                </IconButton>
                            </Tooltip>

                            <Toggle name='OTAtEnd' label='OT at End' checked={outputToBoolean(input.OTAtEnd)} onChange={OTatEndhandler} ></Toggle>
                           
                           
                            <div></div>
                            </div>
                        
                    </Modal>}
            />
        </div>

    )
};

export default TimeAttendance;