import React, {useState, useEffect} from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import {SelectMultipleFilter, } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import DropDown from '../../../components/fields/dropdown';
import {useInputState, usePrevious} from '../../../components/hooks/hooks';
import { useSelector } from 'react-redux';
// Ag Grid

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
import Edit from '../../../components/icons/Edit.png';
import Delete from '../../../components/icons/Bin.png';
import Add from '../../../components/icons/Add.png';
import DownloadExcel from '../../../components/icons/Download_Excel.png';
import './agency.scss';

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


const tableTitle = 'Agency';

const defaultInput = {
    'SerialID':'',
    'AgencyName': '',
    'AgencyClose': '',
    'AgencyCode': '',
    'Shift': '',
    'LevelOneSingleTime':0,
    'LevelOneTimeAndHalf':0,
    'LevelOneDoubleTime':0,
    'LevelOneDoubleTimeAndHalf':0,
    'LevelTwoSingleTime':0,
    'LevelTwoTimeAndHalf':0,
    'LevelTwoDoubleTime':0,
    'LevelTwoDoubleTimeAndHalf':0,
    'LevelThreeSingleTime':0,
    'LevelThreeTimeAndHalf':0,
    'LevelThreeDoubleTime':0,
    'LevelThreeDoubleTimeAndHalf':0,
    'LevelFourSingleTime':0,
    'LevelFourTimeAndHalf':0,
    'LevelFourDoubleTime':0,
    'LevelFourDoubleTimeAndHalf':0,
    'LevelFiveSingleTime':0,
    'LevelFiveTimeAndHalf':0,
    'LevelFiveDoubleTime':0,
    'LevelFiveDoubleTimeAndHalf':0,

    'LevelSixSingleTime':0,
    'LevelSixTimeAndHalf':0,
    'LevelSixDoubleTime':0,
    'LevelSixDoubleTimeAndHalf':0,

    'LevelSevenSingleTime':0,
    'LevelSevenTimeAndHalf':0,
    'LevelSevenDoubleTime':0,
    'LevelSevenDoubleTimeAndHalf':0,
    
    'LevelEightSingleTime':0,
    'LevelEightTimeAndHalf':0,
    'LevelEightDoubleTime':0,
    'LevelEightDoubleTimeAndHalf':0,

    'TeaMoney':0,
    'ForkliftAllowance':0,
    'FirstAidAllowance':0,
    'AwardHours':0,
    'GST':10,
    'DCMUser':''
};

// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'Employee Category': ['Permanent', 'Casual', 'HeadOffice'],
    'Shift Code': [],
    'AgencyClose':['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    'Agency': [],
    'Level': ['Trainee', 'Level-1', 'Level-2', 'Level-2']
};

