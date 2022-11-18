import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import {DateCell} from '../../../components/table/tableCells';
import {SelectDate} from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import {formatDate, inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput} from '../../../components/fields/dateHelpers';
// import Toggle, {booleanToOutput, outputToBoolean} from '../../../components/fields/toggle';
import {useInputState, usePrevious} from '../../../components/hooks/hooks';
import {orderDatetime} from '../../../components/table/sortingFunctions';
// Importing Ag Grid Community Version
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Screen from '../../../components/screen/screen';
import Header from '../../../components/header/header';

import SaveIcon from '@material-ui/icons/Save';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
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
import './dailyRoster.scss';
import DownloadExcel from '../../../components/icons/Download_Excel.png';
import Edit from '../../../components/icons/Edit.png';

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
    const [selectedDate, setSelectedDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [ToselectedDate, setToSelectedDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));


    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
         // const originalInput = usePrevious(input);
         const [gridApi, setGridApi] = useState(null);
         const [gridColumnApi, setGridColumnApi] = useState(null);
         const [rowparams, setrowparams] = useState(null);
        
              //Backdrop
         const [open, setOpen] = React.useState(false);
        
        
              //CSS Classes 
    const dateRange = useRef([]);
    
   

    // Event Handlers for Table
    const updateTableHandler = (params) => {
       // data = {...data, StartDate: dateObjToDate(data.StartDate), EndDate: dateObjToDate(data.EndDate)};
       setrowparams(params);
       setShowModal(true);
       setModalMode(2);
       setInput(params.data);
       setOriginalInput(params.data);
       setModalMessage('');
       setModalMessageError('');
       setShowModal(true); 
    
    };

    const classes = useToolbarStyles();

    const getTable = async (startDate, endDate) => { // TODO: API Request for table
        let body = new URLSearchParams({ 
            StartDate: startDate,
            EndDate: endDate,
            DCMUser: user
        });
        setOpen(true);
        await api.post('/Maintenance/UserTimeInformation/GetAllEntries', body).then( 
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

    const ActionRowButton = (params) => {
        params.columnApi.autoSizeAllColumns();
        return (

            <React.Fragment>

                                <Tooltip title="Edit">
                                <IconButton aria-label="Edit"  onClick = {()=>updateTableHandler(params)} >
                                <img width={ 35 } height={35} src={Edit}></img>
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
    
          fileName: 'DAILY ROSTER_'+user,
          skipHeader: false,
         };
          gridApi.exportDataAsCsv(excelParams);

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
            return data.UserID;
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
                      // Update table on the frontend
                      var rowNode = gridApi.getRowNode(input.UserID);
                      var newData = input
                      rowNode.setData(newData);
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

    var dateFilterParams = {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          var dateAsString = cellValue;
          if (dateAsString == null) return -1;
          var dateParts = dateAsString.split('/');
          var cellDate = new Date(
            Number(dateParts[2]),
            Number(dateParts[1]) - 1,
            Number(dateParts[0])
          );
      
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
      
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
      
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        },
        browserDatePicker: true,
      };

    useEffect(() => { // Update table on date filter change
        handleDateChange();
    }, [startDate, endDate, handleDateChange]);

    useEffect(() => { 
        
      
        
        
        // Updates Modal title and button name
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
             <h4>DAILY ROSTER</h4>
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
         <AgGridColumn  headerName ="Employee ID" field="UserID" editable={false}  />
         <AgGridColumn  headerName ="Firstname" field="FirstName"  />
         <AgGridColumn  headerName ="Surname" field="Surname"  />
         
         <AgGridColumn  headerName ="Start Date" field="StartDate"   filter={false} />
         <AgGridColumn  headerName ="Start Time" field="StartTime" filter={false} />
         <AgGridColumn  headerName ="End Date" field="EndDate" filter={false}  />
         <AgGridColumn  headerName ="End Time" field="EndTime" filter={false}  />
         <AgGridColumn  headerName ="Shortbreak Start" field="ShortBreakStart"  />
         <AgGridColumn  headerName ="Shortbreak End" field="ShortBreakEnd"  />
         <AgGridColumn  headerName ="Short Break" field="ShortBreak"  />

         
         <AgGridColumn  headerName ="Longbreak Start" field="LongBreakStart"  />
         <AgGridColumn  headerName ="Longbreak End" field="LongBreakEnd"  />
         <AgGridColumn  headerName ="Long Break" field="LongBreak"  />
         <AgGridColumn  headerName ="Otherbreak Start" field="OtherBreakStart"  />
         <AgGridColumn  headerName ="Otherbreak End" field="OtherBreakEnd"  />
         <AgGridColumn  headerName ="Other Break" field="OtherBreak"  />
         
         
         
          
     </AgGridReact>
     </div>
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
     <div>

     </div>


            </div>

        </div>

                </div>
                </div>
        
    )
};

export default UserTimeInformation;