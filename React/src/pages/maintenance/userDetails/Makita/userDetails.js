import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import api from '../../../../components/api/api';
import {DateCell} from '../../../../components/table/tableCells';
import {SelectMultipleFilter, SelectDateRange} from '../../../../components/table/filters';
import Modal, {checkChange} from '../../../../components/containers/modal/modal';
import TextField from '../../../../components/fields/textfield';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../../components/fields/dateHelpers';
import DropDown from '../../../../components/fields/dropdown';
import Toggle, {booleanToOutput, outputToBoolean} from '../../../../components/fields/toggle';
import {useInputState, usePrevious} from '../../../../components/hooks/hooks';
import {orderDatetime} from '../../../../components/table/sortingFunctions';
import { Tooltip, IconButton } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import './userDetails.scss';
import Add from '../../../../components/icons/Add.png';
import DownloadExcel from '../../../../components/icons/Download_Excel.png';
import Download from '../../../../components/icons/Download_arrow.png';

import calculatetotal from '../../../../components/icons/generatepayroll.png'
// Ag Grid

// Importing Ag Grid Community Version
import AutoCompleteEditor from'../../../../components/agGridComponents/AutoCompleteEditor';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Header from '../../../../components/header/header';
import Backdrop from '@material-ui/core/Backdrop';
import {ClockLoader, FadeLoader, PropagateLoader, MoonLoader} from "react-spinners";

import { lighten, makeStyles } from '@material-ui/core/styles';



//Excel Download
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import GetAppIcon from '@material-ui/icons/GetApp';
import {ExcelRenderer, OutTable} from 'react-excel-renderer'

import Edit from '../../../../components/icons/Edit.png';
import assignleaveicon  from '../../../../components/icons/Assign_Leave.png';
//import excel from 'xlsx';

//drag and Drop

import { FileDrop } from 'react-file-drop';
import { breakpoints } from '@mui/system';


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


const today = new Date();

const defaultInput = {
    'UserID': '',
    'FirstName': '',
    'Surname': '',
    'EmployeeID': '',
    'EmployeeCategory': 'Permanent',
    'ShiftCode': '',
    'TeamManager': '',
    'Status': 'A',
    'Agency': '',
    'Level': '',
    'FirstAid': '',
    'Role': '',
    'PartTime': '',
    'Sex': '',
    'DeptCode': '',
    'DateJoining': '',
    'DateLeaving': '',
    'LeaveStartDate':'',
    'DCMUser': '',
    'TabletID':'',
    'IsManager':'',
    'PayBundyTime':'',

   
};

const defaultLeaveInput = {
    LeaveType: '',
    LessThanOneDay:'',
    LeaveStartDate:'',
    LeaveStartTime:'',
    LeaveEndDate:'',
    LeaveEndTime:'',
    UserID:'',
    EmployeeCategory: ''
};

const defaultpayrollChangesInput = {
    UserID:'',
    Salary: 0,
    OrdinaryTime:0,
    TimeAndHalf:0,
    DoubleTime:0,
    PaidOvertime:'',
    SalaryEffectiveFrom:'',
    SalaryEffectiveTo:'',
    AfternoonAllowance: '',
    AfternoonAllowanceEffectivefrom: '',
    AfternoonAllowanceEffectiveTo: '',
    LeadingHand:'',
    LeadingHandAllowanceEffectiveTo:'',
    LeadingHandAllowanceEffectivefrom:'',
    LeadingHandRate:''

};



const defaultUserRoster = {
   StartDate:'',
   EndDate:'',
   UserID:''
};

const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'Employee Category': ['Permanent', 'Casual', 'HeadOffice'],
    'Shift Code': [],
    'Team Manager': [],
    'Status': ['A', 'N'],
    'Agency': [],
    'Level': ['Trainee', 'Level-1', 'Level-2', 'Level-3','Level-4','Level-5','Level-6','Level-7','Level-8'],
    'Role':[],
    'Sex': ['F', 'M', 'X'],
    'Dept Code': [],
    'Casual Leave Type':[],
    'Permanent Leave Type':[]
};

// Relabelling Dropdown labels
const dropdownLabels = {
    'Status': ['Active', 'Inactive'],
    'Level': ['Trainee', 'Level-1', 'Level-2', 'Level-3','Level-4','Level-5','Level-6','Level-7','Level-8'],
    'Sex': ['Female', 'Male', 'Unspecified']
};

const initialTableFilters = [
    {id: 'Status', value: ['A']}
];



