import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectMultipleFilter, SelectDateRange } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, { checkChange } from '../../../components/containers/modal/modal';

import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput, TestdateObjToInput, formatDate } from '../../../components/fields/dateHelpers';
import DropDown from '../../../components/fields/dropdown';
import Toggle, { booleanToOutput, outputToBoolean } from '../../../components/fields/toggle';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import { orderDatetime } from '../../../components/table/sortingFunctions';
import { Tooltip, IconButton } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import HealingIcon from '@material-ui/icons/Healing';
import TodayIcon from '@material-ui/icons/Today';
import './userOnboarding.scss';
import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';
import TextField from '../../../components/fields/textfield';


import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import OnboardingCheckLists from './onboardingChecklist';
import SkillsChips from './skills';
import UserCerts from './certificationsExpiry';
import UserProfile from './userProfileUpdate';
// Importing Ag Grid Community Version
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Screen from '../../../components/screen/screen';
import Header from '../../../components/header/header';

import SaveIcon from '@material-ui/icons/Save';

import Backdrop from '@material-ui/core/Backdrop';
import {ClockLoader, FadeLoader, PropagateLoader, MoonLoader} from "react-spinners";
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import { lighten } from '@material-ui/core/styles';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

import Edit from '../../../components/icons/Edit.png';
import AssignleaveIcon from '../../../components/icons/Assign_Leave.png';

import DateFnsUtils from '@date-io/date-fns';
import {  MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import autoCompleteEditor from '../../../components/agGridComponents/AutoCompleteEditor';
import DateEditor from '../../../components/agGridComponents/DateEditor';
//Switch Button
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
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

const tableTitle = 'User Onboarding and Management';
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
    'LeaveStartDate': '',
    'DCMUser': '',
    'TabletID': ''
};

const defaultLeaveInput = {
    LeaveType: '',
    LessThanOneDay: '',
    LeaveStartDate: '',
    LeaveStartTime: '',
    LeaveEndDate: '',
    LeaveEndTime: '',
    UserID: '',
    EmployeeCategory: ''
};


const defaultUserRoster = {
    StartDate: '',
    EndDate: '',
    UserID: ''
};


// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'Employee Category': ['Permanent', 'Casual', 'HeadOffice'],
    'Shift Code': [],
    'Team Manager': [],
    'Status': ['A', 'N'],
    'Agency': [],
    'Level': ['Trainee', 'Level-1', 'Level-2', 'Level-3', 'Level-4', 'Level-5', 'Level-6', 'Level-7', 'Level-8'],
    'Role': [],
    'Sex': ['F', 'M', 'X'],
    'Dept Code': [],
    'Leave Type': []
};

// Relabelling Dropdown labels
const dropdownLabels = {
    'Status': ['Active', 'Inactive'],
    'Level': ['Trainee', 'Level-1', 'Level-2', 'Level-3', 'Level-4', 'Level-5', 'Level-6', 'Level-7', 'Level-8'],
    'Sex': ['Female', 'Male', 'Unspecified']
};

const initialTableFilters = [
    { id: 'Status', value: ['A'] }
];