const Agency =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput,, handleInputEvent] = useInputState(defaultInput);
    
    const user = useSelector(store => store.user); 
    defaultInput.DCMUser = user ; 

    // Current State
    const [tableLoading, setTableLoading] = useState(true);

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('User Details'); 
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);

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
    'DCMUser': input.DCMUser
})

        await api.post('Maintenance/Agency/GetAllAgencies',body).then(
            res => {
                let data = res.data;  
                
                setTableData(data);
                setOpen(false);
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) { 
                  
                    }
                    else 
                    {
                    }
                }
            );
    };

    const addHandler = async() => {
        let body = new URLSearchParams(input);
        await  api.post('/Maintenance/Agency/InsertNewAgency', body).then( 
            res => {
                let response = res.data;
              
                if (response === 'Agency Created') { 
                    
                    // Update table on the frontend
                   getTable();
                   setModalMessage(`Agency ${input.AgencyName} Created`);
                }
                else if (response === 'Agency Already Present') { 
                    setModalMessageError(`Error:Agency ${input.AgencyName} already present`);
                }
                else {
                    setModalMessageError(response); 
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

    const updateHandler = async () => {

        if (!checkChange(originalInput, input)) {
            setModalMessageError('Error: No changes have been made to Agency details');
            setLoadModal(false);
            return;
        }
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/Agency/UpdateAgency', body).then( 
            res => {
                let response = res.data;
              
                if (response === 'Agency Updated') { 
                    setModalMessage(`Selected Agency Updated`); 
                    // Update table on the frontend
                    var rowNode = gridApi.getRowNode(input.SerialID);
                    var newData = input
                    rowNode.setData(newData);
               
                  
                }
                else if (response === 'Agency cannot be Updated') { 
                    setModalMessageError(`Error:Agency cannot be Updated.`);
                }
                else
                {
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
            'AgencyName': rowdata.data.AgencyName,
            'Shift':rowdata.data.Shift,
            'DCMUser':input.DCMUser
        });
        var r = window.confirm("Please confirm to delete this entry");
        if (r == true) 
        {
        await api.post('Maintenance/Agency/DeleteAgency', body).then( 
            res => {
               
               
               if (res.data === "Agency Deleted")
               {
                rowdata.api.applyTransaction({
                    remove: [rowdata.node.data]
                });
               }
               else
               {
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
    const ActionRowButton = (params) => {
        params.columnApi.autoSizeAllColumns();
        return (

            <React.Fragment>

                                <Tooltip title="Edit">
                                <IconButton aria-label="Edit"  onClick = {()=>editTableHandler(params)} >
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
    
          fileName: 'Agency_'+user,
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
            setModalTitle('Add Agency');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Agency'); 
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Dropdown Data
        getTable();

        // Retrieve Dropdown Data
        api.get('/Maintenance/UserInfo/GetAllShiftCodes').then( // Shit Codes List 
            res => {
                let data = res.data;
                dropdownData['Shift Code'] = data.map(x => x['shiftcode']);
            });
       
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
             <h4>AGENCY</h4>
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
              
             }}
          
           pagination ={true}
           animateRows= {true}
          rowSelection = "multiple"
          rowData={tableData}
     >

         <AgGridColumn headerName ="Action"  lockPosition = {true} cellRendererFramework = {ActionRowButton}   colId="Action"  editable = {false} filter={false} />
         <AgGridColumn  headerName ="Serial ID" field="SerialID" editable={false}  />
         <AgGridColumn  headerName ="Agency" field="AgencyName"  />
         <AgGridColumn  headerName ="Code" field="AgencyCode"  />
         <AgGridColumn  headerName ="Agency Close" field="AgencyClose"  />
         <AgGridColumn  headerName ="Shift" field="Shift"  />

         <AgGridColumn  headerName ="LevelOneSingleTime" field="LevelOneSingleTime"  />
         <AgGridColumn  headerName ="LevelOneTimeAndHalf" field="LevelOneTimeAndHalf"  />
         <AgGridColumn  headerName ="LevelOneDoubleTime" field="LevelOneDoubleTime"  />
         <AgGridColumn  headerName ="LevelOneDoubleTimeAndHalf" field="LevelOneDoubleTimeAndHalf"  />

         <AgGridColumn  headerName ="LevelTwoSingleTime" field="LevelTwoSingleTime"  />
         <AgGridColumn  headerName ="LevelTwoTimeAndHalf" field="LevelTwoTimeAndHalf"  />
         <AgGridColumn  headerName ="LevelTwoDoubleTime" field="LevelTwoDoubleTime"  />
         <AgGridColumn  headerName ="LevelTwoDoubleTimeAndHalf" field="LevelTwoDoubleTimeAndHalf"  />
         
         <AgGridColumn  headerName ="LevelThreeSingleTime" field="LevelThreeSingleTime"  />
         <AgGridColumn  headerName ="LevelThreeTimeAndHalf" field="LevelThreeTimeAndHalf"  />
         <AgGridColumn  headerName ="LevelThreeDoubleTime" field="LevelThreeDoubleTime"  />
         <AgGridColumn  headerName ="LevelThreeDoubleTimeAndHalf" field="LevelThreeDoubleTimeAndHalf"  />
         
         <AgGridColumn  headerName ="LevelFourSingleTime" field="LevelFourSingleTime"  />
         <AgGridColumn  headerName ="LevelFourTimeAndHalf" field="LevelFourTimeAndHalf"  />
         <AgGridColumn  headerName ="LevelFourDoubleTime" field="LevelFourDoubleTime"  />
         <AgGridColumn  headerName ="LevelFourDoubleTimeAndHalf" field="LevelFourDoubleTimeAndHalf"  />
         
         <AgGridColumn  headerName ="LevelFiveSingleTime" field="LevelFiveSingleTime"  />
         <AgGridColumn  headerName ="LevelFiveTimeAndHalf" field="LevelFiveTimeAndHalf"  />
         <AgGridColumn  headerName ="LevelFiveDoubleTime" field="LevelFiveDoubleTime"  />
         <AgGridColumn  headerName ="LevelFiveDoubleTimeAndHalf" field="LevelFiveDoubleTimeAndHalf"  />

         
         <AgGridColumn  headerName ="LevelSixSingleTime" field="LevelSixSingleTime"  />
         <AgGridColumn  headerName ="LevelSixTimeAndHalf" field="LevelSixTimeAndHalf"  />
         <AgGridColumn  headerName ="LevelSixDoubleTime" field="LevelSixDoubleTime"  />
         <AgGridColumn  headerName ="LevelSixDoubleTimeAndHalf" field="LevelSixDoubleTimeAndHalf"  />

         
         <AgGridColumn  headerName ="LevelSevenSingleTime" field="LevelSevenSingleTime"  />
         <AgGridColumn  headerName ="LevelSevenTimeAndHalf" field="LevelSevenTimeAndHalf"  />
         <AgGridColumn  headerName ="LevelSevenDoubleTime" field="LevelSevenDoubleTime"  />
         <AgGridColumn  headerName ="LevelSevenDoubleTimeAndHalf" field="LevelSevenDoubleTimeAndHalf"  />

         
         <AgGridColumn  headerName ="LevelEightSingleTime" field="LevelEightSingleTime"  />
         <AgGridColumn  headerName ="LevelEightTimeAndHalf" field="LevelEightTimeAndHalf"  />
         <AgGridColumn  headerName ="LevelEightDoubleTime" field="LevelEightDoubleTime"  />
         <AgGridColumn  headerName ="LevelEightDoubleTimeAndHalf" field="LevelEightDoubleTimeAndHalf"  />

         <AgGridColumn  headerName ="Tea Money" field="TeaMoney"  />
         <AgGridColumn  headerName ="Forklift Allowance" field="ForkliftAllowance"  />
         <AgGridColumn  headerName ="FirstAid Allowance" field="FirstAidAllowance"  />
         <AgGridColumn  headerName ="GST(%)" field="GST"  />
         
         
         
          
     </AgGridReact>
     </div>
     <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal}  unrestrictWidth={true}
                    setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                <div className='modal-grouping--col-5'>
                    <TextField name='AgencyName' label='Agency' value={input.AgencyName} onChange={handleInputEvent} restrictions='default' required></TextField>
                    <TextField name='AgencyCode' label='Agency Code' value={input.AgencyCode.trim()} onChange={handleInputEvent} restrictions='default' required></TextField>
                    <DropDown name='Shift' label='Shift' options={dropdownData['Shift Code']} defaultValue={input.Shift} onChange={handleInputEvent} required  disabled={modalMode === 1 ? null : true}></DropDown>
                    <DropDown name='AgencyClose' label='Agency Close' options={dropdownData['AgencyClose']} defaultValue={input.AgencyClose} onChange={handleInputEvent} required></DropDown>
                    <TextField name='TeaMoney' label='Meal'  type="number" value={input.TeaMoney} onChange={handleInputEvent} restrictions='name' required></TextField>
                    <div className='modal-item'></div>
                    <div className='modal-item'>
                        <label className='label label--position'>Ordinary Time</label>
                    </div>
                    <div className='modal-item'>
                        <label className='label label--position'>Time and A Half</label>
                    </div>
                    <div className='modal-item'>
                        <label className='label label--position'>Double Time</label>
                    </div>
                    <div className='modal-item'>
                        <label className='label label--position'>Double Time And Half</label>
                    </div>
                    <div className='modal-item'>
                        <label className='label label--position'>Level-1</label>
                    </div> 
                    <TextField name='LevelOneSingleTime'   type="number" value={input.LevelOneSingleTime}  onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelOneTimeAndHalf' type="number" value={input.LevelOneTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelOneDoubleTime'  type="number" value={input.LevelOneDoubleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelOneDoubleTimeAndHalf'  type="number" value={input.LevelOneDoubleTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <div className='modal-item'>
                        <label className='label label--position'>Level-2</label>
                    </div>
                    <TextField name='LevelTwoSingleTime'   type="number" value={input.LevelTwoSingleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelTwoTimeAndHalf' type="number" value={input.LevelTwoTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelTwoDoubleTime'   type="number" value={input.LevelTwoDoubleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelTwoDoubleTimeAndHalf'  type="number" value={input.LevelTwoDoubleTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <div className='modal-item'>
                        <label className='label label--position'>Level-3</label>
                    </div>
                    <TextField name='LevelThreeSingleTime'   type="number" value={input.LevelThreeSingleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelThreeTimeAndHalf' type="number" value={input.LevelThreeTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelThreeDoubleTime'   type="number" value={input.LevelThreeDoubleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelThreeDoubleTimeAndHalf'  type="number" value={input.LevelThreeDoubleTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <div className='modal-item'>
                        <label className='label label--position'>Level-4</label>
                    </div>
                    <TextField name='LevelFourSingleTime'   type="number" value={input.LevelFourSingleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelFourTimeAndHalf' type="number" value={input.LevelFourTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelFourDoubleTime'  type="number" value={input.LevelFourDoubleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelFourDoubleTimeAndHalf'  type="number" value={input.LevelFourDoubleTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <div className='modal-item'>
                        <label className='label label--position'>Level-5</label>
                    </div>
                    <TextField name='LevelFiveSingleTime'   type="number" value={input.LevelFiveSingleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelFiveTimeAndHalf' type="number" value={input.LevelFiveTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelFiveDoubleTime'  type="number" value={input.LevelFiveDoubleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelFiveDoubleTimeAndHalf'  type="number" value={input.LevelFiveDoubleTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    
                    <div className='modal-item'>
                        <label className='label label--position'>Level-6</label>
                    </div>
                    <TextField name='LevelSixSingleTime'   type="number" value={input.LevelSixSingleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelSixTimeAndHalf' type="number" value={input.LevelSixTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelSixDoubleTime'  type="number" value={input.LevelSixDoubleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelSixDoubleTimeAndHalf'  type="number" value={input.LevelSixDoubleTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>

                    <div className='modal-item'>
                        <label className='label label--position'>Level-7</label>
                    </div>
                    <TextField name='LevelSevenSingleTime'   type="number" value={input.LevelSevenSingleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelSevenTimeAndHalf' type="number" value={input.LevelSevenTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelSevenDoubleTime'  type="number" value={input.LevelSevenDoubleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelSevenDoubleTimeAndHalf'  type="number" value={input.LevelSevenDoubleTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>

                    <div className='modal-item'>
                        <label className='label label--position'>Level-8</label>
                    </div>
                    <TextField name='LevelEightSingleTime'   type="number" value={input.LevelEightSingleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelEightTimeAndHalf' type="number" value={input.LevelEightTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelEightDoubleTime'  type="number" value={input.LevelEightDoubleTime} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='LevelEightDoubleTimeAndHalf'  type="number" value={input.LevelEightDoubleTimeAndHalf} onChange={handleInputEvent} restrictions='number' required></TextField>
                    
                    
                    
                    
                    <div className='modal-item'>
                        <label className='label label--position'>Other Expenses</label>
                    </div>
                    <TextField name='ForkliftAllowance' label='ForkLift'   type="number" value={input.ForkliftAllowance} onChange={handleInputEvent} restrictions='number' ></TextField>
                    <TextField name='AwardHours' label='Award Hours'   type="number" value={input.AwardHours} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='FirstAidAllowance' label='First Aid'  type="number"  value={input.FirstAidAllowance} onChange={handleInputEvent} restrictions='number' required></TextField>
                    <TextField name='GST' label='GST(%)'  type="number"  value={input.GST} onChange={handleInputEvent} restrictions='number' required></TextField>
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

export default Agency;