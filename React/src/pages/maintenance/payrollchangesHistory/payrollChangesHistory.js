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
import './payrollChangesHistory.scss';

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
    const getAllRecords = async () => {
        setTableLoading(true);
        await api.post('/Maintenance/payrollHistory/GetAllRecords').then(
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
           // addHandler(event);
        }
        else {
           // updateHandler(event);
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
        getAllRecords();
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
             <h4> Payroll History</h4>
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
         <AgGridColumn  headerName ="User ID" field="UserID" editable={false}  />
         <AgGridColumn  headerName ="Employee Name" field="FullName"  />
         <AgGridColumn  headerName ="Salary" field="Salary"  />
         <AgGridColumn  headerName ="Single Time"   field="OrdinaryTime"  />
         <AgGridColumn  headerName ="TH" field="TimeAndHalf"  /> 
         <AgGridColumn  headerName ="Double Time" field="DoubleTime"  />  
         <AgGridColumn  headerName ="Salary Effective Date" field="SalaryEffectiveDate"  />  
         <AgGridColumn  headerName ="Salary InEffective Date" field="SalaryInffectiveDate"  /> 
         <AgGridColumn  headerName ="LHAllowed" field="LHAllowed"  /> 
         <AgGridColumn  headerName ="AAAllowed" field="AAAllowed"  />   
         <AgGridColumn  headerName ="EditDate" field="EditDate"  />  
       
     </AgGridReact>
     </div>
     <div>

     </div>


            </div>

        </div>

                </div>
                </div>

    )
};

export default Leave;