const UserOnboarding = () => {

    const user = useSelector(store => store.user);
    defaultInput.DCMUser = user;

    const [tableData, setTableData] = useState([]);
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const [leaveInput, setLeaveInput, setLeaveInputName, handleLeaveInputEvent] = useInputState(defaultLeaveInput);
    const [UserRosterInput, setUserRosterInput, setUserRosterName, handleUserRosterEvent] = useInputState(defaultUserRoster);

    //default date

    defaultUserRoster.StartDate = dateObjToInput(today);
    defaultUserRoster.EndDate = dateObjToInput(today);

    // Parameter handlers for modal
    const dateJoiningHandler = (e) => { setInputName('DateJoining', inputToDate(e.currentTarget.value)) };
    const dateLeavingHandler = (e) => { setInputName('DateLeaving', inputToDate(e.currentTarget.value)) };
    const firstAidHandler = (e) => { setInputName('FirstAid', booleanToOutput(e)) };
    const partTimeHandler = (e) => { setInputName('PartTime', booleanToOutput(e)) };
    const leaveDayHandler = (e) => { setLeaveInputName('LessThanOneDay', booleanToOutput(e)); setleaveEndDate(leaveStartDate) };
    const leaveStartDateHandler = (e) => { setLeaveInputName('LeaveStartDate', inputToDate(e.currentTarget.value)) };
    const leaveEndDateHandler = (e) => { setLeaveInputName('LeaveEndDate', inputToDate(e.currentTarget.value)) };

    // Current State
    const [tableLoading, setTableLoading] = useState(true);

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('User Details');
    const [btnAddUpdate, setBtnAddUpdate] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [userRosterloadModal, setuserRosterLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [updateRosterModalMessage, setupdateRosterModalMessage] = useState('');
    const [leaveModalMessage, setleaveModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [UpdateRosterMessageError, setUpdateRosterModalMessageError] = useState('');
    const [leaveMessageError, setleaveModalMessageError] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowparams, setrowparams] = useState(null);
    const [state, setState] = React.useState({ checkedB: false});
    const [arractiveusers, setactiveusers ] = useState([]);
    const [allusers, setallusers ] = useState([]);
   
         //Backdrop
    const [open, setOpen] = React.useState(false);
   
    //Start and End Date Handlers
    const [rosterStartDate, setrosterStartDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [rosterEndDate, setrosterEndDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [leaveStartDate, setleaveStartDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [leaveEndDate, setleaveEndDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [userDateJoining, setuserDateJoining] = useState(inputToDate(formatDate(new Date())));
    const [error, setError] = useState(null);

    // Parameters for assign leave modal
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showUpdateRoster, setUpdateRosterModal] = useState(false);


    const tableColumns = [
        { Header: 'User ID', accessor: 'UserID', modalType: 'textbox' },
        { Header: 'First Name', accessor: 'FirstName', modalType: 'textbox' },
        { Header: 'Surname', accessor: 'Surname', modalType: 'textbox' },
        { Header: 'Employee ID', accessor: 'EmployeeID', modalType: 'textbox' },
        { Header: 'Employee Category', accessor: 'EmployeeCategory', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Shift Code', accessor: 'ShiftCode', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Team Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Status', accessor: 'Status', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Agency', accessor: 'Agency', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Level', accessor: 'Level', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'First Aid', accessor: 'FirstAid', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'toggle' },
        { Header: 'Role', accessor: 'Role', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Part Time', accessor: 'PartTime', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'toggle' },
        { Header: 'Tablet ID', accessor: 'TabletID', modalType: 'textbox' },
        { Header: 'Dept Code', accessor: 'DeptCode', Filter: SelectMultipleFilter, filter: 'equality', modalType: 'dropdown' },
        { Header: 'Date Joined', accessor: 'DateJoining', Filter: SelectDateRange, filter: 'date', modalType: 'textbox', Cell: DateCell, sortType: orderDatetime },
        { Header: 'Date Leaving', accessor: 'DateLeaving', Filter: SelectDateRange, filter: 'date', modalType: 'textbox', Cell: DateCell, sortType: orderDatetime }
    ];

    // Event Handlers for Table
    const addTableHandler = () => {

        defaultInput.DateJoining = userDateJoining;
        //  defaultInput.DateJoining =  defaultInput.DateJoining.replaceAll('-','/');
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
       setShowModal(true); 
       
       setValue(0); //always open user profile tab
    };

    // Component for Conditional Actions
    const assignLeaveButtonHandler = (data) => {
        defaultLeaveInput.UserID = data.UserID;
        defaultLeaveInput.DCMUser = user;
        defaultLeaveInput.EmployeeCategory = data.EmployeeCategory;
        setleaveModalMessage('');
        setShowLeaveModal(true);
        setLeaveInput(defaultLeaveInput);
    };

 


    // Function to send requests to update table
    const getTable = async () => {
        setOpen(true);
        input.DCMUser = defaultInput.DCMUser;
        let body = new URLSearchParams(input);

        var activeusers =[];
        await api.post('/Maintenance/UserInfo/GetAllUsers', body).then(
            res => {
                let data = res.data;
                // Convert dates to date objects  
                data = data.map(x => {

                    x.DateJoining = dateObjToDate(dateToDateObj(x.DateJoining));
                    x.DateLeaving = dateObjToDate(dateToDateObj(x.DateLeaving));
                    if (x.Status ==="A")
                    {
                        activeusers.push(x);
                    }
        
                });
                setactiveusers(activeusers);
                setallusers(data);
                setTableData(activeusers);
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


    //Roster Start date And End Change Event
    const ChangeRosterStartDate = (event) => {
        setupdateRosterModalMessage('');
        setrosterStartDate(dateToInput(inputToDate(event.target.value)));
    };

    const ChangeRosterEndDate = (event) => {
        setupdateRosterModalMessage('');
        setrosterEndDate(dateToInput(inputToDate(event.target.value)));
    };

    const ChangeLeaveStartDate = (event) => {
        setleaveModalMessage('');
        setleaveStartDate(dateToInput(inputToDate(event.target.value)));
        setleaveEndDate(dateToInput(inputToDate(event.target.value)));
    };

    const ChangeLeaveEndDate = (event) => {
        setleaveModalMessage('');
        setleaveEndDate(dateToInput(inputToDate(event.target.value)));
    };

    const addHandler = () => {


        if (new Date(dateToInput(input.DateLeaving)) < new Date(dateToInput(input.DateJoining))) {
            setModalMessageError(`Error: Join date after leave date. Please set leave date after join date.`);
            setLoadModal(false);
            return;
        }

        if (input.EmployeeCategory === 'Permanent' || input.EmployeeCategory === 'HeadOffice') {
            input.Agency = '';
            input.Level = '';
            input.EmployeeID = input.UserID;
        }
        else if (input.EmployeeCategory === 'Casual') {
            input.EmployeeID = 'Casual';
        }



        let body = new URLSearchParams(input);

        api.post('/Maintenance/UserInfo/AddUser', body).then(
            res => {
                let response = res.data.response;

                if (response === 'New User Inserted') {
                    getTable();
                    // setModalMessage(`User ${input.FirstName} successfully added.`);

                    setShowModal(false);
                    setrosterStartDate(dateToInput(inputToDate(formatDate(new Date()))));
                    setrosterEndDate(dateToInput(inputToDate(formatDate(new Date()))));

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

        if (input.EmployeeCategory === 'Permanent' || input.EmployeeCategory === 'HeadOffice') {
            input.Agency = '';
            input.Level = '';
            input.EmployeeID = input.UserID;
        }
        else if (input.EmployeeCategory === 'Casual') {
            input.EmployeeID = 'Casual';
        }



        let body = new URLSearchParams(input);
        await api.post('/Maintenance/UserInfo/UpdateUser', body).then(

            res => {
                let response = res.data.response;

                if (response === 'Selected User Updated') {

                    // Update table on the frontend
                    let data = tableData.slice();
                    let index = data.map(x => x.UserID).indexOf(originalInput.UserID);

                    // Convert input to appropriate data type
                    let newTableInput = Object.assign({}, input);
                    newTableInput.DateJoining = dateToDateObj(newTableInput.DateJoining);
                    newTableInput.DateLeaving = dateToDateObj(newTableInput.DateLeaving);

                    data[index] = newTableInput;
                    setTableData(data);
                    setShowModal(false);

                    setrosterStartDate(dateToInput(inputToDate(formatDate(new Date()))));
                    setrosterEndDate(dateToInput(inputToDate(formatDate(new Date()))));

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



    const clickAssignLeave = (event) => {

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

        if (leaveInput.LessThanOneDay === 'Y') {
            if (leaveInput.LeaveEndTime < leaveInput.LeaveStartTime) {
                setleaveModalMessageError(`Error: End Time before Start Time. Please set End Time after Start date.`);
                setShowLeaveModal(true);
                return;
            }
        }

        let body = new URLSearchParams({

            'FromDate': leaveStartDate,
            'ToDate': leaveEndDate,
            'UpdateBy': user,
            'StartTime': leaveInput.LeaveStartTime,
            'EndTime': leaveInput.LeaveEndTime,
            'LeaveDesc': leaveInput.LeaveType,
            'LessThanOneDay': leaveInput.LessThanOneDay,
            'UserID': leaveInput.UserID,
            'DCMUser': user,
            'EmployeeCategory': leaveInput.EmployeeCategory
        })

        api.post('Maintenance/UserInfo/AssignLeave', body).then(
            res => {
                let response = res.data;

                if (response.includes('Records Approved')) {
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


    const ActionRowButton = (params) => {
        params.columnApi.autoSizeAllColumns();
        if (params.data.EmployeeCategory != 'Casual') {

            return (

                <React.Fragment>
                        <Tooltip >
                                <IconButton aria-label="Edit"  onClick = {()=>editTableHandler(params)} >
                                <img height={30} width ={30} src={Edit}></img>
                                </IconButton>
                                </Tooltip>


                    <Tooltip title="Assign Leave">
                        <IconButton aria-label="assign leave" onClick={() => { assignLeaveButtonHandler(params.data) }}>
                        <img height={30} width ={30} src={AssignleaveIcon}></img>
                        </IconButton>
                    </Tooltip>


                </React.Fragment>


            );
        }
        else
        { 
            return(
            <React.Fragment>
            <Tooltip title="Edit">
            <IconButton aria-label="Edit"  onClick = {()=>editTableHandler(params)} >
            <img height={30} width ={30} src={Edit}></img>
            </IconButton>
            </Tooltip>            
             </React.Fragment>
             );

        }
    };
        
       const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
       };


      const ExportDataToCSVFile =() =>
     {
          var excelParams = {
    
          fileName: 'User Onboarding_'+user,
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



    const updateUserRoster = (event) => {

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

                if (response === 'User Roster Created') {
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

    const handleSwitchChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });

           input.DCMUser = defaultInput.DCMUser;
           let body = new URLSearchParams(input);


        //   if (event.target.checked === true)
        //   {
        //       setTableData(allusers);
        //   }
        //   else
        //   {
        //     setTableData(arractiveusers);
        //   }
       
      };
    

    const addUpdateHandler = (event) => { // Form switchs submit eveent
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
            setModalTitle('Add User');
            setBtnAddUpdate('Add');
        }
        else {
            setModalTitle('Update User');
            setBtnAddUpdate('Update');
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

        api.get('/Maintenance/Pickers/GetLeaveTypes').then( // Roles List 
            res => {
                let data = res.data;
                dropdownData['Leave Type'] = data.map(x => x.LeaveDesc);
            });

        api.post('/DataCapture/Pickers/GetAllCostCenters').then(
            res => {
                let data = res.data;
                dropdownData['Dept Code'] = data.map(x => x['CostCenter']);
            });
            
    }, []);



    // MUI Tabs
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-auto-tabpanel-${index}`}
                aria-labelledby={`scrollable-auto-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
    }));


    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

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
             <h4>USER ONBOARDING AND MANAGEMENT</h4>
             </div>
             {/* <div className = "date-header">
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
        </div> */}
    
            <div className ="add-header"> 

            <Tooltip title='Get All Users'>
            <Switch checked={state.checkedB}onChange={handleSwitchChange} name="checkedB" color="primary" />
               </Tooltip>
            
            <Tooltip title='Add User'>
               <IconButton aria-label='ExportCSV' onClick={()=>addTableHandler()} >
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
              autoCompleteEditor:autoCompleteEditor,
              DateEditor: DateEditor
             }}
          
           pagination ={true}
           animateRows= {true}
       rowSelection = "multiple"
       rowData={tableData}
     >

         <AgGridColumn headerName ="Action"  lockPosition = {true} cellRendererFramework = {ActionRowButton}   colId="Action"  editable = {false} filter={false} />
         <AgGridColumn  headerName ="User ID" field="UserID" editable={false}  />
         <AgGridColumn  headerName ="Firstname" field="FirstName"  />
         <AgGridColumn  headerName ="Surname" field="Surname"  />
         
         <AgGridColumn  headerName ="Employee ID" field="EmployeeID" editable={false}    />
         <AgGridColumn  headerName ="Employee Category" field="EmployeeCategory"  cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: dropdownData['Employee Category']}}  />
         <AgGridColumn  headerName ="Shift Code" field="ShiftCode"  cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: dropdownData['Shift Code']}} />
         <AgGridColumn  headerName ="Team Manager" field="TeamManager" cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: dropdownData['Team Manager']}}   />
         <AgGridColumn  headerName ="Status" field="Status" cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: dropdownData['Status']}}  />
         <AgGridColumn  headerName ="Agency" field="Agency" cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: dropdownData['Agency']}}  />
         <AgGridColumn  headerName ="Level" field="Level" cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: dropdownData['Level']}}   />

         
         <AgGridColumn  headerName ="First Aid" field="FirstAid"  />
         <AgGridColumn  headerName ="Role" field="Role" cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: dropdownData['Role']}}  />
         <AgGridColumn  headerName ="Part Time" field="PartTime" cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: ['Y','N']}}   />
         <AgGridColumn  headerName ="Tablet ID" field="TabletID"   />
         <AgGridColumn  headerName ="Dept Code" field="DeptCode" cellEditor= "autoCompleteEditor"  cellEditorParams= {{ options: dropdownData['Dept Code']}}  />
         <AgGridColumn  headerName ="Date Joining" field="DateJoining"  />
         <AgGridColumn  headerName ="Date Leaving" field="DateLeaving"  />

     </AgGridReact>
     </div>
   
     <div>
     <React.Fragment>
                <Modal style={{width:'600px'}} title={modalTitle} showModal={showModal} unrestrictWidth={true}
                    setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>

                    <div className={classes.root}>
                        <AppBar position="static" color="default">
                            <Tabs
                                value={value}
                                onChange={handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                            >
                                <Tab label="User Profile" {...a11yProps(0)} />
                                <Tab label="Onboarding Checklist" {...a11yProps(1)} />
                                <Tab label="Skills" {...a11yProps(2)} />
                                <Tab label="Certs. Expiry" {...a11yProps(3)} />
                               {/* // <Tab label="Time Off" {...a11yProps(4)} /> */}
                                {/* <Tab label="User Profile Update" {...a11yProps(5)} /> */}
                            </Tabs>
                        </AppBar>
                        {/* <TabPanel value={value} index={0}>
                            <div className='modal-grouping--col-4'>
                                <TextField name='UserID' label='User ID' value={input.UserID} onChange={handleInputEvent} restrictions='default' required disabled={modalMode != 1 ? true : null} ></TextField>
                                <TextField name='FirstName' label='First Name' value={input.FirstName} onChange={handleInputEvent} restrictions='default' required></TextField>
                                <TextField name='Surname' label='Surname' value={input.Surname} onChange={handleInputEvent} restrictions='default' required></TextField>
                                <TextField name='DateJoining' label='Date Joined' value={dateToInput(input.DateJoining)} onChange={dateJoiningHandler} type='date' required ></TextField>
                                <TextField name='DateLeaving' label='Date Leaving' value={dateToInput(input.DateLeaving)} onChange={dateLeavingHandler} type='date' ></TextField>
                                <DropDown name='EmployeeCategory' label='Employee Category' options={dropdownData['Employee Category']} defaultValue={input.EmployeeCategory} onChange={handleInputEvent} required></DropDown>
                                <DropDown name='ShiftCode' label='Shift Code' options={dropdownData['Shift Code']} defaultValue={input.ShiftCode} onChange={handleInputEvent} required></DropDown>
                                <DropDown name='TeamManager' label='Team Manager' options={dropdownData['Team Manager']} defaultValue={input.TeamManager} onChange={handleInputEvent} required></DropDown>
                                <DropDown name='Status' label='Status' options={dropdownData['Status']} optionNames={dropdownLabels['Status']} defaultValue={input.Status} onChange={handleInputEvent} required></DropDown>
                                <DropDown name='Agency' label='Agency' required={input.EmployeeCategory === 'Casual' ? true : null} disabled={input.EmployeeCategory != 'Casual' ? true : null} options={dropdownData['Agency']} defaultValue={input.Agency} onChange={handleInputEvent}></DropDown>
                                <DropDown name='Level' label='Level' required={input.EmployeeCategory === 'Casual' ? true : null} disabled={input.EmployeeCategory != 'Casual' ? true : null} value={input.Level} options={dropdownData['Level']} defaultValue={input.Level} optionNames={dropdownLabels['Level']} onChange={handleInputEvent}   ></DropDown>
                                <DropDown name='Role' label='Role' options={dropdownData['Role']} defaultValue={input.Role} onChange={handleInputEvent} required></DropDown>
                                <DropDown name='DeptCode' label='Dept Code' options={dropdownData['Dept Code']} defaultValue={input.DeptCode} onChange={handleInputEvent} required></DropDown>
                                <TextField name='TabletID' label='Tablet ID' value={input.TabletID} onChange={handleInputEvent} restrictions='default' required></TextField>

                                <Toggle label='First Aid' checked={outputToBoolean(input.FirstAid)} onChange={firstAidHandler}></Toggle>
                                <Toggle label='Part Time' checked={outputToBoolean(input.PartTime)} onChange={partTimeHandler}></Toggle>
                            </div>
                            <div style={{width:'100%'}}>
                                <Button variant="contained" color="primary" style={{width:'100%', marginTop: '20px' }} onClick={addUpdateHandler}>{btnAddUpdate}</Button>
                            </div>


                        </TabPanel> */}
                         <TabPanel value={value} index={0}>
                            < UserProfile input={input} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <OnboardingCheckLists
                                userID={input.UserID}
                            />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <SkillsChips
                                userID={input.UserID}
                            />
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <UserCerts
                                userID={input.UserID}
                            />
                        </TabPanel>
                        
                       

                    </div>

                </Modal>
                <Modal title='Assign Leave' buttonName='Assign Leave' onSubmit={clickAssignLeave} unrestrictWidth={true} showModal={showLeaveModal} setShowModal={setShowLeaveModal}
                    message={leaveModalMessage} messageError={leaveMessageError}

                >
                    <div className='modal-grouping--col-2'>
                        <DropDown name='LeaveType' label='Leave Type' options={dropdownData['Leave Type']} defaultValue={leaveInput.LeaveType} onChange={handleLeaveInputEvent} required></DropDown>
                        <Toggle label='Less Than One Day' checked={outputToBoolean(leaveInput.LessThanOneDay)} onChange={leaveDayHandler} ></Toggle>
                        <TextField name='LeaveStartDate' label='Leave Start Date' value={leaveStartDate} onChange={ChangeLeaveStartDate} required type='date'></TextField>
                        <TextField name='LeaveStartTime' label='Start Time' disabled={leaveInput.LessThanOneDay === 'Y' ? null : true} value={leaveInput.LeaveStartTime} onChange={handleLeaveInputEvent} type='time' required={leaveInput.LessThanOneDay === 'Y' ? true : null} ></TextField>
                        <TextField name='LeaveEndDate' label='End Date' value={leaveEndDate} onChange={ChangeLeaveEndDate} required type='date' disabled={leaveInput.LessThanOneDay === 'Y' ? true : null}></TextField>
                        <TextField name='LeaveEndTime' label='End Time' value={leaveInput.LeaveEndTime} onChange={handleLeaveInputEvent} type='time' disabled={leaveInput.LessThanOneDay === 'Y' ? null : true} required={leaveInput.LessThanOneDay === 'Y' ? true : null} ></TextField>
                    </div>
                </Modal>
                <Modal title=' Action Successful' buttonName='Update Roster' onSubmit={updateUserRoster} loadModal={userRosterloadModal} message={updateRosterModalMessage} messageError={UpdateRosterMessageError} showModal={showUpdateRoster} setShowModal={setUpdateRosterModal}>

                    <div className='modal-item'>
                        <h5 className='modal-title' >Update Roster For {input.FirstName} {input.Surname}</h5>
                    </div>
                    <div className='modal-item'>
                        <label className='label label--position' >Start Date</label>
                        <input className="modal-fields modal-fields--outline modal-fields--date" type="date" value={rosterStartDate} onChange={ChangeRosterStartDate} ></input>
                    </div>

                    <div className='modal-item'>
                        <label className='label label--position' >End Date</label>
                        <input className="modal-fields modal-fields--outline modal-fields--date" type="date" value={rosterEndDate} onChange={ChangeRosterEndDate} ></input>
                    </div>
                </Modal>
            </React.Fragment>

     </div>


            </div>

        </div>

                </div>
                </div>
        );
};

export default UserOnboarding;