const UserDetails =  () => {
   
    const user = useSelector(store => store.user); 
    defaultInput.DCMUser = user ; 

    const [tableData, setTableData] = useState([]);
    const [uploadexceldata, setuploadexceldata] = useState([]);
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const [payrollchangesinput, setpayrollchangesinput, setpayrollchangesinputName, handlePayrollchangesInputEvent] = useInputState(defaultpayrollChangesInput);
    const [leaveInput, setLeaveInput,setLeaveInputName, handleLeaveInputEvent] = useInputState(defaultLeaveInput);
    const [UserRosterInput, setUserRosterInput,setUserRosterName, handleUserRosterEvent] = useInputState(defaultUserRoster);
    
    //default date

    defaultUserRoster.StartDate = dateObjToInput(today);
    defaultUserRoster.EndDate = dateObjToInput(today);
  
    // Parameter handlers for modal
    const dateJoiningHandler = (e) => { setInputName('DateJoining', inputToDate(e.currentTarget.value)) };
    const dateLeavingHandler = (e) => { setInputName('DateLeaving', inputToDate(e.currentTarget.value)) };
    const firstAidHandler = (e) => { setInputName('FirstAid', booleanToOutput(e))};
    const paidOverTimeHandler = (e) => { setpayrollchangesinputName('PaidOvertime', booleanToOutput(e))};
    const leadingHandHandler = (e) => { setpayrollchangesinputName('LeadingHand', booleanToOutput(e))};
    const afterAllowanceHandler = (e) => { setpayrollchangesinputName('AfternoonAllowance', booleanToOutput(e))};
    const partTimeHandler = (e) => { setInputName('PartTime', booleanToOutput(e))};
    const isSupervisorHandler = (e) => { setInputName('IsManager', booleanToOutput(e))};
    const leaveDayHandler = (e) =>  { setLeaveInputName('LessThanOneDay',booleanToOutput(e)); setleaveEndDate(leaveStartDate)};
    const leaveStartDateHandler = (e) => { setLeaveInputName('LeaveStartDate', inputToDate(e.currentTarget.value)) };
    const leaveEndDateHandler = (e) => { setLeaveInputName('LeaveEndDate', inputToDate(e.currentTarget.value)) };

 
     // const originalInput = usePrevious(input);
   
     const [gridApi, setGridApi] = useState(null);
     const [gridColumnApi, setGridColumnApi] = useState(null);
     const [rowparams, setrowparams] = useState(null);
 
       //Backdrop
       const [open, setOpen] = React.useState(false);
 
 
       //cSS Classes 
       const classes = useToolbarStyles();
     // Current State


    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('User Details'); 
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [userRosterloadModal, setuserRosterLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [updateRosterModalMessage, setupdateRosterModalMessage] = useState('');
    const [leaveModalMessage, setleaveModalMessage] = useState('');
    const [payrollModalMessage, setpayrollModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [UpdateRosterMessageError, setUpdateRosterModalMessageError] = useState('');
    const [leaveMessageError, setleaveModalMessageError] = useState('');
    const [payrollchangesMessageError, setpayrollchangesModalMessageError] = useState('');
    const [originalInput,setOriginalInput] = useInputState(input);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [state, setState] = React.useState({ checkedB: false});
    const [uploadusersModal, setuploadUsersModal] = useState(false);
    const [uploadusersModalMessage, setuploadUsersModalMessage] = useState('');
    const [uploadusersMessageError, setuploadusersMessageError] = useState('');
  

    const styles = {  width: 900, height:2500, color:'grey', padding: 10 };

    //Start and End Date Handlers
    const [rosterStartDate, setrosterStartDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [rosterEndDate, setrosterEndDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [leaveStartDate, setleaveStartDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [leaveEndDate, setleaveEndDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [userDateJoining, setuserDateJoining] = useState(inputToDate(formatDate(new Date())));
    const [SalaryFromDate, setSalaryFromDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [SalaryToDate, setSalaryToDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [LeadingHandFromDate, setLeadingHandFromDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [LeadingHandToDate, setLeadingHandToDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [afternoonFromDate, setafternoonFromDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [afternoonToDate,  setafternoonToDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [error, setError] = useState(null);
   
    // Parameters for assign leave modal
    const [showLeaveModal, setShowLeaveModal] = useState(false);   
    const [showPayrollModal, setShowPayrollModal] = useState(false);
    const [showUpdateRoster, setUpdateRosterModal] = useState(false); 
    const [showuploadUsersModal, setshowuploadUsersModal] = useState(false); 
    const [showleavesModal, setshowleavesModal] = useState(false); 
    const [showuploadUsersresultModal, setshowuploadUsersresultModal] = useState(false); 



    
   const excelcolumns =
   [
{
    'User ID (Mandatory)':"TestUserA",
    'First Name (Mandatory)': "Test",
    'Surname (Mandatory)': "UserA",
    'Employee ID (Mandatory)':"TestUserA",
    'Employee Category (Mandatory)': "Permanent",
    "Agency": '',
    'Shift Code (Mandatory)':'testShiftCode' ,
    'Team Manager (Mandatory)':"Test Manager",
    'Agency':'',
    'Level':'',
    'FirstAid':null,
    'Role':null,
    'Tablet ID(mandatory)':null,
    'Dept Code': null,
}
   ];


    // Excel Download Handler

    const exportToCSV = () => {
        
        
        const ws = XLSX.utils.json_to_sheet(excelcolumns);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, "UploadUsers_Template" + fileExtension);
      };

     const handleDrop = () => {
        // let fileList = this.state.files
        // for (var i = 0; i < files.length; i++) {
        //   if (!files[i].name) return
        //   fileList.push(files[i].name)
        // }
        // this.setState({files: fileList})
      }

    // Event Handlers for Table
    const addTableHandler = () => {

        defaultInput.DateJoining =  userDateJoining;
      //  defaultInput.DateJoining =  defaultInput.DateJoining.replaceAll('-','/');
        setShowModal(true);
        setModalMode(1);
        setInput(defaultInput);
        setModalMessage('');
        setModalMessageError('');

    };

    const editTableHandler = (params) => {
        // data = {...data, DateJoining: dateObjToDate(params.data.DateJoining), DateLeaving: dateObjToDate(params.data.DateLeaving), DCMUser: user};
      
        setShowModal(true); 
        setModalMode(2);
        setInput(params.data);
        setOriginalInput(params.data);
        setModalMessage('');
        setModalMessageError('');
    };
    
    // Component for Conditional Actions
    const assignLeaveButtonHandler = (data) => {        
        defaultLeaveInput.UserID = data.UserID;
        defaultLeaveInput.DCMUser = user;
        defaultLeaveInput.EmployeeCategory = data.EmployeeCategory;
        leaveInput.EmployeeCategory = data.EmployeeCategory
        setleaveModalMessage('');
        setShowLeaveModal(true);
        setLeaveInput(defaultLeaveInput);


    };

    const payrollChangesButtonHandler = async (data) => {

        payrollchangesinput.UserID = data.UserID;
        defaultpayrollChangesInput.UserID = data.UserID;
        setShowPayrollModal('');

        let body = new URLSearchParams({
            'UserID': payrollchangesinput.UserID 
        });

        await api.post('/Maintenance/UserInfo/GetPayroll', body).then(
            res => {
                let data = res.data;
           
                if(data == "") {
                    
                    setpayrollchangesinput(defaultpayrollChangesInput);
                }
                else {
                    //Patch where data isn't properly picking up
                    data.UserID = data.UserID
                    data.PaidOvertime = data.OvertimeAllowed;
                    data.LeadingHand = data.LeadingRateAllowed;
                    data.LeadingHandRate = data.LeadingRate;
                    setpayrollchangesinput(data);
                    //Dates are taken from global variables not payrollChangesInput so update manually
                    setSalaryToDate(dateToInput(inputToDate(data.SIneffectiveDate.substring(0, 10))));
                    setSalaryFromDate(dateToInput(inputToDate(data.SEffectiveDate.substring(0, 10))));
                    setafternoonFromDate(dateToInput(inputToDate(data.AEffectiveDate.substring(0, 10))));
                    setafternoonToDate(dateToInput(inputToDate(data.AIneffectiveDate.substring(0, 10))));
                    setLeadingHandFromDate(dateToInput(inputToDate(data.LREffectiveDate.substring(0, 10))));
                    setLeadingHandToDate(dateToInput(inputToDate(data.LRIneffectiveDate.substring(0, 10))));
                }
            }).catch(
                err => {
                    setpayrollchangesinput(defaultpayrollChangesInput);
                    // TODO: Error handling
                    if (err.response) {
                        console.log(err.response)
                    }
                    else {
                    }
                }
            );


        setShowPayrollModal(true);
        // setpayrollchangesinput(defaultpayrollChangesInput);


    };





    const conditionalActions = (row) => {


        if (row.values.EmployeeCategory === 'Permanent') {
        
                        return (
               
                <React.Fragment>


                <Tooltip title="Assign Leave">
                  <IconButton aria-label="assign leave" onClick={() => {assignLeaveButtonHandler(row.original)}}>
                  <TodayIcon></TodayIcon>
                  </IconButton>
              </Tooltip>
             
              
            </React.Fragment>
              
               
            );
        }
       
    }
  

    // Function to send requests to update table
    const getTable = async () => {
        setOpen(true);
        input.DCMUser = defaultInput.DCMUser;
        let body = new URLSearchParams(input);
        
        await api.post('/Maintenance/UserInfo/GetAllMakitaUsers',body).then(
            res => {
                let data = res.data;  
                // Convert dates to date objects  
                data = data.map(x => {
                   
                    x.DateJoining = dateObjToDate(dateToDateObj(x.DateJoining));
                    x.DateLeaving = dateObjToDate(dateToDateObj(x.DateLeaving));

                       
                    return x;
                });


                data.sort(function(a, b){
                    if(a.Status < b.Status) { return -1; }
                    if(a.Status > b.Status) { return 1; }
                    return 0;
                })
            
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

    const handleSwitchChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });

           input.DCMUser = defaultInput.DCMUser;
           let body = new URLSearchParams(input);


    

    }


    const ChangeRosterStartDate=(event) =>
    {
        setupdateRosterModalMessage('');
       setrosterStartDate(dateToInput(inputToDate(event.target.value)));
    };

    const ChangeRosterEndDate = (event) =>
     {
        setupdateRosterModalMessage('');
        setrosterEndDate(dateToInput(inputToDate(event.target.value)));
      };

      const ChangeLeaveStartDate=(event) =>
      {
         setleaveModalMessage('');
         setleaveStartDate(dateToInput(inputToDate(event.target.value)));
         setleaveEndDate(dateToInput(inputToDate(event.target.value)));
      };
  
      const ChangeLeaveEndDate = (event) =>
       {
        setleaveModalMessage('');
          setleaveEndDate(dateToInput(inputToDate(event.target.value)));
        };

        
    const ChangeSalaryfromDate=(event) =>
    {
       setpayrollModalMessage('');
       setSalaryFromDate(dateToInput(inputToDate(event.target.value)));
    };

    const ChangeSalaryToDate=(event) =>
    {
       setpayrollModalMessage(''); 
       setSalaryToDate(dateToInput(inputToDate(event.target.value)));
    };

    const ChangeLeadinghandfromDate=(event) =>
    {
       setpayrollModalMessage('');
         setLeadingHandFromDate(dateToInput(inputToDate(event.target.value)));
    };

    const ChangeLeadinghandToDate=(event) =>
    {
       setpayrollModalMessage(''); 
       setLeadingHandToDate(dateToInput(inputToDate(event.target.value)));
    };
    const ChangeAfternoonfromDate=(event) =>
    {
       setpayrollModalMessage('');
       setafternoonFromDate(dateToInput(inputToDate(event.target.value)));
       
    };

    const ChangeAfternoonToDate=(event) =>
    {
         setpayrollModalMessage(''); 
         setafternoonToDate(dateToInput(inputToDate(event.target.value)));
    };
     const addHandler = () => {

        
        if (new Date(dateToInput(input.DateLeaving)) < new Date(dateToInput(input.DateJoining))) {
            setModalMessageError(`Error: Join date after leave date. Please set leave date after join date.`);
            setLoadModal(false);
            return;
        }

        if (input.EmployeeCategory ==='Permanent' || input.EmployeeCategory ==='HeadOffice')
        {
            input.Agency ='';
            input.Level='';
            
        }
        else if (input.EmployeeCategory === 'Casual')
        {
         
        }



        let body = new URLSearchParams(input);

        api.post('/Maintenance/UserInfo/InsertMakitaUser', body).then( 
            res => {
                let response = res.data.response;

                if (response === 'New User Inserted') {
                    getTable();
                   // setModalMessage(`User ${input.FirstName} successfully added.`);

                   setShowModal(false);
                    setrosterStartDate( dateToInput(inputToDate(formatDate(new Date()))));
                    setrosterEndDate (dateToInput(inputToDate(formatDate(new Date()))));
                  
                    setUpdateRosterModalMessageError('');
                   setUpdateRosterModal(true);

                }
                else if (response === 'Duplicate entries present for the UserID. Please select another User ID.') {
                    setModalMessageError(`Error: User ID already found. Please choose another.`);
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

    const updateHandler = async () => {
        // if (dateToDateObj(input.DateLeaving) < dateToDateObj(input.DateJoining)) {
        //     setModalMessageError(`Error: Join date after leave date. Please set leave date after join date.`);
        //     setLoadModal(false);
        //     return;
        // }


        if (!checkChange(originalInput, input)) { 
            setModalMessageError('Error: No changes have been made.'); 
            setLoadModal(false);
            return;
        }

        if (input.EmployeeCategory ==='Permanent' || input.EmployeeCategory ==='HeadOffice')
        {
            input.Agency ='';
            input.Level='';
          
        }
        

        
             
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/UserInfo/updateMakitaUser', body).then( 
            
            res => {
                let response = res.data.response;

                if (response === 'Selected User Updated') { 
                  
                    var rowNode = gridApi.getRowNode(input.UserID);
                    var newData = input
                    rowNode.setData(newData);

                    setShowModal(false);
            
                    setrosterStartDate( dateToInput(inputToDate(formatDate(new Date()))));
                    setrosterEndDate (dateToInput(inputToDate(formatDate(new Date()))));
                  
                    setUpdateRosterModalMessageError('');
                   setUpdateRosterModal(true);

                }
                else if (response === '"Update Failed. Multiple records or no records are present in the system.') { 
                    setModalMessageError(`Error: User ID not found or not unique.`);
                }
                else {
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`); 
                }
                setLoadModal(false);
            }).catch(
                err => { // TODO: Error handling
                    
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`); 
                    setLoadModal(false);
                }
            );
    };

    
    const ReadExcelfile = (files,e)=>
    {
        let fileObj = files[0];

      if (files[0].name.includes("xlsx") === false)
      {
        alert("Please upload an Excel File with the correct format")
        return;
      }

        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => { 
          if(err){
            console.log(err);            
          }
          else{
          
            
            if (resp.rows.length > 0 )
            {
                addexcelusers(resp);
            }

            }
        });
    }; 


    const addexcelusers = async (resp) =>
    {
        

        var totalusers = resp.rows.length -1;
        var usersadded = 0;
        var usersissues = 0;
        var usersinteracted =0;
        var miliseconds = resp.rows.length * 1700;


        
        for(var i = 1 ; i < resp.rows.length ; i++)
        {
          var inputobj = {
            'UserID': resp.rows[i][0] ,
            'FirstName': resp.rows[i][1] ,
            'Surname': resp.rows[i][2] ,
            'EmployeeID':resp.rows[i][3] ,
            'EmployeeCategory': resp.rows[i][4] ,
            "Agency": resp.rows[i][5] ,
            'ShiftCode': resp.rows[i][6],
            'TeamManager':resp.rows[i][7],
            'Level':resp.rows[i][8],
            'FirstAid':resp.rows[i][9],
            'Role':resp.rows[i][10],
            'TabletID':resp.rows[i][11],
            'DeptCode': resp.rows[i][12],
            'DateJoining': inputToDate(dateObjToInput(today)) ,
            'Status':'A',
            'DateLeaving': '',
            'PartTime':''
            
            };

            if (!(inputobj.DeptCode))
            {
                inputobj.DeptCode = ''
            }
            if (!(inputobj.FirstAid))
            {
                inputobj.FirstAid = ''
            }
            if (!(inputobj.Role))
            {
                inputobj.Role = ''
            }
          
           
          if (inputobj.EmployeeCategory ==='Permanent' || inputobj.EmployeeCategory ==='HeadOffice')
          {
            inputobj.Agency ='';
            inputobj.Level='';
            inputobj.EmployeeID = inputobj.UserID;
           }
           else if (inputobj.EmployeeCategory === 'Casual')
           {
            inputobj.EmployeeID = 'Casual';
           }

            let body = new URLSearchParams(inputobj);

         
           await  api.post('/Maintenance/UserInfo/InsertExcelImportUser', body).then( 
                res => {
                    let response = res.data;
 
                    setshowuploadUsersModal(true);

                    usersinteracted++;

                    if (response === 'New User Inserted')
                    {
                       usersadded ++;
                    }
                    else if (response === 'Duplicate entries present for the UserID. Please select another User ID.') {
                    
                        usersissues ++;
                    }
                    else {
                        usersissues ++;
                    }

                 
                    if (usersinteracted === totalusers)
                    {

                        var message = "Total "+usersadded+  " Users added into DC Metrics out of "+totalusers;
                        alert(message);
                        setshowuploadUsersModal(false);
                        getTable();
        
                     }
        
                }
            ).catch(
                err => { // TODO: Error handling
                 
                   
                }
            );


           
          

        }

    }
    
    const clickAssignLeave =  (event)=>{

        
        event.preventDefault();
        leaveInput.startDate = leaveStartDate;
        leaveInput.EndDate = leaveEndDate;
        leaveInput.DCMUser = user;
       

       // UserRosterInput.EndDate = rosterEndDate;
      //  let body = new URLSearchParams(UserRosterInput);
       
        if (dateToDateObj(leaveStartDate) > dateToDateObj(leaveEndDate)) {
            setleaveModalMessageError(`Error: End Date before Start Date. Please set End date after Start date.`);
            setShowLeaveModal(true);
            return;
        }

        if (leaveInput.LessThanOneDay === 'Y')
        {
            if (leaveInput.LeaveEndTime < leaveInput.LeaveStartTime)
            {
                setleaveModalMessageError(`Error: End Time before Start Time. Please set End Time after Start date.`);
                setShowLeaveModal(true);
            return;
            }
        }

       
   
        let body = new URLSearchParams({
               'EffectiveDate': leaveStartDate,
               'IneffectiveDate':leaveEndDate,
               'UpdateBy':user,
               'StartTime':leaveInput.LeaveStartTime,
               'EndTime':leaveInput.LeaveEndTime,
               'LeaveDesc':leaveInput.LeaveType,
               'LessThanOneDay':leaveInput.LessThanOneDay,
               'UserID':leaveInput.UserID,
               'DCMUser': user,
               'EmployeeCategory': leaveInput.EmployeeCategory
        })
        

        setshowleavesModal(true);

        api.post('Maintenance/UserInfo/AssignLeave', body).then( 
            res => {
                setshowleavesModal(false);
                let response = res.data;
             
                if (response.includes('Records Approved')) 
                {
                    setleaveModalMessageError('');
                    setleaveModalMessage(response);

                   setShowLeaveModal(false);
              
                }

                
                else {
                    setleaveModalMessage(response);
                }
                setShowLeaveModal(true);
            }
        ).catch(
            
            err => { // TODO: Error handling
                console.log(err);
            }
        );
    };

    const clickPayrollChanges =  (event)=>{
        event.preventDefault();
        console.log(payrollchangesinput);
        /*
        prevent negatives
        */
        if(payrollchangesinput.OrdinaryTime < 0) {
            setpayrollchangesModalMessageError(`Error: Single time cannot be negative`);
            setShowPayrollModal(true);
            return;
        }

        if(payrollchangesinput.TimeAndHalf < 0) {
            setpayrollchangesModalMessageError(`Error: Time and half cannot be negative`);
            setShowPayrollModal(true);
            return;
        }

        if(payrollchangesinput.DoubleTime < 0) {
            setpayrollchangesModalMessageError(`Error: Double time cannot be negative`);
            setShowPayrollModal(true);
            return;
        }

        /*
        Date Section
        1 - Salary
        2 - Leading Hand
        3 - Afternoon allowance
        */
        if(
            dateToDateObj(SalaryFromDate) > dateToDateObj(SalaryToDate) 
        ) {
            setpayrollchangesModalMessageError(`Error: Salary 'from' date must come before 'to' date`);
            setShowPayrollModal(true);
            return;
        }
        
        if(
            dateToDateObj(LeadingHandFromDate) > dateToDateObj(LeadingHandToDate)
        ) {
            setpayrollchangesModalMessageError(`Error: Leading hand 'from' date must come before 'to' date`);
            setShowPayrollModal(true);
            return;
        }

        
        if(
            dateToDateObj(afternoonFromDate) > dateToDateObj(afternoonToDate)
        ) {
            setpayrollchangesModalMessageError(`Error: Afternoon Allowance 'from' date must come before 'to' date`);
            setShowPayrollModal(true);
            return;
        }

        var payrollLeadingHand = "";
        if(payrollchangesinput.LeadingHand == null|| payrollchangesinput.LeadingHand == "") {
            payrollLeadingHand = "N";
        }
        else {
            payrollLeadingHand = payrollchangesinput.LeadingHand;
        }

        var payrollOvertime = "";
        if(payrollchangesinput.PaidOvertime == null || payrollchangesinput.PaidOvertime == "") {
            payrollOvertime = "N";
        }
        else {
            payrollOvertime = payrollchangesinput.PaidOvertime;
        }

        var payrollAfternoonAllowed = "";
        if(payrollchangesinput.AfternoonAllowance == null|| payrollchangesinput.AfternoonAllowance == "") {
            payrollAfternoonAllowed = "N";
        }
        else {
            payrollAfternoonAllowed = payrollchangesinput.AfternoonAllowance;
        }

        let body = new URLSearchParams({
               'UserID': payrollchangesinput.UserID,
               'Salary':payrollchangesinput.Salary,
               'OvertimeAllowed': payrollOvertime,
               'OrdinaryTime':payrollchangesinput.OrdinaryTime,
               'TimeAndHalf':payrollchangesinput.TimeAndHalf,
               'DoubleTime':payrollchangesinput.DoubleTime,
               'DoubleAndHalf':payrollchangesinput.DoubleAndHalf,
               'SEffectiveDate':SalaryFromDate,
               'SIneffectiveDate':SalaryToDate,
               'LeadingRate':payrollchangesinput.LeadingHandRate,
               'LeadingRateAllowed':payrollLeadingHand,
               'LREffectiveDate':LeadingHandFromDate,
               'LRIneffectiveDate':LeadingHandToDate,
               'AfternoonAllowance':payrollAfternoonAllowed,
               'AEffectiveDate':afternoonFromDate,
               'AIneffectiveDate':afternoonToDate,
               'DCMUser': user
        });
        
        api.post('Maintenance/UserInfo/ChangePayroll', body).then( 
            res => {
                let response = res.data;
             
                if (response.includes('Created')) 
                {
                    setpayrollchangesModalMessageError('');
                    setShowPayrollModal(false);
                }
                
                else {
                    setpayrollchangesModalMessageError(response);
                    setShowPayrollModal(true);
                }
            }
        ).catch(
            err => { // TODO: Error handling
                console.log(err);
            }
        );
    };

    const updateUserRoster=  (event)=>
    {
        event.preventDefault();
        UserRosterInput.UserID = input.UserID;
        UserRosterInput.StartDate = rosterStartDate;
        UserRosterInput.EndDate = rosterEndDate;
        UserRosterInput.DCMUser = user;
        let body = new URLSearchParams(UserRosterInput);
       
        if (dateToDateObj(rosterStartDate) > dateToDateObj(rosterEndDate)) {
            setUpdateRosterModalMessageError(`Error: End Date before Start Date. Please set End date after Start date.`);
            setuserRosterLoadModal(false);
            return;
        }


         api.post('Maintenance/UserInfo/UpdateRoster', body).then( 
            res => {
                let response = res.data.response;
              
                if (response === 'User Roster Created') 
                {
                    setUpdateRosterModalMessageError('');
                    setupdateRosterModalMessage(response);

                   setuserRosterLoadModal(false);
              
                }

                
                else {
                    setUpdateRosterModalMessageError(`Error: Failed to connect to server. Please try again.`);
                }
                setuserRosterLoadModal(false);
            }
        ).catch(
            err => { // TODO: Error handling
                console.log(err);
            }
        );


    };


    const ActionRowButton = (params) => {

        params.columnApi.autoSizeAllColumns();
        return (

            <React.Fragment>

             <Tooltip title="Edit">
               <IconButton aria-label="Save"  onClick = {()=>editTableHandler(params)} >
               <img width={30} height={30} src={Edit}></img>
               </IconButton>
            </Tooltip>
            <Tooltip title="Assign Leave">
                  <IconButton aria-label="assign leave" onClick={() => {assignLeaveButtonHandler(params.data)}}>
                  <img width={30} height={30} src={assignleaveicon}></img>
                  </IconButton>
              </Tooltip>
              <Tooltip title="Payroll Changes">
                  <IconButton aria-label="Payroll Changes" onClick={() => {payrollChangesButtonHandler(params.data)}}>
                  <img width={30} height={30} src={calculatetotal}></img>
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
    
          fileName: 'User Details_'+user,
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

    const filterParams = {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const dateAsString = cellValue;
          const dateParts = dateAsString.split('/');
          const cellDate = new Date(
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
      };
      

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add User');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update User'); 
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Dropdown Data
        getTable();

       

        // Retrieve Dropdown Data
        api.post('/Maintenance/TeamManager/GetAllManager').then( // Team Manager List
            res => {
                let data = res.data;   
                
                dropdownData['Team Manager'] = data.map(x => x['ManagerName']);
            });
            
        api.get('/Maintenance/UserInfo/GetAllAgencies').then( // Agencies List
            res => {
                let data = res.data;
                dropdownData['Agency'] = data.map(x => x['AgencyName']);
            });
        api.get('/Maintenance/UserInfo/GetUserRole').then( // Roles List 
            res => {
                let data = res.data;
                dropdownData['Role'] = data.map(x => x['Role']);
            });
        api.get('/Maintenance/UserInfo/GetAllShiftCodes').then( // Shit Codes List 
            res => {
                let data = res.data;
                dropdownData['Shift Code'] = data.map(x => x['shiftcode']);
            });
      
            let body = new URLSearchParams({
                'EmpType': 'Casual'
            });
    
            api.post('/Maintenance/Pickers/GetLeaveTypes', body).then( // Roles List 
                res => {
                    let data = res.data;
                    dropdownData['Casual Leave Type'] = data.map(x => x.LeaveDesc);
                });

                let Pbody = new URLSearchParams({
                    'EmpType': 'Permanent'
                });
                api.post('/Maintenance/Pickers/GetLeaveTypes', Pbody).then( // Roles List 
                    res => {
                        let data = res.data;
                        dropdownData['Permanent Leave Type'] = data.map(x => x.LeaveDesc);
                    });

        api.post('/DataCapture/Pickers/GetAllCostCenters').then(
                res => {
                  let data = res.data;
                  dropdownData['Dept Code'] = data.map(x => x['CostCenter']);
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
             <h4> USER DETAILS</h4>
             </div>
             <div className="middle-header">
             <h5 >
                 Drag and Drop Files Here
             </h5>
             </div>

                <div style={styles}>
                
                <FileDrop
               
                onDrop={(files,event) => ReadExcelfile(files,event) }
                >
                  
                </FileDrop>
                </div>
    

            <div className ="add-header"> 
            
               <Tooltip title='Add Entry'>
               <IconButton aria-label='Add Entry' onClick={()=> addTableHandler()} >
               <img width={ 35 } height={35} src={Add}></img>
               </IconButton>
               </Tooltip>
               <Tooltip title='Download Excel Template'>
               <IconButton  onClick={()=> exportToCSV()} >
               <img width={ 35 } height={35} src={Download}></img>
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
           rowData={tableData} >

         <AgGridColumn headerName ="Action"  lockPosition = {true} cellRendererFramework = {ActionRowButton} minWidth={190}  colId="Action"  editable = {false} filter={false} />
         <AgGridColumn  headerName ="User ID" field="UserID" editable={false}  />
         <AgGridColumn  headerName ="First Name" field="FirstName"  />
         <AgGridColumn  headerName ="Surname" field="Surname"  />
         <AgGridColumn  headerName ="Employee ID" field="EmployeeID"  />
         <AgGridColumn  headerName ="Employee Category" field="EmployeeCategory"  />
         <AgGridColumn  headerName ="Shift Code" field="ShiftCode"  />
         <AgGridColumn  headerName ="Team Manager" field="TeamManager"  />
         <AgGridColumn  headerName ="Status" field="Status" ></AgGridColumn>
         <AgGridColumn  headerName ="Agency" field="Agency"  />
         <AgGridColumn  headerName ="Level" field="Level"  />
         <AgGridColumn  headerName ="Role" field="Role"  />
         <AgGridColumn  headerName ="Is Supervisor" field="IsManager"  />
         <AgGridColumn  headerName ="Part Time" field="PartTime"  />
         <AgGridColumn  headerName ="Dept Code" field="DeptCode"  />
         <AgGridColumn  headerName ="First Aid" field="FirstAid"  />
         <AgGridColumn  headerName ="Date Joining" field="DateJoining" filter= 'date'    minWidth={215} filterParams={filterParams} />
         <AgGridColumn  headerName ="Date Leaving" field="DateLeaving" filter= 'date'  minWidth={215} filterParams={filterParams} />

     </AgGridReact>
     </div>
     <React.Fragment>
                        <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal}  unrestrictWidth={true}
                            setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                            <div className='modal-grouping--col-3'>
                                <TextField name='UserID' label='User ID' value={input.UserID} onChange={handleInputEvent} restrictions='default' required disabled={modalMode != 1 ? true : null} ></TextField>
                                <TextField name='FirstName' label='First Name' value={input.FirstName} onChange={handleInputEvent} restrictions='default' required></TextField>
                                <TextField name='Surname' label='Surname' value={input.Surname} onChange={handleInputEvent} restrictions='default' required></TextField>
                                <TextField name='DateJoining' label='Date Joined' value={dateToInput(input.DateJoining)} onChange={dateJoiningHandler} type='date' required ></TextField>
                                <TextField name='DateLeaving' label='Date Leaving' value={dateToInput(input.DateLeaving)} onChange={dateLeavingHandler} type='date' ></TextField>
                                <DropDown name='EmployeeCategory' label='Employee Category'   options={dropdownData['Employee Category']}  defaultValue={input.EmployeeCategory} onChange={handleInputEvent} required></DropDown>
                                <TextField name='EmployeeID' label='EmployeeID' value={input.EmployeeID} onChange={handleInputEvent} type='default' required ></TextField>
                                <DropDown name='ShiftCode' label='Shift Code' options={dropdownData['Shift Code']} defaultValue={input.ShiftCode} onChange={handleInputEvent} required></DropDown>
                                <DropDown name='TeamManager' label='Team Manager' options={dropdownData['Team Manager']} defaultValue={input.TeamManager} onChange={handleInputEvent} required></DropDown>
                                <DropDown name='Status' label='Status'   options={dropdownData['Status']} optionNames={dropdownLabels['Status']} defaultValue={input.Status} onChange={handleInputEvent} required></DropDown>
                                <DropDown name='Agency' label='Agency' required={input.EmployeeCategory === 'Casual' ? true : null} disabled={input.EmployeeCategory != 'Casual' ? true : null} options={dropdownData['Agency']} defaultValue={input.Agency} onChange={handleInputEvent}></DropDown>
                                <DropDown name='Level' label='Level'  required={input.EmployeeCategory === 'Casual' ? true : null} disabled={input.EmployeeCategory != 'Casual' ? true : null} value={input.Level} options={dropdownData['Level']} defaultValue={input.Level}  optionNames={dropdownLabels['Level']}  onChange={handleInputEvent}   ></DropDown>
                                <DropDown name='Role' label='Role' options={dropdownData['Role']} defaultValue={input.Role} onChange={handleInputEvent} required></DropDown>
                                <DropDown name='DeptCode' label='Dept Code' options={dropdownData['Dept Code']} defaultValue={input.DeptCode} onChange={handleInputEvent} required></DropDown>
                                <div></div>
                                
                                <Toggle label='First Aid' checked={outputToBoolean(input.FirstAid)} onChange={firstAidHandler}></Toggle>
                                <Toggle label='Part Time' checked={outputToBoolean(input.PartTime)} onChange={partTimeHandler}></Toggle>
                                <Toggle label='Supervisor' checked={outputToBoolean(input.IsManager)} onChange={isSupervisorHandler}></Toggle>

                             
                            </div>
                        </Modal>
                        {/* Model for Assigning Leave */}
                        <Modal title='Assign Leave' buttonName='Assign Leave'  onSubmit={clickAssignLeave}  unrestrictWidth={true} showModal={showLeaveModal} setShowModal={setShowLeaveModal}
                              message={leaveModalMessage} messageError={leaveMessageError}>
                            <div className='modal-grouping--col-2'>
                                <DropDown name='LeaveType' label='Leave Type' options={leaveInput.EmployeeCategory === 'Casual' ? dropdownData['Casual Leave Type'] : dropdownData['Permanent Leave Type']} defaultValue={leaveInput.LeaveType} onChange={handleLeaveInputEvent} required></DropDown>
                                <Toggle label='Less Than One Day' checked={outputToBoolean(leaveInput.LessThanOneDay)} onChange={leaveDayHandler} ></Toggle>
                                <TextField  name='LeaveStartDate' label='Leave Start Date'  value ={leaveStartDate} onChange={ChangeLeaveStartDate} required type='date'></TextField>
                                <TextField name='LeaveStartTime' label='Start Time' disabled={leaveInput.LessThanOneDay === 'Y' ? null : true} value={leaveInput.LeaveStartTime} onChange={handleLeaveInputEvent} type='time' required ={leaveInput.LessThanOneDay === 'Y' ? true : null} ></TextField>
                                <TextField name='LeaveEndDate' label='End Date' value={leaveEndDate} onChange={ChangeLeaveEndDate} required type='date' disabled={leaveInput.LessThanOneDay === 'Y' ? true : null}></TextField>
                                <TextField name='LeaveEndTime' label='End Time' value={leaveInput.LeaveEndTime} onChange={handleLeaveInputEvent} type='time'  disabled={leaveInput.LessThanOneDay === 'Y' ? null : true} required ={leaveInput.LessThanOneDay === 'Y' ? true : null} ></TextField>
                            </div>
                        </Modal>
                        {/* Model for Payroll Changes */}
                        <Modal title='Payroll Changes' buttonName='Save'  onSubmit={clickPayrollChanges}  unrestrictWidth={true} showModal={showPayrollModal} setShowModal={setShowPayrollModal}
                          message={payrollModalMessage} messageError={payrollchangesMessageError}>
                        
                            <div className='modal-grouping--col-5'>
                            
                            <div className='modal-item'>
                            <label className='label label--position'>Salary</label>
                            </div>
                            <TextField min='0' type="number" name='Salary' label='Annual' value={payrollchangesinput.Salary} onChange={handlePayrollchangesInputEvent}  restrictions='number' required></TextField>
                            <TextField type="number" name='OrdinaryTime' label='Single Time' value={payrollchangesinput.OrdinaryTime} onChange={handlePayrollchangesInputEvent} restrictions='number' required></TextField>
                            <TextField type="number" name='TimeAndHalf' label='Time And Half' value={payrollchangesinput.TimeAndHalf} onChange={handlePayrollchangesInputEvent}  restrictions='number' required></TextField>
                            <TextField type="number" name='DoubleTime' label='Double Time' value={payrollchangesinput.DoubleTime} onChange={handlePayrollchangesInputEvent} restrictions='number' required></TextField>
                            <div></div>
                            <div className='modal-item'>
                            <label className='label label--position' >Effective From</label>
                            <input   className="modal-fields modal-fields--outline modal-fields--date" type="date" value ={SalaryFromDate} onChange={ChangeSalaryfromDate} ></input>
                            </div>
                            <div className='modal-item'>
                            <label className='label label--position' >Effective To</label>
                            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value = {SalaryToDate} onChange={ChangeSalaryToDate} ></input>
                            </div>
                            <Toggle label='Overtime' checked={outputToBoolean(payrollchangesinput.PaidOvertime)} onChange={paidOverTimeHandler}></Toggle>
                            <div></div>
                            {/*Leading Hand*/}
                            <div className='modal-item'>
                            <label className='label label--position'>Leading Hand</label>
                            </div>

                            <Toggle label='Allowed' checked={outputToBoolean(payrollchangesinput.LeadingHand)} onChange={leadingHandHandler}></Toggle>
                            <TextField type="number" name='LeadingHandRate' label='Rate'  value={payrollchangesinput.LeadingHandRate} onChange={handlePayrollchangesInputEvent} restrictions='number'  required></TextField>
                            
                            <div className='modal-item'>
                            <label className='label label--position' >Effective From</label>
                            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value ={LeadingHandFromDate} onChange={ChangeLeadinghandfromDate} ></input>
                            </div>
                            <div className='modal-item'>
                            <label className='label label--position' >Effective To</label>
                            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value = {LeadingHandToDate} onChange={ChangeLeadinghandToDate} ></input>
                            </div>
                             {/*Afternoon Allowance*/}
                             <div className='modal-item'>
                            <label className='label label--position'>Afternoon Allowance</label>
                            </div>

                            <Toggle label='Allowed' checked={outputToBoolean(payrollchangesinput.AfternoonAllowance)} onChange={afterAllowanceHandler}></Toggle> 
                            <div className='modal-item'>
                            <label className='label label--position' >Effective From</label>
                            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value ={afternoonFromDate} onChange={ChangeAfternoonfromDate} ></input>
                            </div>
                            <div className='modal-item'>
                            <label className='label label--position' >Effective To</label>
                            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value = {afternoonToDate} onChange={ChangeAfternoonToDate} ></input>
                            </div>
                            </div>
                           
                        </Modal>
                        {/* Model for updating Roster */}
                        <Modal title=' Action Successful' buttonName='Update Roster'  onSubmit={updateUserRoster}  loadModal={userRosterloadModal} message={updateRosterModalMessage} messageError={UpdateRosterMessageError}  showModal={showUpdateRoster} setShowModal={setUpdateRosterModal}>

                      <div className='modal-item'>
                      <h5 className='modal-title' >Update Roster For {input.FirstName} {input.Surname}</h5>
                       </div>      
                     <div className='modal-item'>
            <label className='label label--position' >Start Date</label>
            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value ={rosterStartDate} onChange={ChangeRosterStartDate} ></input>
            </div>

            <div className='modal-item'>
            <label className='label label--position' >End Date</label>
            <input  className="modal-fields modal-fields--outline modal-fields--date" type="date" value = {rosterEndDate} onChange={ChangeRosterEndDate} ></input>
            </div>
                        </Modal>

                        <div>
                         <div className={showuploadUsersModal ? 'modal-background' : null} ></div>
                          <div className={showuploadUsersModal ? 'modal-container modal-container--display' : 'modal-container--hide'}>
                          <div className='modal-item'>
                            
                            <h4>Excel Users are getting uploaded into DC Metrics. Please wait for a couple for minutes</h4>
                         
                          </div>
                          <div className='modal-item'>
                              <MoonLoader  color="blue" loading="true"   size={50}></MoonLoader>
                         
                          </div>
               
                          </div>
                         </div> 
                         <div>
                         <div className={showleavesModal ? 'modal-background' : null} ></div>
                          <div className={showleavesModal ? 'modal-container modal-container--display' : 'modal-container--hide'}>
                          <div className='modal-item'>
                            
                            <h4>Please wait for a couple for minutes</h4>
                         
                          </div>
                          <div className='modal-item'>
                              <MoonLoader  color="blue" loading="true"   size={50}></MoonLoader>
                         
                          </div>
               
                          </div>
                         </div> 

                         <div>
                         <div className={showuploadUsersresultModal ? 'modal-background' : null} ></div>
                          <div className={showuploadUsersresultModal ? 'modal-container modal-container--display' : 'modal-container--hide'}>
                          <div className='modal-item'>
                            
                            <h4>Users Upload Into DC Metrics</h4>
                         
                          </div>
                          <div className='modal-item'>
                              <MoonLoader  color="blue" loading="true"   size={50}></MoonLoader>
                         
                          </div>
               
                          </div>
                         </div> 


                        </React.Fragment>
                        <div>

</div>



</div>
   </div>

           </div>
           </div>
    
    
    
  );
};

export default UserDetails;