import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { SelectMultipleFilter } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import DropDown from '../../../components/fields/dropdown';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import { minuteDifference } from '../../../components/fields/dateHelpers';
// Ag Grid

// Importing Ag Grid Community Version
import AutoCompleteEditor from'../../../components/agGridComponents/AutoCompleteEditor';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Header from '../../../components/header/header';
import Backdrop from '@material-ui/core/Backdrop';
import {ClockLoader} from "react-spinners";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { lighten, makeStyles } from '@material-ui/core/styles';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import './shiftDetails.scss';
import Edit from '../../../components/icons/Edit.png';
import DeleteOutline  from '../../../components/icons/Bin.png';
import Add from '../../../components/icons/Add.png';
import DownloadExcel from '../../../components/icons/Download_Excel.png';

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



const tableTitle = 'Shift Details';


const defaultInput = {
    'ShiftCode': '',
    'MondayClockIn': '',
    'MondayClockOut': '',

    'TuesdayClockIn': '',
    'TuesdayClockOut': '',

    'WednesdayClockIn': '',
    'WednesdayClockOut': '',

    'ThursdayClockIn': '',
    'ThursdayClockOut': '',

    'FridayClockIn': '',
    'FridayClockOut': '',

    'SaturdayClockIn': '',
    'SaturdayClockOut': '',

    'SundayClockIn': '',
    'SundayClockOut': '',

    'ShortBreakStart': '',
    'ShortBreakEnd': '',
    'OtherBreakStart': '',
    'OtherBreakEnd': '',
    'LongBreakStart': '',
    'LongBreakEnd': '',
    'ShortBreak': '',
    'LongBreak': '',
    'OtherBreak': '',

    'StartTolerance': 0,
    'EndTolerance': 0,
    'BreakTolerance': 0,
    'ShiftType': '',
    'StartOverTime': '',
    'EndOvertTime': '',
    'WeekStart': '',
    'WeekendHours': '',
    'DCMUser': ''
};


// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'ShiftType': ['N', 'D', 'A'],
    'WeekStart': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
};

// Relabelling Dropdown labels
// const dropdownLabels = {
//     'Level': ['Trainee', 'Level 1', 'Level 2', 'Level 5']
// };

