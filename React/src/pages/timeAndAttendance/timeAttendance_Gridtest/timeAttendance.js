import React, {   useState, useEffect, useMemo, useRef } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { render } from 'react-dom';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Screen from '../../../components/screen/screen';
import Header from '../../../components/header/header';
import { useSelector } from 'react-redux';
import '../../../assets/common.scss';
import api from '../../../components/api/api';
import Modal, { checkChange } from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { formatDate,inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput, isStartDateTimeSmallerThanEndDateTime, dateObjToInput } from '../../../components/fields/dateHelpers';
import DropDown from '../../../components/fields/dropdown';
import Toggle, { booleanToOutput, outputToBoolean } from '../../../components/fields/toggle';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';




import {ClockLoader} from "react-spinners";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import '../../../assets/_modal.scss';
import '../../../assets/panel.scss';
import './timeAttendenceGrid.scss';
import AutoCompleteEditor from'../../../components/agGridComponents/AutoCompleteEditor';
import DateEditor from '../../../components/agGridComponents/DateEditor';
import timeeditor from '../../../components/agGridComponents//timeeditor';
import ShiftTimeEditor from '../../../components/agGridComponents//ShiftTimeEditor';
import SaveIcon from '@material-ui/icons/Save';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Backdrop from '@material-ui/core/Backdrop';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import { lighten, makeStyles } from '@material-ui/core/styles';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import {  MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

import AlarmIcon from '@material-ui/icons/Alarm';

import Add from '../../../components/icons/Add.png';
import DownloadExcel from '../../../components/icons/Download_Excel.png';
import Edit from '../../../components/icons/Edit.png';
import Delete from '../../../components/icons/Bin.png';
import Clock from '../../../components/icons/Clock.png';

// Importing Ag Grid Community Version
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';





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
    'ShiftType':''
};

// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'Reason For Update': [],
    'UserList': []
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


const today = new Date();


