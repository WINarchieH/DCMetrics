import React, {useState, useEffect, useMemo, useRef} from 'react';
import '../../../assets/common.scss';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import {DateCell} from '../../../components/table/tableCells';
import {SelectMultipleFilter, SelectDate} from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import {formatDate, inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput, isStartDateTimeSmallerThanEndDateTime} from '../../../components/fields/dateHelpers';
import DropDown from '../../../components/fields/dropdown';
import {useInputState, usePrevious} from '../../../components/hooks/hooks';
import {orderDatetime} from '../../../components/table/sortingFunctions';
// Importing Ag Grid Community Version
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Screen from '../../../components/screen/screen';
import Header from '../../../components/header/header';

import SaveIcon from '@material-ui/icons/Save';

import Backdrop from '@material-ui/core/Backdrop';
import {ClockLoader, FadeLoader, PropagateLoader, MoonLoader} from "react-spinners";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import { lighten, makeStyles } from '@material-ui/core/styles';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

import DateFnsUtils from '@date-io/date-fns';
import {  MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AddgroupactivityModal from './addgroupIndirectActivityModal';
import './indirectActivityDetails.scss';
import DownloadExcel from '../../../components/icons/Download_Excel.png';
import Edit from '../../../components/icons/Edit.png';
import Delete from '../../../components/icons/Bin.png';
import Add from '../../../components/icons/Add.png';
import Groupadd from '../../../components/icons/groupindirectactivity.png'
//import GroupAdd from '@material-ui/icons/GroupAdd';

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


const tableTitle = 'Indirect Activity Details';

const defaultInput = {
    'SerialID': '',
    'UserName': '',
    'FirstName': '',
    'SurName': '',
    'TaskName': '',
    'StartDate': '',
    'StartTime': '',
    'EndDate': '',
    'EndTime': '',
    'DownTime': 0,
    'TotalTime': '',
    'Site': '',
};

// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'Task Name': [],
    'UserList':[]
};