const ShiftDetails = () => {
    const [tableData, setTableData] = useState([]);
    const user = useSelector(store => store.user);  
    defaultInput.DCMUser = user;
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const [originalInput, setOriginalInput] = useInputState(input);

    // Parameter handlers for modal
    // const dateJoiningHandler = (e) => { setInputName('DateJoining', inputToDate(e.currentTarget.value)) };
    // const dateLeavingHandler = (e) => { setInputName('DateLeaving', inputToDate(e.currentTarget.value)) };
    // const firstAidHandler = (e) => { setInputName('FirstAid', booleanToOutput(e))};
    // const partTimeHandler = (e) => { setInputName('PartTime', booleanToOutput(e))}; 

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Shift Details');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
      // const originalInput = usePrevious(input);
   
      const [gridApi, setGridApi] = useState(null);
      const [gridColumnApi, setGridColumnApi] = useState(null);
      const [rowparams, setrowparams] = useState(null);
  
        //Backdrop
        const [open, setOpen] = React.useState(false);
  
  
        //cSS Classes 
        const classes = useToolbarStyles();
      // Current State

    // Current State
    const [tableLoading, setTableLoading] = useState(true);

    // Event Handlers for Table
    const addTableHandler = () => {
        setShowModal(true);
        setModalMode(1);
        setInput(defaultInput);
        setModalMessage('');
        setModalMessageError('');
    };

    const editTableHandler = (params) => {
        setrowparams(params);
        setShowModal(true);
        setModalMode(2);
        setInput(params.data);
        setOriginalInput(params.data);
        setModalMessage('');
        setModalMessageError('');
    };

    // Function to send requests to update table
    const getTable = async () => {
        setOpen(true);
        let body = new URLSearchParams({
            'DCMUser': user
        });
        await api.post('Maintenance/ShiftDetails/GetAllShifts', body).then(
            res => {
                let data = res.data;
                setTableData(data);
                setOpen(false);
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {
                    }
                    else {
                    }
                }
            );
    };

    const addHandler = async () => {
        let body = new URLSearchParams(input);

        if (input.ShiftType !== input.ShiftCode.substring(0, 1)) {
            setModalMessageError('Shift Code should match with Shift Type');
            setLoadModal(false);
            return;
        }

        if (input.ShiftType != 'N')
{

        if (input.MondayClockIn > input.MondayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }

        if (input.TuesdayClockIn > input.TuesdayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.WednesdayClockIn > input.WednesdayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.ThursdayClockIn > input.ThursdayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.FridayClockIn > input.FridayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.SaturdayClockIn > input.SaturdayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.SundayClockIn > input.SundayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
    }
        input.DCMUser = user;
        await api.post('/Maintenance/ShiftDetails/AddNewShift', body).then(
            res => {
                let response = res.data;

                if (response === 'New Shift Created') {
                    getTable();
                    setModalMessage(`Shift ${input.ShiftCode} successfully Created.`);
                }
                else if (response === 'Shift Already Exist') {
                    setModalMessageError(`Error: Shift ${input.ShiftCode} already found. Please rename shift.`);
                }
                else {
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                }
                setLoadModal(false);
            }
        ).catch(
            err => { // TODO: Error handling
                setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                setLoadModal(false);
            }
        );
    };

    // Update handler
    const updateHandler = async () => {

        if (!checkChange(originalInput, input)) {
            setModalMessageError('Error: No changes have been made to Shift');
            setLoadModal(false);
            return;
        }


        if (input.ShiftType !== input.ShiftCode.substring(0, 1)) {
            setModalMessageError('Shift Code should match with Shift Type');
            setLoadModal(false);
            return;
        }

        if (input.ShiftType != 'N')
        {

        if (input.MondayClockIn > input.MondayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.MondayClockIn > input.MondayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.TuesdayClockIn > input.TuesdayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.WednesdayClockIn > input.WednesdayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.ThursdayClockIn > input.ThursdayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.FridayClockIn > input.FridayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.SaturdayClockIn > input.SaturdayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }
        if (input.SundayClockIn > input.SundayClockOut) {
            setModalMessageError('Clock In Time cannot be greater than Clock Out Time');
            setLoadModal(false);
            return;
        }

    }

        input.DCMUser = user;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/ShiftDetails/UpdateShift', body).then(
            res => {
                let response = res.data;
                if (response === 'Selected Shift Updated') {
                    setModalMessage('Selected Shift Updated');
                    // Update table on the frontend
                    var rowNode = gridApi.getRowNode(input.ShiftCode);
                     var newData = input
                     rowNode.setData(newData);
                }

                else {
                    setModalMessageError(response);
                }
                setLoadModal(false);
            }).catch(
                err => { // TODO: Error handling
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                    setLoadModal(false);
                }
            );
    };

    const deleteHandler = async (rowdata) => {
        // Delete row from table
        let body = new URLSearchParams({
            'ShiftCode': rowdata.data.ShiftCode,

        });

        var r = window.confirm("Please confirm to delete this entry");
        if (r == true) 
        {
        await api.post('/Maintenance/ShiftDetails/DeleteShift', body).then(
            res => {
               
                if (res.data === "Shift Deleted") {
                   
                    rowdata.api.applyTransaction({
                        remove: [rowdata.node.data]
                    });
                }
                else {
                    window.alert(res.data);
                }
               
            }
        ).catch(
            err => { // TODO: Error handling
                window.alert(err);
            }
        );
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

    const updateShortBreak = useCallback(() => {
        setInputName('ShortBreak', minuteDifference(input.ShortBreakStart, input.ShortBreakEnd));
    }, [setInputName, input.ShortBreakStart, input.ShortBreakEnd]);

    const updateLongBreak = useCallback(() => {
        setInputName('LongBreak', minuteDifference(input.LongBreakStart, input.LongBreakEnd));
    }, [setInputName, input.LongBreakStart, input.LongBreakEnd]);

    const updateOtherBreak = useCallback(() => {
        setInputName('OtherBreak', minuteDifference(input.OtherBreakStart, input.OtherBreakEnd));
    }, [setInputName,input.OtherBreakStart, input.OtherBreakEnd]);

    const ActionRowButton = (params) => {
        return (

            <React.Fragment>

                                <Tooltip title="Edit">
                                <IconButton aria-label="Save"  onClick = {()=>editTableHandler(params)} >
                                   <img width={30} height={30} src={Edit}></img>
                                </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                <IconButton aria-label="Delete" onClick = {()=>deleteHandler(params)} >
                                <img width={30} height={30} src={DeleteOutline}></img>
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
    
          fileName: 'Shift Details_'+user,
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
            return data.ShiftCode;
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


    // Dynamically update total minutes
    useEffect(updateShortBreak, [input.ShortBreakStart, input.ShortBreakEnd]);

    useEffect(updateLongBreak, [input.LongBreakStart, input.LongBreakEnd]);

    useEffect(updateOtherBreak, [input.OtherBreakStart, input.OtherBreakEnd]);

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add New Shift');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Shift');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Dropdown Data
        getTable();
    }, []);

    return (
    
    
        <div>
        <Header></Header>

        <div>
     <Backdrop className={classes.backdrop} open={open}>
     <ClockLoader color="rgb((35,168,224)" loading={true}   size={50}></ClockLoader>
     </Backdrop>
       </div>
       <div className="screen-container">
          
       <div className="panel panel--table">
           <div className='table-full-container'>

         <div className="test-header">
         <React.Fragment>
             <div className = "title-header">
             <h4> SHIFT DETAILS</h4>
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
             minWidth: 150,
            
          }}
            frameworkComponents={{
              autoCompleteEditor: AutoCompleteEditor,
             }}
          
           pagination ={true}
           animateRows= {true}
       rowSelection = "multiple"
       rowData={tableData}
     >

         <AgGridColumn headerName ="Action"  lockPosition = {true} cellRendererFramework = {ActionRowButton}   colId="Action"  editable = {false} filter={false} />
         <AgGridColumn  headerName ="Shift Code" field="ShiftCode" editable={false}  />
         <AgGridColumn  headerName ="Monday In" field="MondayClockIn"  />
         <AgGridColumn  headerName ="Monday Out" field="MondayClockOut"  />
         <AgGridColumn  headerName ="Tuesday In" field="TuesdayClockIn"  />
         <AgGridColumn  headerName ="Tuesday Out" field="TuesdayClockOut"  />
         <AgGridColumn  headerName ="Wednesday In" field="WednesdayClockIn"  />
         <AgGridColumn  headerName ="Wednesday Out" field="WednesdayClockOut"  />
         <AgGridColumn  headerName ="Thursday In" field="ThursdayClockIn"  />
         <AgGridColumn  headerName ="Thursday Out" field="MondayClockOut"  />
         <AgGridColumn  headerName ="Friday In" field="FridayClockIn"  />
         <AgGridColumn  headerName ="Friday Out" field="FridayClockOut"  />
         <AgGridColumn  headerName ="Saturday In" field="SaturdayClockIn"  />
         <AgGridColumn  headerName ="Saturday Out" field="SaturdayClockOut"  />
         <AgGridColumn  headerName ="Sunday In" field="SundayClockIn"  />
         <AgGridColumn  headerName ="Sunday Out" field="SundayClockOut"  />
         <AgGridColumn  headerName ="Short Break Start" field="ShortBreakStart"  />
         <AgGridColumn  headerName ="Short Break End" field="ShortBreakEnd"  />
         <AgGridColumn  headerName ="Short Break" field="ShortBreak"  />
         <AgGridColumn  headerName ="Long Break Start" field="LongBreakStart"  />
         <AgGridColumn  headerName ="Long Break End" field="LongBreakEnd"  />
         <AgGridColumn  headerName ="Long Break" field="LongBreak"  />
         <AgGridColumn  headerName ="Other Break Start" field="OtherBreakStart"  />
         <AgGridColumn  headerName ="Other Break End" field="OtherBreakEnd"  />
         <AgGridColumn  headerName ="Other Break" field="OtherBreak"  />
         <AgGridColumn  headerName ="Shift Start Tolerance" field="Shift Start Tolerance"  />
         <AgGridColumn  headerName ="Shift End Tolerance" field="Shift End Tolerance"  />
         <AgGridColumn  headerName ="Break Tolerance" field="BreakTolerance"  />
         <AgGridColumn  headerName ="StartOverTime" field="StartOverTime"  />
         <AgGridColumn  headerName ="EndOverTime" field="EndOverTime"  />
         <AgGridColumn  headerName ="WeekStart" field="WeekStart"  />
         <AgGridColumn  headerName ="WeekendHours" field="WeekendHours"  />
         
         
          
     </AgGridReact>
     </div>
     <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal}
                setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError} unrestrictWidth={true}  >
                <div className='modal-grouping--col-3'>
                    <TextField name='ShiftCode' label='Shift Code' value={input.ShiftCode} onChange={handleInputEvent} restrictions='default' disabled={modalMode === 1 ? null : true} required></TextField>
                    <DropDown name='WeekStart' label='Week Start' options={dropdownData['WeekStart']} defaultValue={input.WeekStart} onChange={handleInputEvent} required></DropDown>
                    <DropDown name='ShiftType' label='Shift Type' options={dropdownData['ShiftType']} defaultValue={input.ShiftType} onChange={handleInputEvent} required></DropDown>
                    <div className='modal-item'></div>
                    <div className='modal-item'>
                        <label className='label label--position'>Clock In </label>
                    </div>
                    <div className='modal-item'>
                        <label className='label label--position'>Clock Out</label>
                    </div>
                    <div className='modal-item'>
                        <label className='label label--position'>Monday</label>
                    </div>
                    <TextField name='MondayClockIn' value={input.MondayClockIn} onChange={handleInputEvent} type='time' required></TextField>
                    <TextField name='MondayClockOut' value={input.MondayClockOut} onChange={handleInputEvent} type='time' required></TextField>

                    <div className='modal-item'>
                        <label className='label label--position'>Tuesday</label>
                    </div>
                    <TextField name='TuesdayClockIn' value={input.TuesdayClockIn} onChange={handleInputEvent} type='time' required></TextField>
                    <TextField name='TuesdayClockOut' value={input.TuesdayClockOut} onChange={handleInputEvent} type='time' required></TextField>

                    <div className='modal-item'>
                        <label className='label label--position'>Wednesday</label>
                    </div>
                    <TextField name='WednesdayClockIn' value={input.WednesdayClockIn} onChange={handleInputEvent} type='time' required></TextField>
                    <TextField name='WednesdayClockOut' value={input.WednesdayClockOut} onChange={handleInputEvent} type='time' required></TextField>

                    <div className='modal-item'>
                        <label className='label label--position'>Thursday</label>
                    </div>
                    <TextField name='ThursdayClockIn' value={input.ThursdayClockIn} onChange={handleInputEvent} type='time' required></TextField>
                    <TextField name='ThursdayClockOut' value={input.ThursdayClockOut} onChange={handleInputEvent} type='time' required></TextField>

                    <div className='modal-item'>
                        <label className='label label--position'>Friday</label>
                    </div>
                    <TextField name='FridayClockIn' value={input.FridayClockIn} onChange={handleInputEvent} type='time' required></TextField>
                    <TextField name='FridayClockOut' value={input.FridayClockOut} onChange={handleInputEvent} type='time' required></TextField>


                    <div className='modal-item'>
                        <label className='label label--position'>Saturday</label>
                    </div>
                    <TextField name='SaturdayClockIn' value={input.SaturdayClockIn} onChange={handleInputEvent} type='time' required></TextField>
                    <TextField name='SaturdayClockOut' value={input.SaturdayClockOut} onChange={handleInputEvent} type='time' required></TextField>


                    <div className='modal-item'>
                        <label className='label label--position'>Sunday</label>
                    </div>
                    <TextField name='SundayClockIn' value={input.SundayClockIn} onChange={handleInputEvent} type='time' required></TextField>
                    <TextField name='SundayClockOut' value={input.SundayClockOut} onChange={handleInputEvent} type='time' required></TextField>

                    <TextField name='ShortBreakStart' label="Short Break Start" value={input.ShortBreakStart} onChange={handleInputEvent} type='time' ></TextField>
                    <TextField name='ShortBreakEnd' label="Short Break End" value={input.ShortBreakEnd} onChange={handleInputEvent} type='time' ></TextField>
                    <TextField name='ShortBreak' label='Total Minutes' value={input.ShortBreak} disabled onChange={handleInputEvent} restrictions='number' ></TextField>

                    <TextField name='LongBreakStart' label="Long Break Start" value={input.LongBreakStart} onChange={handleInputEvent} type='time' ></TextField>
                    <TextField name='LongBreakEnd' label="Long Break End" value={input.LongBreakEnd} onChange={handleInputEvent} type='time' ></TextField>
                    <TextField name='LongBreak' label='Total Minutes' value={input.LongBreak} disabled onChange={handleInputEvent} restrictions='number' ></TextField>
                    <TextField name='OtherBreakStart' label="Other Break Start" value={input.OtherBreakStart} onChange={handleInputEvent} type='time' ></TextField>
                    <TextField name='OtherBreakEnd' label="Other Break End" value={input.OtherBreakEnd} onChange={handleInputEvent} type='time' ></TextField>
                    <TextField name='OtherBreak' label='Total Minutes' value={input.OtherBreak} disabled onChange={handleInputEvent} restrictions='number' ></TextField>

                    <TextField name='StartTolerance' label="Shift Start Tolerance" value={input.StartTolerance} onChange={handleInputEvent} type='number' ></TextField>
                    <TextField name='EndTolerance' label="Shift End Tolerance" value={input.EndTolerance} onChange={handleInputEvent} type='number' ></TextField>
                    <TextField name='BreakTolerance' label='Break Tolerance'  value={input.BreakTolerance} onChange={handleInputEvent} type='number' ></TextField>
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

export default ShiftDetails;