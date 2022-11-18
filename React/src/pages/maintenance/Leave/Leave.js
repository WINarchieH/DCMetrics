import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Modal, { checkChange } from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import Toggle, { booleanToOutput, outputToBoolean } from '../../../components/fields/toggle';
import DropDown from '../../../components/fields/dropdown';
import { SelectMultipleFilter } from '../../../components/table/filters';

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
import './leave.scss';

import Add from '../../../components/icons/Add.png';
import DownloadExcel from '../../../components/icons/Download_Excel.png';
import Edit from '../../../components/icons/Edit.png';
import Delete from '../../../components/icons/Bin.png';
const tableTitle = 'Leave';
const tableColumns = [
    { Header: 'Serial ID', accessor: 'SerialID', filter: 'text' },
    { Header: 'Leave Code', accessor: 'LeaveCode', filter: 'text', modalType: 'textbox' },
    { Header: 'Leave Description', accessor: 'LeaveDesc', filter: 'text', modalType: 'textbox' },
    { Header: 'Paid', accessor: 'Paid', filter: 'text', modalType: 'textbox' },
    { Header: 'Employee Category', accessor: 'EmpType', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
];

const defaultInput = {
    'SerialID': '',
    'LeaveCode': '',
    'LeaveDesc': '',
    'Paid': '',
    'EmpType': '',
    'CurrentLeave': '',
    'LeaveColor':''
};

const dropdownData =
{
    'Employee Category': ['Permanent', 'Casual', 'HeadOffice'],
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


const Leave = () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const user = useSelector(store => store.user);
    const partTimeHandler = (e) => { setInputName('Paid', booleanToOutput(e)) };

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Add Leave');
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
   
   
         //cSS Classes 
         const classes = useToolbarStyles();
       // Current State
     

    // Event Handlers for Table
    const addTableHandler = () => {
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
    const getLeave = async () => {
        setTableLoading(true);
        await api.get('/Maintenance/Leave/GetAllLeave').then(
            res => {
                let data = res.data;
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

    // API Handlers
    const addHandler = async () => {
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/Leave/AddLeave', body).then(
            res => {
                let response = res.data.response;
                if (response === 'New Leave Inserted') {
                    getLeave();
                    setModalMessage(`Leave with Leave Code: ${input.LeaveCode} successfully added.`);
                }
                else if (response === 'Dulpicate Record Found') {
                    setModalMessageError(`Error: Leave with Leave Code ${input.LeaveCode} and Description ${input.LeaveDesc} already exists.`);
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

    const updateHandler = async (rowdata) => {
   
  
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/Leave/Update', body).then(
            res => {
                let response = res.data.response;
               

                if (response === 'Leave Updated') {
                    setModalMessage(`Leave with Code ${input.LeaveCode} with Description ${input.LeaveDesc} successfully updated.`);
                    // Update table on the frontend
                    var rowNode = gridApi.getRowNode(input.SerialID);
                    var newData = input
                    rowNode.setData(newData);

                    setLoadModal(false);
                  
                }
                else if (response === 'Dulpicate Record Found') {
                    setLoadModal(false);
                    setModalMessageError(`Error: Leave with leave code ${input.LeaveCode}  with Description ${input.LeaveDesc} already exists. Please change leave code or description.`);
                }
                else if (response === "No changes Made") {
                    setLoadModal(false);
                    setModalMessageError(`No changes Made. Please change leave code or description.`);
                }
                else {
                    setLoadModal(false);
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                }
              
            }).catch(
                err => { // TODO: Error handling
                    console.log(err);
                    alert(`Error: Failed to connect to server. Please try again.`);
                    
                }
            );
    };

    const deleteHandler = async (rowData) => {
        

        let body = new URLSearchParams({
            'SerialID': rowData.SerialID,
            'LeaveCode': rowData.LeaveCode,
        });
        await api.post('Maintenance/Leave/Delete', body).then(
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

       
    const ActionRowButton = (params) => {
        return (

            <React.Fragment>

                                <Tooltip title="Edit">
                                <IconButton aria-label="Save"  onClick = {()=>editTableHandler(params)} >
                                <img width={ 35 } height={35} src={Edit}></img>
                                </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                <IconButton aria-label="Delete" onClick = {()=>deleteHandler(params)} >
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
    
          fileName: 'Leave_'+user,
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


const leavecolumneditor =(params)=>
{
    return { background: params.value , color:params.value };
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


    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add Leave');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Leave');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => {
        getLeave();
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
             <h4> LEAVE</h4>
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
            frameworkComponents={{
              autoCompleteEditor: AutoCompleteEditor,
             }}
          
           pagination ={true}
           animateRows= {true}
       rowSelection = "multiple"
       rowData={tableData}
     >

         <AgGridColumn headerName ="Action"  lockPosition = {true} cellRendererFramework = {ActionRowButton}   colId="Action"  editable = {false} filter={false} />
         <AgGridColumn  headerName ="Serial ID" field="SerialID" editable={false}  />
         <AgGridColumn  headerName ="Leave Code" field="LeaveCode"  />
         <AgGridColumn  headerName ="Leave Description" field="LeaveDesc"  />
         <AgGridColumn  headerName ="Leave Color" cellStyle={leavecolumneditor}  field="LeaveColor"  />
         <AgGridColumn  headerName ="Paid" field="Paid"  cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: ["Y","N"]}} /> 
         <AgGridColumn  headerName ="Employee Category" field="EmpType"  cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options:  dropdownData['Employee Category']}} />  
       
     </AgGridReact>
     </div>
     <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal}
                    setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError} unrestrictWidth={true}>
                    <div className='modal-grouping--col-2'>
                        <TextField name='LeaveCode' label='Leave Code' value={input.LeaveCode} onChange={handleInputEvent} required restrictions='string'></TextField>
                        <TextField name='LeaveDesc' label='Leave Description' value={input.LeaveDesc} onChange={handleInputEvent} required restrictions='string'></TextField>
                        <DropDown name='EmpType' label='Employee Category' options={dropdownData['Employee Category']} defaultValue={input.EmpType} onChange={handleInputEvent} required disabled={modalMode === 1 ? null : true}></DropDown>
                        <TextField name='LeaveColor' label='Leave Color' value={input.LeaveColor} type="color" onChange={handleInputEvent} required restrictions='name'></TextField>
                        <Toggle label="Paid" checked={outputToBoolean(input.Paid)} onChange={partTimeHandler}></Toggle>
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

export default Leave;