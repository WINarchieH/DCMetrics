import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, formatDate } from '../../../components/fields/dateHelpers';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import {DateCell} from '../../../components/table/tableCells';
import {SelectDateRange} from '../../../components/table/filters';

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
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import { lighten, makeStyles } from '@material-ui/core/styles';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import Edit from '@material-ui/icons/Edit';
import DateFnsUtils from '@date-io/date-fns';
import {  MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import './publicHoliday.scss';

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


const tableTitle = 'Public Holiday';
const today = new Date();
const tableColumns = [
        {Header: 'Serial ID', accessor: 'SerialID', filter: 'textbox'}, 
        {Header: 'Description', accessor: 'Description', filter: 'text', modalType: 'textbox'},
        {Header: 'HolidayType', accessor: 'HolidayType',  filter: 'text', modalType: 'textbox' },
        {Header: 'Date', accessor: 'Date', Filter: SelectDateRange, filter: 'date', modalType: 'textbox', Cell: DateCell}
    ];

const defaultInput = {
    'SerialID':'',
    'Date':'',
    'Description':'',
    'HolidayType':'',
    'DCMUser': ''
};

const PublicHoliday =  () => {
    const [tableData, setTableData] = useState([]);

    const user = useSelector(store => store.user); 
    defaultInput.DCMUser = user;   

    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const dateJoiningHandler = (e) => { setInputName('Date', inputToDate(e.currentTarget.value)) };
    const [userDateJoining, setuserDateJoining] = useState(inputToDate(formatDate(new Date())));

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Add New Public Holiday');
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

    // Event Handlers for Table
    const addTableHandler = () => {
        defaultInput.Date =  userDateJoining;
        setShowModal(true);
        setModalMode(1);
        setInput(defaultInput);
        setModalMessage('');
        setModalMessageError('');
    }

    const editTableHandler = (params) => {
       
        setrowparams(params);
        setShowModal(true);
        setModalMode(2);
        setInput(params.data);
        setOriginalInput(params.data);
        setModalMessage('');
        setModalMessageError('');
    }
    // Function to send requests to update table
    const getPublicHoliday = async () => {
        setOpen(true);
        
        let body = new URLSearchParams({
            'DCMUser': user
        });

        await api.post('/Maintenance/PublicHoliday/GetAllPublicHoliday', body).then(
            res => {
                let data = res.data;  
                data = data.map(x => {
                    x.Date = dateObjToDate(dateToDateObj(x.Date));
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

    // API Handlers
    const addHandler = async () => {
        input.DCMUser = user;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/PublicHoliday/Add', body).then(
            res => {
                let response = res.data.response;
                if (response === 'Public Holiday Inserted') {
                    getPublicHoliday();
                    setModalMessage(`Holiday with Date: ${input.Date} successfully added.`);
                }
                else if (response === 'Dulpicate Record Found') {
                    setModalMessageError(`Error: Holiday with Date ${input.Date} and Description ${input.Description} already exists.`);
                }
                else {
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
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
    }

    const updateHandler = async () => {
        if (!checkChange(originalInput, input)) {
            setModalMessageError('Error: No changes have been made to date or description');
            setLoadModal(false);
            return;
        }
        input.DCMUser = user;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/PublicHoliday/Update', body).then(
            res => {
                let response = res.data.response;

                if (response === 'Public Holiday Updated') 
                {
                    setModalMessage(`Public Holiday with Date ${input.Date} with Description ${input.Description} successfully updated.`);
                    // Update table on the frontend
                      var rowNode = gridApi.getRowNode(input.SerialID);
                      var newData = input
                      rowNode.setData(newData);
                }
                else if (response === 'Dulpicate Record Found') {
                    setModalMessageError(`Error: Public Holiday with Date ${input.Date}  with Description ${input.Description} already exists. Please change date or description.`);
                }
                else if (response === 'No Changes have been made') {
                    setModalMessageError(`No changes made. Please change holiay date.`);
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

    const deleteHandler = async (rowData) => {
       

        let body = new URLSearchParams({
            'SerialID': rowData.data.SerialID,
            'DCMUser': user
        });
        var r = window.confirm("Please confirm to delete this entry");
        if (r == true) 
        {
        await api.post('Maintenance/PublicHoliday/Delete', body).then(
            res => {
                rowData.api.applyTransaction({
                    remove: [rowData.node.data]
                });
            }
        ).catch(
            err => { // TODO: Error handling
                console.log(err);
            }
        );
        }
    }

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
    const ActionRowButton = (params) => {
       
        return (

            <React.Fragment>

                                <Tooltip title="Edit">
                                <IconButton aria-label="Edit"  onClick = {()=>editTableHandler(params)} >
                                <Edit />
                                </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                <IconButton aria-label="Delete" onClick = {()=>deleteHandler(params)} >
                                    <DeleteOutline />
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
    
          fileName: 'PublicHoliday_'+user,
          skipHeader: false,
         };
          gridApi.exportDataAsCsv(excelParams);

     }

      //Ag grid Row Styling

      //Ag Grid Options

      var gridOptions = {
        getRowStyle: params =>
        {
            if (params.node.rowIndex % 2 === 0)
            {
                return { background: 'aliceblue' };

             }
             else
             {
                return { background: 'rgb(212, 239, 255)' };

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
        // editType: "fullRow",

      };
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
      
          if (cellDate >= filterLocalDateAtMidnight) {
            return 1;
          }
        },
        browserDatePicker: true,
      };

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add Public Holiday');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Public Holiday');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => {
        getPublicHoliday();
    }, []);

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
             <h4>PUBLIC HOLIDAY</h4>
             </div>
    
            <div className ="add-header"> 
               <Tooltip title='Add Entry'>
               <IconButton aria-label='Add Entry' onClick={()=> addTableHandler()} >
               <AddIcon />
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

         <AgGridColumn headerName ="Action"  lockPosition = {true} cellRendererFramework = {ActionRowButton}   colId="Action"  editable = {false} filter={false} />
         <AgGridColumn  headerName ="Serial ID" field="SerialID" editable={false}  />
         <AgGridColumn  headerName ="Description" field="Description"  />
         <AgGridColumn  headerName ="HolidayType" field="HolidayType"  />
         <AgGridColumn  headerName ="Date" field="Date" filter='agDateColumnFilter'  filterParams={dateFilterParams} />

     </AgGridReact>
     </div>
     <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} 
                    setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                    <TextField name='Date' label='Public Holiday' disabled={modalMode ==1 ? null: true } value={dateToInput(input.Date)} onChange={dateJoiningHandler} type='date' required></TextField>
                    <TextField name='Description' label='Description' value={input.Description} onChange={handleInputEvent} required restrictions='default'></TextField>
                </Modal>
     <div>

     </div>


            </div>

        </div>

                </div>
                </div>

        
    )
};

export default PublicHoliday;