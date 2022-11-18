import React, {useState, useEffect} from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';

// Ag Grid

// Importing Ag Grid Community Version
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Screen from '../../../components/screen/screen';
import Header from '../../../components/header/header';

import SaveIcon from '@material-ui/icons/Save';

import Backdrop from '@material-ui/core/Backdrop';
import {ClockLoader} from "react-spinners";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import { lighten, makeStyles } from '@material-ui/core/styles';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

import ReactNotification from 'react-notifications-component';
import Add from '../../../components/icons/Add.png';
import DownloadExcel from '../../../components/icons/Download_Excel.png';
import Edit from '../../../components/icons/Edit.png';
import Delete from '../../../components/icons/Bin.png';


import './codes.scss';
//import { border, borderBottom } from '@mui/material/node_modules/@mui/system';

const tableTitle = 'Reason Code';


const defaultInput = {
 
    'Reason':'',
    'DCMUser': ''
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



const ReasonCode =  () => {

    const [tableData, setTableData] = useState([]);
    const user = useSelector(store => store.user); // update by will be dcm user 
    defaultInput.DCMUser = user;
    const [input, setInput, , handleInputEvent] = useInputState(defaultInput);

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Add New Reason');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');

   // const originalInput = usePrevious(input);
    const [originalInput, setOriginalInput] = useInputState(input);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowparams, setrowparams] = useState(null);

      //Backdrop
      const [open, setOpen] = React.useState(false);


      //cSS Classes 
      const classes = useToolbarStyles();
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
    const getReason = async () => {
        setTableLoading(true);

        let body = new URLSearchParams({
            'DCMUser': user
        });

        await api.post('/Maintenance/ReasonCode/GetAllReasons', body).then(
            res => {
                let data = res.data;  
                setTableData(data);  
                setTableLoading(false);
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

    // API Handlers
    const addHandler = async () => {
        input.DCMUser = user;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/ReasonCode/InsertNewReason', body).then(
            res => {
                let response = res.data.response;
                if (response === 'New Reason Added into the DCMetrics') {
                    getReason();
                    input.Reason='';
                    
                    setModalMessage(`Reason successfully added.`);
                    setLoadModal(false);
                }
                else if (response === 'Reason already exist in the DC Metrics System') {
                    setModalMessageError(`Error: Reason already exists.`);
                }
                else {
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                }
              
            }
        ).catch(
            err => { // TODO: Error handling
              
                setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                setLoadModal(false);
            }
        );
    }

    

    const deleteHandler = async (params) => {
      
        let body = new URLSearchParams({
            
            'Reason':params.data.Reason,
            'DCMUser': user
        });

        var r = window.confirm("Please confirm to delete this entry");
        if (r == true) 
        {
            
        await api.post('Maintenance/ReasonCode/Deletereason', body).then(
            res => {
                if (res.data.response === 'Reason deleted from the DCMetrics')
                { 
                 
                    getReason();
                }
                else if(res.data.response === 'Reason does not exist in the DC Metrics System')
                {
                    window.alert("Reason does not exist in the DC Metrics System");
                }
                
            }
        ).catch(
            err => { // TODO: Error handling
                window.alert(err);
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
        
    };


    
    const ActionRowButton = (params) => {
        return (

            <React.Fragment>

                              
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
    
          fileName: 'Reasons_'+user,
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

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add New Reason');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Manager');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => {
        getReason();


    }, []);

    return (        

        <div>
        <Header></Header>

        <div>
       <ReactNotification></ReactNotification>
     <Backdrop className={classes.backdrop} open={open}>
     <ClockLoader color="rgb(35,168,224)" loading={true}   size={50}></ClockLoader>
     </Backdrop>
       </div>
       <div className="screen-container">
          
       <div className="panel panel--table">
           <div className='table-full-container'>

         <div className="test-header" >
         <React.Fragment>
             <div className = "title-header" >
             <h4> REASON CODE</h4>
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
       rowSelection = "multiple"
       rowData={tableData}
     >

         <AgGridColumn  headerName ="Action"  lockPosition = {true} cellRendererFramework = {ActionRowButton}   colId="Action"  editable = {false} filter={false} />
         <AgGridColumn  headerName ="Reason" field="Reason" editable={false}  />

     </AgGridReact>
     </div>
                <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} 
                    setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} unrestrictedwidth = {true} messageError={modalMessageError}>
                     <TextField name='Reason' label='Reason' value={input.Reason} onChange={handleInputEvent} required restrictions='default'></TextField>
                     
                 </Modal>
     <div>

     </div>


            </div>

        </div>

                </div>
                </div>


    )
};

export default ReasonCode;