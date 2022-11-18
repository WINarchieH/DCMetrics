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
import './errors.scss';
import DownloadExcel from '../../../components/icons/Download_Excel.png';
import UploadExcel from '../../../components/icons/Upload_arrow.png';
import Edit from '../../../components/icons/Edit.png';
import Delete from '../../../components/icons/Bin.png';
import Add from '../../../components/icons/Add.png';


import {ExcelRenderer, OutTable} from 'react-excel-renderer'



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


const tableTitle = 'Errors';

const defaultInput = {
   
    'PickerID': '',
    'License': '',
    'StartDate': '',
    'SKU': '',
    'PickLocation': '',
    'PickVar': 0,
    'Error': '',
    'Action': '',
    'QAChecked': '',
    'Week': '',
    'PickVarCases': ''
};

// const defaultInput = {
//     'SerialID': '',
//     'UserName': '',
//     'FirstName': '',
//     'SurName': '',
//     'TaskName': '',
//     'StartDate': '',
//     'StartTime': '',
//     'EndDate': '',
//     'EndTime': '',
//     'DownTime': 0,
//     'TotalTime': '',
//     'Site': '',
// };

// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'Task Name': [],
    'UserList':[],
    'Shift Code': []
};


const Errors =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1); 
    const [modalTitle, setModalTitle] = useState('Errors'); 
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [FullName, setFullName] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);
    const [selectedDate, setSelectedDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [ToselectedDate, setToSelectedDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [userDate, setuserDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [showuploadErrorresultModal, setshowuploadErrorsresultModal] = useState(false); 

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

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    
    const dateRange = useRef([]);
    
    // Event Handlers for Table
    const addTableHandler = () => {
        setShowModal(true);
        setuserDate(dateToInput(inputToDate(formatDate(new Date()))));
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

        await api.post('/DataCapture/Errors/GetAllErrors', body).then(
            res => {
                console.log(res.data)
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
                console.log(data)


                
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
        //Add date checks
        input.StartDate = inputToDate(userDate);
        input.pickerID = input.UserName;
        if(!input.startDate) {
            input.startDate = (inputToDate(formatDate(new Date())));
        }
        let body = new URLSearchParams(input);



        

        api.post('/DataCapture/Errors/AddError', body).then( 
            res => {
                let response = res.data;

                if (response === 'New Error has been added') {
                    getTable(inputToDate(startDate), inputToDate(endDate));
                    setModalMessage(`Error for user ${input.FirstName} has been successfully added.`);
                }                
                else {
                    setModalMessageError(response);
                }
                setLoadModal(false);
            }
        ).catch(
            err => { // TODO: Error handling
              ;
                setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                setLoadModal(false);
            }
        );

    };

    const updateHandler = async () => { // TODO: Update event handler

        input.StartDate = inputToDate(userDate);
        if (!checkChange(originalInput, input)) { 
            setModalMessageError('Error: No changes have been made.'); 
            setLoadModal(false);
            return;
        }
        

        var username = input.QAChecked
        var names = username.split(' ');
        names[names.length-1] = names[names.length-1].replace('(', '').replace(')', '');
       
        
        let body = new URLSearchParams(input);

        await api.post('/DataCapture/Errors/UpdateError', body).then( 
            res => {
                let response = res.data;
               if (response === 'Error Record is Updated') { 
                    setModalMessage(`Entry updated.`); 
                  
                    // Update table on the frontend
                    var rowNode = gridApi.getRowNode(input.SerialID);

                    input.QAChecked = username;

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
        await api.post('/DataCapture/Errors/DeleteError/', body).then( 
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



    const onFileChange = (event) => { 
        let fileObj = event.target.files[0]

        if (fileObj.name.includes("xlsx") === false)
        {
          alert("Please upload an Excel File with the correct format");
          return;
        }
  
          //just pass the fileObj as parameter
          ExcelRenderer(fileObj, (err, resp) => { 
            if(err){
              console.log(err);            
            }
            else{
               if (resp.rows.length > 0)
               {
                 setshowuploadErrorsresultModal(true);
                addexcelerrors(resp);
               }
            }
        });


    }; 

    const addexcelerrors = async (resp) =>
    {
        
       
        var totalerrors = resp.rows.length ;
        var errorsadded = 0;
        var errorsinteracted = 0;

       
        for(var i = 5 ; i < resp.rows.length -1 ; i++)
        {
          if (resp.rows[i][0] != null)
          {
            var inputobj = {
                'License': resp.rows[i][0] ,
                'SKU': resp.rows[i][1] ,
                'PickLocation': resp.rows[i][2] ,
                'PickVar': resp.rows[i][4] ,
                'Error': resp.rows[i][5] ,
                'PickerID': resp.rows[i][6] ,
                'SurName': '' ,
                'FirstName': '' ,
                'Action': resp.rows[i][7] ,
                'QAChecked': resp.rows[i][8] ,
               
                'PickVarCases': resp.rows[i][11] ,
                
                'SerialID': '' ,
                'StartDate':  resp.rows[i][10]

            
                // 'StartDate':  inputToDate(formatDate(resp.rows[i][10]))

            }
        
           
            let body = new URLSearchParams(inputobj);
            
          if (! (inputobj.PickerID === null))
           {
              if (inputobj.PickerID.length > 1)
              {
                 await  api.post('/DataCapture/Errors/InsertExcelImportError', body).then( 
                     res => {
                                if (res.data === "Success")
                                {
                                     errorsadded ++;

                                }
                            }
                           ).catch(
                                     err => { // TODO: Error handling
                                           console.log("error");
                   
                                        }
                                     );
            
               }
            }
        }
     }

     setshowuploadErrorsresultModal(false);
     var message = "Total "+errorsadded+  " Errors added into DC Metrics";
     alert(message);
        getTable(inputToDate(startDate), inputToDate(endDate)); 
}       
    





      const ExportDataToCSVFile =() =>
     {
          var excelParams = {
    
          fileName: 'Errors',
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

     const changestartDate = (e) =>
   {
       setuserDate(e.target.value);
       


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
                
                if (startDateObj < dateRange.current[0] || endDateObj > dateRange.current[1]) {
                    getTable(inputToDate(startDate), inputToDate(endDate));
                    dateRange.current = [startDateObj, endDateObj];
                }
            }
        }
    }, [startDate, endDate]);

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add Error');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Error'); 
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
    
            // api.get('/Maintenance/UserInfo/GetAllShiftCodes').then( // Shit Codes List 
            // res => {
            //     let data = res.data;
            //     dropdownData['Shift Code'] = data.map(x => x['shiftcode']);
            // });
    
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
             <h4>ERRORS</h4>
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
               
                {/* <Tooltip title='File Import'> */}
                <input accept=".xlsx, .xls" name = "hiddenImport" id="importFileUpload" type="file" onChange={onFileChange} style={{ display: 'none' }}/> 
                <label htmlFor="importFileUpload">
                    <IconButton aria-label='UploadExcel' component="span">
                        <img width={ 35 } height={35} src={UploadExcel}></img>
                    </IconButton>
                </label>
               {/* </Tooltip> */}

               <Tooltip title='Add Error'>
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
        



         <AgGridColumn  headerName ="Picker ID" field="PickerID"  />
         <AgGridColumn  headerName ="Firstname" field="FirstName"  />
         <AgGridColumn  headerName ="Surname" field="SurName"  />
         <AgGridColumn  headerName ="Date" field="StartDate" filter={false}  />
         <AgGridColumn  headerName ="Pick Var" field="PickVar"  />
         <AgGridColumn  headerName ="Pick Var Cases" field="PickVarCases"  />
         {/* <AgGridColumn  headerName ="Shift Code" field="ShiftCode"/> */}
         <AgGridColumn  headerName ="License" field="License"/>
         <AgGridColumn  headerName ="SKU" field="SKU"  />
         <AgGridColumn  headerName ="Pick Location" field="PickLocation"  />
         <AgGridColumn  headerName ="Error" field="Error"  />
         <AgGridColumn  headerName ="Action" field="Action"  />
         <AgGridColumn  headerName ="Checked By" field="QAChecked"  />
         <AgGridColumn  headerName ="Week" field="Week"  />
         

         <AgGridColumn  headerName ="Serial ID" field="SerialID" editable={false}  />


          
     </AgGridReact>
     </div>
     <React.Fragment>
     <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal}  unrestrictWidth={true}
                                setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>                         
                            
                            <div className={modalMode === 1 ? 'modal-grouping--col-4' : 'modal-grouping--col-5'}>
                                <DropDown className="UserListDropDown modal-fields--outline" name='FullName' label='User List' options={dropdownData['UserList']} hidden={modalMode === 1 ? null : true} defaultValue={FullName} disabled={modalMode === 1 ? null : true} onChange={UserListChange} required></DropDown>
                                <TextField name='PickerID' label='Picker ID' value={input.PickerID} onChange={handleInputEvent} restrictions='default' disabled hidden={modalMode === 1 ? true : null}></TextField>
                                <TextField name='FirstName' label='First Name' value={input.FirstName} onChange={handleInputEvent} restrictions='name' disabled></TextField>
                                <TextField name='SurName' label='Surname' value={input.SurName} onChange={handleInputEvent} restrictions='name' disabled></TextField>
                            </div>

                            <div className='modal-grouping--col-4'>                                                             
                                <TextField name='StartDate' label='Date' value={userDate} onChange={changestartDate} required type='date' ></TextField>                                 
                                
                              
                                <TextField name='PickVar' label='Pick Var' value={input.PickVar} onChange={handleInputEvent}  type='number' required></TextField> 
                                <TextField name='PickVarCases' label='Pick Var Cases' value={input.PickVarCases} onChange={handleInputEvent}  type='number'></TextField>
                                <DropDown name='QAChecked' label='Checked By' options={dropdownData['UserList']} defaultValue={input.QAChecked} restrictions='default'  onChange={handleInputEvent} required></DropDown> 
                                <TextField name='License'label='License' value={input.License} onChange={handleInputEvent} ></TextField>                                
                                <TextField name='SKU' label='SKU' value={input.SKU} onChange={handleInputEvent} ></TextField>                                
                                <TextField name='PickLocation' label='Pick Location' value={input.PickLocation} onChange={handleInputEvent} ></TextField>                                
                                <TextField name='Error' label='Error' value={input.Error} onChange={handleInputEvent} ></TextField>                                
                                <TextField name='Action' label='Action' value={input.Action} onChange={handleInputEvent} ></TextField>                                
                                <TextField name='SerialID' label='SerialID' value={input.SerialID} onChange={handleInputEvent} hidden={modalMode === 1 ? true : null} disabled></TextField>
                            </div>
                        </Modal>
                        <div className={ showuploadErrorresultModal ? 'modal-background' : null} ></div>
                          <div className={showuploadErrorresultModal ? 'modal-container modal-container--display' : 'modal-container--hide'}>
                          <div className='modal-item'>
                            
                            <h4>Errors are getting uploaded into DC Metrics. Please wait for a couple for minutes</h4>
                         
                          </div>
                          <div className='modal-item'>
                              <MoonLoader  color="blue" loading="true"   size={50}></MoonLoader>
                         
                          </div>
               
                          </div>
                         
                         </React.Fragment>
                        
     <div>

     </div>


            </div>

        </div>

                </div>
                </div>

        
    )
};

export default Errors;