const TimeAttendanceGrid = () => {
    defaultInput.StartDate = dateObjToInput(today);
    defaultInput.EndDate = dateObjToInput(today);

    const [tableData, setTableData] = useState([]);
    const gridRef = useRef(null);
    const user = useSelector(store => store.user); // update by will be dcm user
    defaultInput.UpdateBy = user | 'Login Error';
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);

    // Ag Grid Components
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [ToselectedDate, setToSelectedDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));

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

    //Parameters for Columns 

    const [columnsmodalmode, setcolumnsmodalmode] = useState(1);
    const [columnsmodalButtonName, setcolumnsmodalButtonName] = useState('Apply');
    const [showColumnsModal, setshowColumnsModal] = useState(false);
    const [loadcolumnsModal, setloadcolumnsModal] = useState(false);
    const [columnsmodalMessage, setcolumnsmodalMessage] = useState('');
    const [columnsmodalError, setcolumnsmodalError] = useState('');
    const [rowparams, setrowparams] = useState(null);

  
    //Backdrop
    const [open, setOpen] = React.useState(false);


    //cSS Classes 
    const classes = useToolbarStyles();



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

    const updateTableHandler =(params)=>
    {

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
       
    }

    // From Date Filter Change Method
       function handleDateChange(d) {
           
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



    const getTable = async (startDate, endDate) => { // TODO: API Request for table
       setOpen(true);
        let body = new URLSearchParams({
            StartDate: startDate,
            EndDate: endDate,
            UpdateBy: user
        });
       
        await api.post('/Maintenance/TimeAttendance/GetAllAttendence', body).then(
            res => {
                let data = res.data;
                // Convert dates to date objects
                data = data.map(x => {
                    x.StartDate = dateObjToDate(dateToDateObj(x.StartDate));
                    x.EndDate = dateObjToDate(dateToDateObj(x.EndDate));

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

    const addHandler = () => { // TODO: Add event handler

        input.StartDate = inputToDate(userDate);
        input.EndDate = inputToDate(userendDate);
        //check if log on is after log off
        
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
                        var rowNode = gridApi.getRowNode(input.ID);
                        var newData = input
                         rowNode.setData(newData);
                      
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
    //delete Handler
    // Row params
    const deleteHandler =  (params) => { // TODO: Delete event handler
        // Delete row from table
      
        // API Call

        let body = new URLSearchParams({
            UserID: params.data.UserID,
            ID: params.data.ID,
            UpdateBy: user
        });

        var r = window.confirm("Please confirm to delete this entry");
        if (r == true) 
        {
         api.post('/Maintenance/TimeAttendance/DeleteAttendance', body).then(
            res => {
              let response = res.data.response;
              if (response ==="Selected Entry Deleted from the Database")
              {
                    params.api.applyTransaction({
                    remove: [params.node.data]
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
                // Loading screen won't disappear because delete failed.
            }
         );
         }
      
    };


    // Drop change change method  for User List Dropdown and populating the FirstName and Surname Textbox in the add modal 
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

             //  Hide/Show Columns Modal
    
          const oncolumnsmodalSubmit = (event) => { // Form switchs submit eveent
             event.preventDefault();
             setloadcolumnsModal(true);
             setcolumnsmodalMessage('');
             setcolumnsmodalError('');

              if (columnsmodalmode === 1) {
                // addHandler(event);

                 }

            };


            const OpenColumnsModal = ()=>
            {
                setshowColumnsModal(true);
            }

      //Ag grid Row Styling

      //Ag Grid Options

      var gridOptions = {
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
        // editType: "fullRow",

      };

  


      const ActionRowButton = (params) => {
        return (

            <React.Fragment>

            <Tooltip title="Edit">
                                <IconButton aria-label="Edit"  onClick = {()=>updateTableHandler(params)} >
                                <img width={ 35 } height={35} src={Edit}></img>
                                </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                <IconButton aria-label="Delete"  onClick = {()=>deleteHandler(params)} >
                                <img width={ 35 } height={35} src={Delete}></img>
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

    useEffect(() => { // Update table on date filter change
        if (startDate && endDate) {

            if (checkValidInput(startDate) && checkValidInput(endDate)) { // Only update table if valid dates
                const startDateObj = inputToDateObj(startDate);
                const endDateObj = inputToDateObj(endDate);

                if (startDateObj <= dateRange.current[0] || endDateObj > dateRange.current[1]) {
                    // getTable(inputToDate(startDate), inputToDate(endDate));
                    getTable(inputToDate(formatDate(new Date())), inputToDate(formatDate(new Date())));
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

//backdrop
      

        <div>
         <Header></Header>

         <div>
      <Backdrop className={classes.backdrop} open={open}>
      <ClockLoader color="rgb(35,168,224)" loading={true}   size={50}></ClockLoader>
      </Backdrop>
        </div>
        <div className="screen-container">
           
        <div className="panel panel--table">
            <div className='table-full-container'>

          <div className="test-header">
          <React.Fragment>
              <div className = "title-header">
              <h4> DAILY VIEW</h4>
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
                onChange={handleDateChange}
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
                <Tooltip title='Add Entry'>
                <IconButton aria-label='Add Entry' onClick={()=> addTableHandler()} >
                <img width={ 35 } height={35} src={Add}></img>
                </IconButton>
                </Tooltip>
                <Tooltip title='Export CSV'>
                <IconButton aria-label='ExportCSV' onClick={()=>ExportDataToCSVFile()} >
                <img width={ 35 } height={35} src={DownloadExcel}></img>
                </IconButton>
                </Tooltip>
                {/* <Tooltip title='Hide Columns'>
                    <IconButton aria-label='ExportCSV' onClick={()=>OpenColumnsModal()} >
                        <MenuIcon />
                    </IconButton>
                </Tooltip> */}
             </div>


           </React.Fragment> 
        </div>
         
         
            <div className="ag-theme-alpine" style={{ width: '100%', height: 590 }}  >

         <AgGridReact rowHeight={50}

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
             minWidth: 190,
          }}
          
           pagination ={true}
           animateRows= {true}
           frameworkComponents={{
            autoCompleteEditor: AutoCompleteEditor,
            dateEditor: DateEditor,
            timeeditor:timeeditor,
            ShiftTimeEditor: ShiftTimeEditor
       }}
       rowSelection = "multiple"
       rowData={tableData}
     >

         <AgGridColumn headerName ="Action"  lockPosition = {true} cellRendererFramework = {ActionRowButton}   colId="Action"  editable = {false} filter={false} />
         <AgGridColumn headerName ="User ID" field="UserID"  editable={false} />
         <AgGridColumn  headerName ="First Name" field="FirstName" editable={false} />
         <AgGridColumn  headerName ="Surname" field="SurName" editable={false} />
         <AgGridColumn  headerName ="Start Date"field="StartDate"    editable={true}  filter = {false} cellEditor= "dateEditor"/>
         <AgGridColumn  headerName ="Start Time"field="StartTime"  cellEditor= "timeeditor"  filter= {false} />
         <AgGridColumn  headerName ="End Date"field="EndDate"  cellEditor= "dateEditor"   filter = {false} />
         <AgGridColumn  headerName ="End Time"field="EndTime" cellEditor= "timeeditor"  filter= {false}/>
         <AgGridColumn  headerName = "Manager" filter="agTextColumnFilter" field = "TeamManager" />
         <AgGridColumn  headerName ="Reason For Update"field="ReasonForUpdate"  filter="agTextColumnFilter" width = {250} cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options:dropdownData['Reason For Update']}}/>
         <AgGridColumn  headerName ="Shift Start"field="ShiftStart" cellEditor= "ShiftTimeEditor"  />
         <AgGridColumn  headerName ="Shift End"field="ShiftEnd" cellEditor= "ShiftTimeEditor" />
         <AgGridColumn  headerName ="OT At Start"field="OTAtStart"  cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: ["Y","N"]}}  />
         <AgGridColumn  headerName ="OT At End"field="OTAtEnd"  width={100} cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: ["Y","N"]}}/>
         <AgGridColumn  headerName ="Update By"field="UpdateBy" editable={false} />
         <AgGridColumn  headerName ="Approved"field="Approved" editable={false}/>
         <AgGridColumn  headerName ="ShiftType"field="ShiftType" cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: ["D","A","N"]}} />
         <AgGridColumn  headerName ="Shift Code"field="ShiftCode" editable={false} />
         <AgGridColumn  headerName ="ID"field="ID" editable={false} />
         <AgGridColumn  headerName ="OT Exception"field="OTException" cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: ["Y","N"]}}/>
         <AgGridColumn  headerName ="Site"field="Site" editable={false}/>
         <AgGridColumn  headerName ="Call Back"field="CallBack" />
         <AgGridColumn  headerName ="Meal Allowance"field="MealAllowance" cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: ["Y","N"]}}/>



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
                            <DropDown name='ReasonForUpdate' label='Reason For Update' options={dropdownData['Reason For Update']} defaultValue={input.ReasonForUpdate} onChange={handleInputEvent} required></DropDown>
                            <TextField name='ShiftStart' label='Shift Start' value={input.ShiftStart} onChange={handleInputEvent} type='time' ></TextField>
                            <div className='modal-item'>
                            <label className='label label--position' >End Date</label>
                            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value ={userendDate} onChange={changeendDate} required = {modalMode === 1 ? null : true} ></input>
                            </div>
                    
                            <TextField name='EndTime' label='End Time' value={input.EndTime} onChange={handleInputEvent} type='time' required = {modalMode === 1 ? null : true}></TextField>
                            
                            <TextField name='UpdateBy' label='Update By' value={input.UpdateBy}  disabled required></TextField>
                            <TextField name='ShiftEnd' label='Shift End' value={input.ShiftEnd} onChange={handleInputEvent} type='time' ></TextField>
                        </div>
                        <div className='modal-grouping--col-4'>
                            <Toggle name='OTException' label='OT Exception' checked={outputToBoolean(input.OTException)} onChange={otExceptionHandler} required></Toggle>
                            {/*<TextField name='CallBack' label='Call Back' value={input.CallBack} onChange={handleInputEvent}  required></TextField>*/}
                            <Toggle name='MealAllowance' label='Meal Allowance' checked={outputToBoolean(input.MealAllowance)} onChange={mealAllowanceHandler} required></Toggle>
                            <Toggle name='OTAtStart' label='OT at Start' checked={outputToBoolean(input.OTAtStart)} onChange={OTatStarthandler}></Toggle>
                            <Toggle name='OTAtEnd' label='OT at End' checked={outputToBoolean(input.OTAtEnd)} onChange={OTatEndhandler} ></Toggle>
                           
                            <Tooltip title="Update Roster">
                                <IconButton aria-label="assign leave" onClick={() => { updateRosterHandler(input) }} >
                                <img width={30} height={30} src ={Clock}></img>
                                </IconButton>
                            </Tooltip>

                           
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

export default TimeAttendanceGrid;