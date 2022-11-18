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
// Importing Ag Grid Community Version
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Screen from '../../../components/screen/screen';
import Header from '../../../components/header/header';

import SaveIcon from '@material-ui/icons/Save';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Backdrop from '@material-ui/core/Backdrop';
import {ClockLoader} from "react-spinners";
import AddIcon from '@material-ui/icons/Add';
import { lighten, makeStyles } from '@material-ui/core/styles';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import Edit from '@material-ui/icons/Edit';
import DateFnsUtils from '@date-io/date-fns';
import {  MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import './timeAttendenceGrid.scss';

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
    'TH': '',
    'DBL': '',
    'UpdateBy': '',
    'ID': '',
    'OTException': '',
    'TotalHrs': '',
    'Site': '',
    'FullName': '',
    'OTAtStart':'',
    'OTAtEnd':''
};

// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'Reason For Update': [],
    'UserList': []
};

const today = new Date();

const TimeAttendanceElite = () => {
    defaultInput.StartDate = dateObjToInput(today);
    defaultInput.EndDate = dateObjToInput(today);

    const [tableData, setTableData] = useState([]);
    const user = useSelector(store => store.user); // update by will be dcm user 
    defaultInput.UpdateBy = user | 'Login Error';
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const [selectedDate, setSelectedDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [ToselectedDate, setToSelectedDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));

       // const originalInput = usePrevious(input);
       const [gridApi, setGridApi] = useState(null);
       const [gridColumnApi, setGridColumnApi] = useState(null);
       const [rowparams, setrowparams] = useState(null);
      
            //Backdrop
       const [open, setOpen] = React.useState(false);

       const classes = useToolbarStyles();


    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Time and Attendance ELITE');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);
    const [userDate, setuserDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [userendDate, setuserendDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
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
    const [FullName, setFullName] = useState('');

    // 

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

   
    const updateTableHandler = (params) => {
        params.data.UpdateBy = user;
        setrowparams(params);
        setShowModal(true);
        setModalMode(2);
        setInput(params.data);
        setuserDate(dateToInput(params.data.StartDate));
        setuserendDate(dateToInput(params.data.EndDate))
        setOriginalInput(params.data);
        setOriginalInputobj(params.data);
        setModalMessage('');
        setModalMessageError('');
    };



        const approveHandler = () => {
            var data = gridApi.getSelectedNodes() ;
        
            
            let checkedIndex = Object.keys(data).map((x) => Number(x));
             let checked = tableData.filter((row, idx) => (checkedIndex.includes(idx)));
             let checkedID = checked.map((row) => (row.ID)); 
                      
            if(checkedID.length ===0)
            {
                alert("Please select rows for Approval");
                return;
            } 

            let body = new URLSearchParams({
                'Approve': checkedID
            });

            if (checkedID) {
                api.post('/Maintenance/TimeAttendance/ApproveAllEntries', body).then(
                    res => {
                        if (res.data) {

                            window.alert('Selected Approved');
                            gridApi.deselectAll();
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

    

    const getTable = async (startDate, endDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            StartDate: startDate,
            EndDate: endDate,
            UpdateBy: user
        });
        setOpen(true);
        await api.post('/Maintenance/TimeAttendance/GetAllAttendenceElite', body).then(
            res => {
                let data = res.data;
                // Convert dates to date objects  
                data = data.map(x => {
                    x.StartDate =  dateObjToDate(dateToDateObj(x.StartDate));
                    if (x.EndDate != '')
                    {
                    x.EndDate =  dateObjToDate(dateToDateObj(x.EndDate));
                    }
                    return x;
                   
             return x;
                });
                setTableData(data);
                setOpen(false);
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


    const ActionRowButton = (params) => {
        params.columnApi.autoSizeAllColumns();
        return (

            <React.Fragment>

                                <Tooltip title="Edit">
                                <IconButton aria-label="Edit"  onClick = {()=>updateTableHandler(params)} >
                                <Edit />
                                </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                <IconButton aria-label="Delete"  onClick = {()=>deleteHandler(params)} >
                                <DeleteOutline/>
                                </IconButton>
                                </Tooltip>
                                
            </React.Fragment>
        );
    };
       const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
       };


      const ExportDataToCSVFile =() =>
     {
          var excelParams = {
    
          fileName: 'Daily Views_'+user,
          skipHeader: false,
         };
          gridApi.exportDataAsCsv(excelParams);

     }

      //Ag grid Row Styling

      //Ag Grid Options

      var gridOptions = {
        debounceVerticalScrollbar: true,
        rowStyle: { borderBottom: 'rgb(255, 255, 255)',    fontFamily: 'Montserrat' ,  },
        getRowStyle: params =>
        {
            if (params.node.rowIndex % 2 === 0)
            {
                return { background: 'rgb(233,247,254)'  };

             }
             else
             {
                return { background: 'rgb(255,255,255)'};

             }
        },
        suppressClickEdit: true,

        onRowEditingStarted: (params) => {
          params.api.refreshCells({
            columns: ["Action"],
            rowNodes: [params.node],
            force: true
          });
        },
        getRowNodeId: function (data) {
            return data.ID;
          },
        onRowEditingStopped: (params) => {
          params.api.refreshCells({
            columns: ["Action"],
            rowNodes: [params.node],
            force: true
          });
        },
   

      };

        // From Date Filter Change Method
    function FromhandleDateChange(d) {
           
        if (d) {
            d.setHours(0, 0, 0, 0);
               }
         setSelectedDate(d);
         getTable(dateObjToDate(d),inputToDate(formatDate(new Date(ToselectedDate))));
      }
 
 // To Date Filter Change Method
     function handleToDateChange(d) {
         if (d) {
           d.setHours(0, 0, 0, 0);
           }
        setToSelectedDate(d);
        getTable( inputToDate(formatDate(new Date(selectedDate))),dateObjToDate(d));
    }

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

        if (input.MealAllowance ==='Y')
        {
            input.MealAllowance = '1'
        }

        let body = new URLSearchParams(input);

        api.post('/Maintenance/TimeAttendance/AddAttendance', body).then(
            res => {
                let response = res.data.response;

                if (response === 'Time and Attendance Transaction has been added successfully!') {
                    getTable(inputToDate(selectedDate), inputToDate(ToselectedDate));
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
                    var rowNode = gridApi.getRowNode(input.ID);
                    var newData = input
                    rowNode.setData(newData);
                    gridApi.deselectAll();
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
    
        // API Call
        let body = new URLSearchParams({
            UserID: rowData.data.UserID,
            ID: rowData.data.ID,
            UpdateBy: user
        });

        var r = window.confirm("Please confirm to delete this entry");
        if (r == true) 
        {
        await api.post('/Maintenance/TimeAttendance/DeleteAttendance', body).then(
            res => {
              let response = res.data.response;

              if (response ==="Selected Entry Deleted from the Database")
              {

                rowData.api.applyTransaction({
                    remove: [rowData.node.data]
                });
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
        }
    };

    const updateRosterHandler = async (rowData) => {

        setModalMessage('');
        setModalMessageError('');
       

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
                        var rowNode = gridApi.getRowNode(input.ID);
                        var newData = input
                        rowNode.setData(newData);
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

                  
                    getTable(inputToDate(startDate), inputToDate(endDate));
                    dateRange.current = [startDateObj, endDateObj];
                
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
        <Header></Header>

        <div>
     <Backdrop className={classes.backdrop} open={open}>
     <ClockLoader color="green" loading={true}   size={50}></ClockLoader>
     </Backdrop>
       </div>
       <div className="screen-container">
          
       <div className="panel panel--table">
           <div className='table-full-container'>

         <div className="test-header">
         <React.Fragment>
             <div className = "title-header">
             <h4>DAILY VIEWS</h4>
             </div>
             <div className = "date-header">
             <MuiPickersUtilsProvider utils={DateFnsUtils}>
             <KeyboardDatePicker
                style={{  margin: 0 }}
                margin="normal"
                id="fromDate-picker-dialog"
                format="dd/MM/yyyy"
                label="From Date"
                value={selectedDate}
                onChange={FromhandleDateChange}
                variant="inline"
                disableToolbar
                placeholder={'Please Select From Date'}
             />

             <KeyboardDatePicker
                style={{ margin: 0, paddingLeft:'3px' }}
                margin="normal"
                id="Todate-picker-dialog"
                label="To Date"
                format="dd/MM/yyyy"
                value={ToselectedDate}
                onChange={handleToDateChange}
                variant="inline"
                disableToolbar
                placeholder={'Please Select To Date'}
              />
            </MuiPickersUtilsProvider>
        </div>
    
            <div className ="add-header"> 
            <Tooltip title='Approve Selected Entries'>
               <IconButton  onClick={()=>approveHandler()} >
              <ThumbUpIcon></ThumbUpIcon>
               </IconButton>
               </Tooltip>

               <Tooltip title='Add Entry'>
               <IconButton aria-label='ExportCSV' onClick={()=>addTableHandler()} >
              <AddIcon></AddIcon>
               </IconButton>
               </Tooltip>
               <Tooltip title='Export CSV'>
               <IconButton aria-label='ExportCSV' onClick={()=>ExportDataToCSVFile()} >
               <SystemUpdateAltIcon />
               </IconButton>
               </Tooltip>
               
            </div>


          </React.Fragment> 
       </div>
         
            <div className="ag-theme-alpine" style={{ width: '100%', height: 590 }}  >

         <AgGridReact rowHeight={40}
            
             gridOptions={gridOptions}
             onGridReady={onGridReady}
             defaultColDef={{
             editable: true,
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             sortable: true,
             resizable: true,
             filter: true,
             floatingFilter : true,
             flex: 1,
             minWidth: 150,
            
          }}
           pagination ={true}
           animateRows= {true}
       rowSelection = "multiple"
       rowData={tableData}
     >

         <AgGridColumn headerName ="Action" headerCheckboxSelection ={true} checkboxSelection = {true}    lockPosition = {true} cellRendererFramework = {ActionRowButton}   colId="Action"  editable = {false} filter={false} />
        
         <AgGridColumn  headerName ="Employee ID" field="UserID" />
         <AgGridColumn  headerName ="Firstname" field="FirstName"  />
         
         <AgGridColumn  headerName ="Surname" field="SurName"   />
         <AgGridColumn  headerName ="Start Date" field="StartDate" filter={false}  />
         <AgGridColumn  headerName ="Start Time" field="StartTime" filter={false}  />
         <AgGridColumn  headerName ="End Date" field="EndDate"  filter = {false} />
         <AgGridColumn  headerName ="End Time" field="EndTime" filter = {false} />
         <AgGridColumn  headerName ="Shift Start" field="ShiftStart"  />      
         <AgGridColumn  headerName ="Shift End" field="ShiftEnd"  />
         <AgGridColumn  headerName ="Approved" field="Approved"  />
         <AgGridColumn  headerName ="Reason For Update" field="ReasonForUpdate" editable={false}  />
         <AgGridColumn  headerName ="Time And Half" field="TH"  />      
         <AgGridColumn  headerName ="Double" field="DBL"  />
         <AgGridColumn  headerName ="OT AT Start" field="OTAtStart"  />
         <AgGridColumn  headerName ="OT AT End" field="OTAtEnd"   />
         <AgGridColumn  headerName ="Shift Code" field="ShiftCode"  />
         <AgGridColumn  headerName ="Update By" field="UpdateBy"   />
         <AgGridColumn  headerName ="ID" field="ID"  />      
         <AgGridColumn  headerName ="OT Exception" field="OTException"  />
         <AgGridColumn  headerName ="Meal Allowance" field="MealAllowance"  />
         <AgGridColumn  headerName ="Total Hours" field="TotalHrs"  />
         <AgGridColumn  headerName ="Site" field="Site"   />
     </AgGridReact>
     </div>
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
                            <DropDown name='ReasonForUpdate' label='Reason For Update' options={dropdownData['Reason For Update']} defaultValue={input.ReasonForUpdate} onChange={handleInputEvent} required = {modalMode === 1 ? null : true}></DropDown>
                            <TextField name='ShiftStart' label='Shift Start' value={input.ShiftStart} onChange={handleInputEvent} type='time' ></TextField>
                            <div className='modal-item'>
                            <label className='label label--position' >End Date</label>
                            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value ={userendDate} onChange={changeendDate} required ></input>
                            </div>
                            <TextField name='EndTime' label='End Time' value={input.EndTime} onChange={handleInputEvent} type='time' required={modalMode === 1 ? null : true}></TextField>
                            {/* <TextField name='Approved' label='Approved' value={input.Approved} onChange={handleInputEvent}  required></TextField> */}
                            <TextField name='UpdateBy' label='Update By' value={input.UpdateBy}  disabled required></TextField>
                            <TextField name='ShiftEnd' label='Shift End' value={input.ShiftEnd} onChange={handleInputEvent} type='time' ></TextField>

                            <TextField name='TH' label='Time and Half' value={input.TH} onChange={handleInputEvent} disabled={true} ></TextField>
                            <TextField name='DBL' label='Double' value={input.DBL} onChange={handleInputEvent} disabled={true} ></TextField>
                            <TextField name='TotalHrs' label='Total Hrs' value={input.TotalHrs} onChange={handleInputEvent} disabled={true} ></TextField>
                            
                            <Tooltip title="Update Roster">
                                <IconButton aria-label="assign leave" onClick={() => { updateRosterHandler(input) }} >
                                    <AlarmIcon></AlarmIcon>
                                </IconButton>
                            </Tooltip>
                            <Toggle name='OTException' label='OT Exception' checked={outputToBoolean(input.OTException)} onChange={otExceptionHandler} required></Toggle>
                            
                            <Toggle name='MealAllowance' label='Meal Allowance' checked={outputToBoolean(input.MealAllowance)} onChange={mealAllowanceHandler} required></Toggle>
                            <Toggle name='OTAtStart' label='OT at Start' checked={outputToBoolean(input.OTAtStart)} onChange={OTatStarthandler}></Toggle>
                           <Toggle name='OTAtEnd' label='OT at End' checked={outputToBoolean(input.OTAtEnd)} onChange={OTatEndhandler} ></Toggle>

                           

                        </div>
                    </Modal>
     <div>

     </div>


            </div>

        </div>

                </div>
                </div>
    )
};
 
export default TimeAttendanceElite;