const IndirectTasks =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1); 
    const [modalTitle, setModalTitle] = useState('Indirect Activity Details'); 
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [FullName, setFullName] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);
    const [selectedDate, setSelectedDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [ToselectedDate, setToSelectedDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));

    // group indirect activuty add modal
    const [groupactivityshowModal, setgroupactivityshowModal] = useState(false);
    const [groupactivityloadModal, setgroupactivityLoadModal] = useState(false);
    const [groupactivitymodalMessage, setgroupactivityModalMessage] = useState('');
    const [groupactivitymodalMessageError, setgroupactivityModalMessageError] = useState('');

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
         // const originalInput = usePrevious(input);
         const [gridApi, setGridApi] = useState(null);
         const [gridColumnApi, setGridColumnApi] = useState(null);
         const [rowparams, setrowparams] = useState(null);
        
              //Backdrop
         const [open, setOpen] = React.useState(false);


 
    // Parameter handlers for modal
    const startDateHandler = (e) =>
     {  setInputName('StartDate', inputToDate(e.currentTarget.value));
        
    };

    const endDateHandler = (e) => { setInputName('EndDate', inputToDate(e.currentTarget.value)) };

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    
    const dateRange = useRef([]);
    
    const tableColumns = useMemo(() => ([
        {Header: 'Serial ID', accessor: 'SerialID', modalType: 'textbox'},
        {Header: 'Employee ID', accessor: 'UserName', modalType: 'textbox'},
        {Header: 'First Name', accessor: 'FirstName', modalType: 'textbox'},
        {Header: 'Surname', accessor: 'SurName', modalType: 'textbox'},
        {Header: 'TaskName', accessor: 'TaskName', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},
        {Header: 'Start Date', accessor: 'StartDate', Filter: SelectDate, filter: 'dateFrom', modalType: 'textbox', Cell: DateCell, FilterValue: startDate, SetFilterValue: setStartDate, sortType: orderDatetime},
        {Header: 'Start Time', accessor: 'StartTime', modalType: 'textbox'},
        {Header: 'End Date', accessor: 'EndDate',  Filter: SelectDate, filter: 'dateTo', modalType: 'textbox', Cell: DateCell, FilterValue: endDate, SetFilterValue: setEndDate, sortType: orderDatetime},
        {Header: 'End Time', accessor: 'EndTime', modalType: 'textbox'},
        {Header: 'Downtime', accessor: 'DownTime', modalType: 'textbox'},
        {Header: 'Total Time', accessor: 'TotalTime', modalType: 'textbox'},
        {Header: 'Site', accessor: 'Site', modalType: 'textbox'},
        

    ]), [startDate, setStartDate, endDate, setEndDate]);

    // Event Handlers for Table

    const addgroupactivityHandler = () => {
        setgroupactivityshowModal(true);
      
    };

    const addTableHandler = () => {
        setShowModal(true);
        setModalMode(1);
        setInput(defaultInput);
        setModalMessage('');
        setModalMessageError('');
    };

    const updateTableHandler = (params) => {
        setrowparams(params);
        setShowModal(true);
        setModalMode(2);
        setInput(params.data);
        setOriginalInput(params.data);
        setModalMessage('');
        setModalMessageError('');
        setShowModal(true); 
     
    };


    const getTable = async (startDate, endDate) => { // TODO: API Request for table
        setOpen(true);
        let body = new URLSearchParams({ 
            StartDate: startDate,
            EndDate: endDate
        });

        await api.post('/DataCapture/IndirectActivityDetails/GetAllIndirectTransactions', body).then(
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
                });
                
                setTableData(data);
                setOpen(false);
            }).catch(
                err => {
                    setTableLoading(false);
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

        //check if task start time is after task end time
        if(isStartDateTimeSmallerThanEndDateTime(input.StartDate, input.StartTime, input.EndDate, input.EndTime) === false){
            setModalMessageError('Error: Task Start time cannot be greater than Task End time!'); 
            setLoadModal(false);
            return;
        }

        if (input.EndDate === '')
          {
           input.EndDate = input.StartDate;
          }
           input.StartTime = input.StartTime.trim();
           input.EndTime = input.EndTime.trim();
           let body = new URLSearchParams(input);

        api.post('/DataCapture/IndirectActivityDetails/AddIndirectTransaction', body).then( 
            res => {
                let response = res.data;

                if (response === 'New Indirect Transaction has been added') {
                    getTable(inputToDate(startDate), inputToDate(endDate));
                    setModalMessage(`Indirect Transaction for user ${input.FirstName} has been successfully added.`);
                }                
                else {
                    setModalMessage(response);
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
       

        //check if task start time is after task end time
        if(isStartDateTimeSmallerThanEndDateTime(input.StartDate, input.StartTime, input.EndDate, input.EndTime) === false){
            setModalMessageError('Error: Task Start time cannot be greater than Task End time!'); 
            setLoadModal(false);
            return;
        }

        let body = new URLSearchParams(input);
        await api.post('/DataCapture/IndirectActivityDetails/UpdateIndirectTransaction', body).then( 
            res => {
                let response = res.data;
               if (response === 'Indirect Activity Record is Updated') { 
                    setModalMessage(`Entry updated.`); 
                  
                    // Update table on the frontend
                    var rowNode = gridApi.getRowNode(input.SerialID);
                    var newData = input
                    rowNode.setData(newData);
                }
                
                else if (response.includes('Duplicate record found from import file for the day for User ')) { 
                    setModalMessageError(`Error: Duplicate record found from import file for the day for User ${input.UserName}` );
                }
                else {
                    setModalMessageError('Error: Failed to connect to server. Please try again.'); 
                }
                setLoadModal(false);
            }).catch(
                err => { // TODO: Error handling
                    console.log(err);
                    setModalMessageError('Error: Failed to connect to server. Please try again.'); 
                    setLoadModal(false);
                }
            );
    };

    const deleteHandler = async (rowData) => { // TODO: Delete event handler
        // Delete row from table
        // API Call
        let body = new URLSearchParams({ 
            SerialID: rowData.data.SerialID
        });

        var r = window.confirm("Please confirm to delete this entry");
        if (r == true) 
        {
        await api.post('/DataCapture/IndirectActivityDetails/DeleteIndirectTransaction/', body).then( 
            res => {
                
                rowData.api.applyTransaction({
                    remove: [rowData.node.data]
                });
            }
        ).catch(
            err => { // TODO: Error handling
                console.log(err);
                window.alert(err);
                // Loading screen won't disappear because delete failed.
            }
        );
        }
    };

    const ActionRowButton = (params) => {
        params.columnApi.autoSizeAllColumns();
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
    
          fileName: 'IndirectActivityDetails',
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
            return data.SerialID;
          },
        onRowEditingStopped: (params) => {
          params.api.refreshCells({
            columns: ["Action"],
            rowNodes: [params.node],
            force: true
          });
        },
   

      };

    const UserListChange = (event) => {

        const username = event.target.value;
        if (username) {
            var names = username.split(' ');
            input.FirstName = names[0];
            input.SurName = names[names.length-2];

            names[names.length-1] = names[names.length-1].replace('(', '').replace(')', '');
            input.UserName = names[names.length-1];
           
            setFullName(username);
        }
    };
    const onSubmit = (event) => { // Form switchs submit event
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

    const classes = useToolbarStyles();

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

    useEffect(() => { // Update table on date filter change
        if (startDate && endDate) {
            if (checkValidInput(startDate) && checkValidInput(endDate)) { // Only update table if valid dates
                const startDateObj = inputToDateObj(startDate);
                const endDateObj = inputToDateObj(endDate);
                console.log(dateRange);
                if (startDateObj < dateRange.current[0] || endDateObj > dateRange.current[1]) {
                    getTable(inputToDate(startDate), inputToDate(endDate));
                    dateRange.current = [startDateObj, endDateObj];
                }
            }
        }
    }, [startDate, endDate]);

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add Indirect Activity Detail');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Indirect Activity Detail'); 
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

        // Retrieve Dropdown Data
        api.get('/DataCapture/IndirectActivityDetails/GetAllTaskNames').then( // IndirectTask Names List 
            res => {
                let data = res.data;
                dropdownData['Task Name'] = data.map(x => x['taskName']);
            });

            api.post('/Maintenance/Pickers/GetAllUserNames').then( // Reasons Codes List 
                res => {
                    let data = res.data;
                    dropdownData['UserList'] = data.map(x => x);
                }).catch(() => {});
        }, []);

    return (

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
             <h4>INDIRECT ACTIVITY DETAILS</h4>
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
              
            <Tooltip title='Add  group Indirect Activity'>
               <IconButton  onClick={()=>addgroupactivityHandler()} >
                <img width={ 35 } height={35} src={Groupadd}></img> 
               </IconButton>
               </Tooltip>
               <Tooltip title='Add Indirect Activity'>
               <IconButton  onClick={()=>addTableHandler()} >
               <img width={ 35 } height={35} src={Add}></img>
               </IconButton>
               </Tooltip>
               <Tooltip title='Export CSV'>
               <IconButton aria-label='ExportCSV' onClick={()=>ExportDataToCSVFile()} >
               <img width={ 35 } height={35} src={DownloadExcel}></img>
               </IconButton>
               </Tooltip>
               
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
             minWidth: 150,
            
          }}
            frameworkComponents={{
              
             }}
          
           pagination ={true}
           animateRows= {true}
       rowSelection = "multiple"
       rowData={tableData}
     >

         <AgGridColumn headerName ="Action"  lockPosition = {true} cellRendererFramework = {ActionRowButton}   colId="Action"  editable = {false} filter={false} />
        
         <AgGridColumn  headerName ="Employee ID" field="UserName"  />
         <AgGridColumn  headerName ="Firstname" field="FirstName"  />
         
         <AgGridColumn  headerName ="Surname" field="SurName"   />
         <AgGridColumn  headerName ="Task" field="TaskName"  />
         <AgGridColumn  headerName ="Start Date" field="StartDate" filter={false}  />
         <AgGridColumn  headerName ="Start Time" field="StartTime" filter={false}  />
         <AgGridColumn  headerName ="End Date" field="EndDate"  filter = {false} />
         <AgGridColumn  headerName ="End Time" field="EndTime" filter = {false} />
         <AgGridColumn  headerName ="Down Time" field="DownTime"  />      
         <AgGridColumn  headerName ="Total Time" field="TotalTime"  />
         <AgGridColumn  headerName ="Site" field="Site"  />
         <AgGridColumn  headerName ="Serial ID" field="SerialID" editable={false}  />
          
     </AgGridReact>
     </div>
     <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal}  unrestrictWidth={true}
                                setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                           
                           <div className={modalMode === 1 ? 'modal-grouping--col-4' : 'modal-grouping--col-5'}>
                            <DropDown className="UserListDropDown modal-fields--outline" name='FullName' label='User List' options={dropdownData['UserList']} hidden={modalMode === 1 ? null : true} defaultValue={FullName} disabled={modalMode === 1 ? null : true} onChange={UserListChange} required></DropDown>
                            <TextField name='UserName' label='User ID' value={input.UserName} onChange={handleInputEvent} restrictions='default' disabled={true} hidden={modalMode === 1 ? true : null}></TextField>
                            <TextField name='FirstName' label='First Name' value={input.FirstName} onChange={handleInputEvent} restrictions='name' disabled></TextField>
                            <TextField name='SurName' label='Surname' value={input.SurName} onChange={handleInputEvent} restrictions='name' disabled></TextField>
                        </div>
                           
                           
                           
                            <div className='modal-grouping--col-4'>                                                             
                                <TextField name='SerialID' label='SerialID' value={input.SerialID} onChange={handleInputEvent}   disabled></TextField>
                                <TextField name='StartDate' label='Start Date' value={dateToInput(input.StartDate)} onChange={startDateHandler} required type='date' ></TextField> 
                                <TextField name='StartTime' step="2" label='Start Time' value={input.StartTime} onChange={handleInputEvent} type='time' required ></TextField>
                                <DropDown name='TaskName' label='Task Name' required options={dropdownData['Task Name']} defaultValue={input.TaskName} onChange={handleInputEvent} restrictions='default' ></DropDown>                                                            
                                <TextField name='EndDate' label='End Date' value={dateToInput(input.EndDate)} onChange={endDateHandler} type='date' ></TextField>                                
                                <TextField name='EndTime' step="2" label='End Time' value={input.EndTime} onChange={handleInputEvent} type='time' ></TextField>                                
                                <TextField name='DownTime' label='Downtime' min= '0' value={input.DownTime} onChange={handleInputEvent} type='number' ></TextField>
                                <TextField name='TotalTime' label='Total Time' disabled value={input.TotalTime} onChange={handleInputEvent}  hidden= {modalMode === 1 ? true : null}  disabled={modalMode === 1 ? null : true}></TextField>
                            </div>
                        </Modal>
                        <AddgroupactivityModal  showModal={groupactivityshowModal} setShowModal={setgroupactivityshowModal} loadModal={groupactivityloadModal} message={groupactivityloadModal} messageError={groupactivitymodalMessageError}>

                        </AddgroupactivityModal>
                        
     <div>

     </div>


            </div>

        </div>

                </div>
                </div>

        
    )
};

export default IndirectTasks;