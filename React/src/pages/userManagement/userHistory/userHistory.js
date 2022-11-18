import React, { useState, useEffect } from 'react';
import Screen from '../../../components/screen/screen';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {ClipLoader,SyncLoader} from "react-spinners";

//grid
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

//date picker
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import UserAttributes from './userAttributes';
import UserSummaryPerformance from './userSummaryPerformance';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import api from '../../../components/api/api';

import GraphTabs from './graphsTabs';
import './userhistory.scss';

const useStylesCards = makeStyles({
    root: {
        minWidth: 275,
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
        marginBottom: 10,
    },
    date:{
        fontFamily:'Montserrat',
    }
    ,
    heading:
    {
      fontFamily:'Montserrat',
      color:'rgb(35,168,224)'
    }
});

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

const useStylesSelect = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
  
}));

// const dropdownData = {
//     'UserList': []
// };


export default function UserHistory() {
    const classesCards = useStylesCards();
    const classesGrid = useStylesGrid();
    const classesSelect = useStylesSelect();

    //state vars
    var dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 29);
    var dateTo = new Date();
    dateTo.setDate(dateTo.getDate() - 1);
    const [fromDate, setFromDate] = React.useState(dateFrom);
    const [toDate, setToDate] = React.useState(dateTo);

    const [loadAttributes, setLoadAttributes] = React.useState(true); // toggle this on btn click to force attributes component update
    const [loadSummaryPerformance, setLoadSummaryPerformance] = React.useState(true); // toggle this on btn click to force summary performance component update
    const [loadGraphs, setLoadGraphs] = React.useState(true); // toggle this on btn click to force graphs update
    const [userName, setUserName] = React.useState('');
    const [userID, setUserID] = React.useState('');

    const [dropdownUsers,setDropDownUsers]= React.useState([]);

    const handleChangeSelect = (event) => {
        const uname = event.target.value;
        if (uname) {
            var names = uname.split(' ');
            // var FirstName = names[0];
            // var SurName = names[names.length - 2];

            names[names.length - 1] = names[names.length - 1].replace('(', '').replace(')', '');
            setUserID(names[names.length - 1]);
        }

        setUserName(event.target.value);
    };

    const handleFromDateChange = (date) => {
        setFromDate(date);
    };
    const handleToDateChange = (date) => {
        setToDate(date);
    };

    const onFetchButtonClick = (e) => {
        // console.log(fromDate);
        // console.log(toDate);
        setLoadAttributes(!loadAttributes); //toggle boolean state to trigger attributes component reload with new dates
        setLoadSummaryPerformance(!loadSummaryPerformance); //toggle boolean state to trigger summary performance component reload with new dates
        setLoadGraphs(!loadGraphs); //toggle boolean state to trigger graphs component reload with new dates
    }

    useEffect(() => { // Get data at tab load

        api.post('/Maintenance/Pickers/GetAllUserNames').then( // Reasons Codes List 
            res => {
                let data = res.data;
                // dropdownData['UserList'] = data.map(x => x);
                setDropDownUsers( data.map(x => x)); 
            }).catch(() => { });

    }, [])



    return (
        <Screen>
             <h2 style={{ fontFamily:'Montserrat',color:'rgb(35,168,224)' }} >User History</h2>
            <div className={classesGrid.root}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241, 242, 242)' }}>
                            <CardContent style={{ paddingBottom: '2px', paddingTop: '2px', textAlign: 'center' }}>
                                <Typography className={classesCards.title} color="textSecondary" gutterBottom>
                                    <div>
                                        <FormControl className={classesSelect.formControl}>
                                            <InputLabel shrink id="demo-simple-select-placeholder-label-label"  variant="h6"
                                                           style={{ color:"black", fontWeight:'bold', fontFamily:'Montserrat',  marginTop: '8px'}}>
                                                Select User
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-placeholder-label-label"
                                                id="demo-simple-select-placeholder-label"
                                                value={userName}
                                                onChange={handleChangeSelect}
                                                displayEmpty
                                                className={classesSelect.selectEmpty}
                                                style={{ marginTop: '24px' }}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {dropdownUsers.map((uName) => (
                                                    <MenuItem style={{ fontFamily:'Montserrat'}} value={uName}>{uName}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>


                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                           
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="dd/MM/yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="From Date"
                                                value={fromDate}
                                                onChange={handleFromDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                style={{paddingRight:'1em' , color:"black" ,fontWeight:'bold', fontFamily:'Montserrat'}}
                                            />
                                        </MuiPickersUtilsProvider>

                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                animateYearScrolling={true}
                                                format="dd/MM/yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="To Date"
                                                value={toDate}
                                                
                                                InputProps={{ className: classesGrid.date }}
                                                onChange={handleToDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                style={{paddingRight:'1em' , color:'black', fontWeight:'bold', fontFamily:'Montserrat'}}
                                            />
                                        </MuiPickersUtilsProvider>

                                        <Button
                                            variant="contained"
                                            
                                            
                                            size="small"
                                            style={{ marginLeft: '40px', marginTop: '26px',color:'white',backgroundColor:'rgb(35,168,224)' }}
                                            onClick={(e) => onFetchButtonClick(e)}
                                        >
                                            Update
                                        </Button>
                                    </div>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <UserAttributes
                            startDate={fromDate.toString().substr(4, 11)}
                            endDate={toDate.toString().substr(4, 11)}
                            userID={userID}
                            loadAttributes={loadAttributes}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <UserSummaryPerformance
                            startDate={fromDate.toString().substr(4, 11)}
                            endDate={toDate.toString().substr(4, 11)}
                            userID={userID}
                            loadSummaryPerformance={loadSummaryPerformance}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <GraphTabs
                            startDate={fromDate.toString().substr(4, 11)}
                            endDate={toDate.toString().substr(4, 11)}
                            userID={userID}
                            loadGraphs={loadGraphs}
                        />
                    </Grid>


                </Grid>
            </div>
        </Screen>
    );
}
