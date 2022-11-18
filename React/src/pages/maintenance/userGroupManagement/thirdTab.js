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

import Backdrop from '@material-ui/core/Backdrop';
import {ClockLoader} from "react-spinners";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import { lighten, makeStyles } from '@material-ui/core/styles';
import './thirdtab.scss';

import Add from '../../../components/icons/Add.png';

import Edit from '../../../components/icons/Edit.png';
import Delete from '../../../components/icons/Bin.png';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';


const defaultInput = {
    'Username': '',
    'FirstName': '',
    'LastName': '',
    'Email': '',
    'UserGroup': '',
    'AccessSite': '',
    
  
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


const ThirdTab = () => {
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
     const [names,setnames] = useState([]);


    // Current State
   

       // const originalInput = usePrevious(input);
   
       const [gridApi, setGridApi] = useState(null);
       const [gridColumnApi, setGridColumnApi] = useState(null);
       const [rowparams, setrowparams] = useState(null);
       const [tableLoading, setTableLoading] = useState(true);
       const [Sites , setSites] = useState([]);
       const [Warehouse, setWarehouse] = useState([]);


       const handleChange = (event) => {
         const {
           target: { value },
         } = event;
         setWarehouse(
           // On autofill we get a stringified value.
           typeof value === 'string' ? value.split(',') : value,
         );
       };

         //Backdrop
         const [open, setOpen] = React.useState(false);
   
   
         //cSS Classes 
         const classes = useToolbarStyles();
       // Current State
     

    // Event Handlers for Table
  

    const editTableHandler = (params) => {
        setrowparams(params);
        setShowModal(true); 
        setModalMode(2);

        setInput(params.data);
        setOriginalInput(params.data);
        setModalMessage('');
        setModalMessageError('');
        var sites = [];
        if (params.data.AccessSite.includes('-'))
        {
          sites = params.data.AccessSite.split('-')
        }
        else  if (params.data.AccessSite.includes(','))
        {
          sites = params.data.AccessSite.split(',');
        }
        
        else
        {
          sites.push(params.data.AccessSite);
        }
        
        setWarehouse(sites);
    }
    // Function to send requests to update table
    const getDCMUsers = async () => {
        setTableLoading(true);
        api.post('/Maintenance/Pickers/GetAllDCMUsers').then(
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
    

    const updateHandler = async (rowdata) => {
 

      if (Warehouse.length == 0)
      {
        setLoadModal(false);
        setModalMessageError(`Error: Please select at least one warehouse site for the user`);
        return;
      }
       
       input.AccessSite = Warehouse;
        let body = new URLSearchParams(input);

    
        await api.post('Settings/Register/UpdateDCMUser', body).then(
            res => {
                let response = res.data;
               

                if (response === 'User is Updated in the DC Metrics') {
                    setModalMessage(`User with UserName ${input.Username} with User group ${input.UserGroup} successfully updated.`);
                    // Update table on the frontend

                    var rowNode = gridApi.getRowNode(input.Username);
                    var newData = input;
                    rowNode.setData(newData);

                    setLoadModal(false);
                  
                }
              
                else {
                    setLoadModal(false);
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                }
              
            }).catch(
                err => { // TODO: Error handling
                    
                    alert(`Error: Failed to connect to server. Please try again.`);
                    
                }
            );
    };

    const deleteHandler = async (params) => {
        

        let body = new URLSearchParams({
            'Username': params.data.Username
           
        });
        await api.post('Settings/Register/DeleteDCMUser', body).then(
            res => {
        
                 if (res.data === "User is deleted in the DC Metrics")
                 {
                    params.api.updateRowData({
                        remove: [params.node.data]
                    });
            }
            else

            {
                alert ("Unable to delete the selected user");
            }
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
            return data.Username;
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





    const onSubmit = (event) => { // Form switchs submit eveent
        event.preventDefault();
        setLoadModal(true);
        setModalMessage('');
        setModalMessageError('');

        if (modalMode === 1) {
           
        }
        else {
            updateHandler(event);
        }
    };


    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
          
        }
        else {
            setModalTitle('Update DCM User');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => {
        getDCMUsers();

        //Get All user Groups api call
        api.get('/Settings/Register/GetAllSites').then( // Team Manager List
        res => {
          let data = res.data;
          
          setSites(data.map(x => x.value));
        });



       api.post('/Maintenance/Pickers/GetAllUserGroups').then(
           res => {
           let data = res.data;  

            if (data)
             {
              setnames(data);
            }
      
              }).catch(
                  err => {
              // TODO: Error handling
                   if (err.response) { 
                      console.log(err.response)
                     }
                 else {  }
        }
    );




    }, []);

    return (

        <div>

      
       
       <Backdrop className={classes.backdrop} open={open}>
     <ClockLoader color="green" loading={true}   size={50}></ClockLoader>
     </Backdrop>
          
       <div className="panel panel--table">
           <div className='table-full-container'>

         <div className="test-header">
         
       </div>
         
            <div className="ag-theme-alpine" style={{ width: '100%', height: 750 }}  >

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
         <AgGridColumn  headerName ="User Name" field="Username"  />
         <AgGridColumn  headerName ="First Name" field="FirstName"   />
         <AgGridColumn  headerName ="Last Name" field="LastName"  />
         <AgGridColumn  headerName ="User Group" field="UserGroup"  />
         <AgGridColumn  headerName ="Email" field="Email"  />
         <AgGridColumn  headerName ="Warehouse" field="AccessSite"  />
       
     </AgGridReact>
     </div>
     <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal}
                    setShowModal={setShowModal} loadModal={loadModal} message={modalMessage}  messageError={modalMessageError} unrestrictWidth={true}>
                    <div className='modal-grouping--col-3'>
                        <TextField name='Username' label='User Name' value={input.Username} onChange={handleInputEvent} required disabled restrictions='string'></TextField>
                        <TextField name='FirstName' label='First Name' value={input.FirstName} onChange={handleInputEvent} required restrictions='name'></TextField>
                        <TextField name='LastName' label='Last Name' value={input.LastName} onChange={handleInputEvent} required restrictions='name'></TextField>
                        <TextField name='Email' label='Email'  type='Email'value={input.Email} onChange={handleInputEvent} required restrictions='string'></TextField>
                        <DropDown name='UserGroup' label='User Group' options={names} defaultValue={input.UserGroup} onChange={handleInputEvent} required></DropDown>
                     
                           <div className='modal-item'>
                              <label className='label label--position'  > Warehouse</label>
                              <Select style={{ width: '100%'}} className='modal-fields modal-fields' multiple  value={Warehouse}  onChange={handleChange} renderValue={(selected) => selected.join(', ')}   >
                                    {Sites.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={Warehouse.indexOf(name) > -1} />
                                         <ListItemText primary={name} />
                                    </MenuItem>
                                   ))}
                                 </Select>
                              </div>
                        
                      

                        
                        </div>
                    
                </Modal>
     <div>

     </div>


            </div>

        </div>

                </div>
               

    )
};

export default ThirdTab;