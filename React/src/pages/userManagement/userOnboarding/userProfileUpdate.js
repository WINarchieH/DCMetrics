import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Modal, { checkChange } from '../../../components/containers/modal/modal';
import DropDown from '../../../components/fields/dropdown';

import { useSelector } from 'react-redux';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import Toggle, { booleanToOutput, outputToBoolean } from '../../../components/fields/toggle';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput, TestdateObjToInput, formatDate } from '../../../components/fields/dateHelpers';

import api from '../../../components/api/api';
import props from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
//date picker
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';

// table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '../../../components/fields/textfield';
//Switch Button
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


const useStyles = makeStyles({
    root: {
        minWidth: 350,
        maxWidth: 360,
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',

    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});


const useStylesSelect = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const useStylesGrid = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
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
        'LeaveStartDate': '',
        'DCMUser': '',
        'TabletID': ''
    
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

export default function UserProfile(props) {

    const [tableData, setTableData] = React.useState([]);

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const classesGrid = useStylesGrid();

    // Parameter handlers for modal
    const dateJoiningHandler = (e) => { setInputName('DateJoining', inputToDate(e.currentTarget.value)) };
    const dateLeavingHandler = (e) => { setInputName('DateLeaving', inputToDate(e.currentTarget.value)) };
    const firstAidHandler = (e) => { setInputName('FirstAid', booleanToOutput(e)) };
    const partTimeHandler = (e) => { setInputName('PartTime', booleanToOutput(e)) };


    const [input, setInput, setInputName, handleInputEvent] = useInputState(props.input);
    const [UserRosterInput, setUserRosterInput, setUserRosterName, handleUserRosterEvent] = useInputState(defaultUserRoster);

    //default date

    defaultUserRoster.StartDate = dateObjToInput(today);
    defaultUserRoster.EndDate = dateObjToInput(today);

    const user = useSelector(store => store.user);
    defaultInput.DCMUser = user;

    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('User Details');
    const [btnAddUpdate, setBtnAddUpdate] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);
    const [updateRosterModalMessage, setupdateRosterModalMessage] = useState('');
    const [UpdateRosterMessageError, setUpdateRosterModalMessageError] = useState('');
    const [userRosterloadModal, setuserRosterLoadModal] = useState(false);
 
    const [selectedDate, setSelectedDate] = React.useState((new Date()));
    const [rosterStartDate, setrosterStartDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [rosterEndDate, setrosterEndDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const[activeusers, setActiveUsers] = useState([]);

    


 
       const handleDateChange = (date) => {
         setSelectedDate(date);
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

const updateHandler =  (event) => {
    // if (dateToDateObj(input.DateLeaving) < dateToDateObj(input.DateJoining)) {
    //     setModalMessageError(`Error: Join date after leave date. Please set leave date after join date.`);
    //     setLoadModal(false);
    //     return;
    // }
    event.preventDefault();

    if (!checkChange(originalInput, input)) {
        alert('Error: No changes have been made.');
        
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
     api.post('/Maintenance/UserInfo/UpdateUser', body).then(

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



    
    const [leaveStartDate, setleaveStartDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [leaveEndDate, setleaveEndDate] = useState(dateToInput(inputToDate(formatDate(new Date()))));
    const [userDateJoining, setuserDateJoining] = useState(inputToDate(formatDate(new Date())));
    const [error, setError] = useState(null);

    // Parameters for assign leave modal
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showUpdateRoster, setUpdateRosterModal] = useState(false);


    useEffect(() => { // Get data at tab load
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
       
    
    }, [])



   

   
    return (
        <div className={classesGrid.root}>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Card variant="outlined" style={{ width: '330%', height: '100%' }}>
                        <CardContent>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                               
                                      <div className='modal-grouping--col-4'>
                                <TextField name='UserID' label='User ID' value={input.UserID} onChange={handleInputEvent} restrictions='default' required disabled={modalMode != 1 ? true : null}   ></TextField>
                                <TextField name='FirstName' label='First Name' value={input.FirstName} onChange={handleInputEvent} restrictions='default' required></TextField>
                                <TextField name='Surname' label='Surname' value={input.Surname} onChange={handleInputEvent} restrictions='default' required></TextField>
                                <TextField name='DateJoining' label='Date Joined' value={dateToInput(input.DateJoining)} onChange={dateJoiningHandler} type='date' required ></TextField>
                                <TextField name='DateLeaving' label='Date Leaving' value={dateToInput(input.DateLeaving)} onChange={dateLeavingHandler} type='date' ></TextField>
                                <DropDown name='EmployeeCategory' label='Employee Category' disabled={input.EmployeeCategory != 'Casual' ? true : null} options={dropdownData['Employee Category']} defaultValue={input.EmployeeCategory} onChange={handleInputEvent} required></DropDown>
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
                                <Button variant="contained" color="primary" style={{width:'100%', marginTop: '20px' }} onClick={updateHandler} >Update</Button>
                            </div>
                             
                                </Typography>

                            </CardContent>
                        </CardContent>
                    </Card>
                   


                </Grid>
                
            </Grid>
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


        </div>

    );
}
