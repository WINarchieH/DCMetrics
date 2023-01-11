import React, { useState, useEffect , componentDidMount} from 'react';
import Screen from '../../../../components/screen/screen';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {LinearProgress
} from '@material-ui/core';

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

import PutawayDayGraph from './putaway_user_DayShift';
import PutawayGraphAfternoonShift from './putaway_user_AfternoonShift';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';


//import UserSummaryPerformance from './userSummaryPerformance';




import api from '../../../../components/api/api';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../../components/fields/dateHelpers';
import { height } from '@mui/system';


//import GraphTabs from './graphsTabs';



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

const useStylesAvatar = makeStyles((theme) => ({
  root: {
      display: 'flex',
      
      
  },
}))

const dropdownData = {
  'Pickrates_Exp_Day': [''],
  'Dates':[''],
  'Role':['']
 
};



  const ITEM_HEIGHT = 80;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
  
      width: 250,
    },
  },
};


 

const  UserHistory = () => {
    const classesCards = useStylesCards();
    const classesGrid = useStylesGrid();
    const classesSelect = useStylesSelect();
    const [user, setUser] = React.useState([]);

 
    const classesAvatar = useStylesAvatar();

   // const classes = useStyles();


    //state vars
    var dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 7);
    var dateTo = new Date();
    dateTo.setDate(dateTo.getDate() - 1);

    //getting the last Week Start Date and Enddate
    var beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
   var beforeOneWeek2 = new Date(beforeOneWeek);
   var day = beforeOneWeek.getDay()
   var diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
   var  lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
   var lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));

    const [fromDate, setFromDate] = React.useState(lastMonday);
    const [toDate, setToDate] = React.useState(lastSunday );

    const [loadAttributes, setLoadAttributes] = React.useState(true); // toggle this on btn click to force attributes component update
    const [loadSummaryPerformance, setLoadSummaryPerformance] = React.useState(true); // toggle this on btn click to force summary performance component update
    const [loadGraphs, setLoadGraphs] = React.useState(true); // toggle this on btn click to force graphs update
    const theme = useTheme();
    const [Role, setRole] = React.useState([]);
    

    const handleFromDateChange = (date) => {
        setFromDate(date);
    };
    const handleToDateChange = (date) => {
        setToDate(date);
    };

    const onFetchButtonClick = (e) => {
        // console.log(fromDate);
        // console.log(toDate);
       
        setLoadGraphs(!loadGraphs); //toggle boolean state to trigger graphs component reload with new dates
    }

    //Test select Methods

    
function getStyles(name, Role,  Theme) {
    return {
        fontFamily:'Montserrat', 
      fontWeight:
        Role.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  


    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setRole(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );

      
      };
    

    useEffect(() => {  // Get data at tab load

        api.get('/Maintenance/UserInfo/GetUserRole').then( // Roles List 
            res => {
                let data = res.data;
                dropdownData['Role'] = data.map(x => x['Role']);
                setRole(dropdownData['Role']);
            });

       
          

              

    }, [])



    return (
        <Screen>
              <h2 style={{ fontFamily:'Montserrat',color:'rgb(35,168,224)' }} >Daily Putaway Dashboard</h2>
            <div className={classesGrid.root}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241, 242, 242)' }}>
                            <CardContent style={{ paddingBottom: '2px', paddingTop: '2px', textAlign: 'center' }}>
                                <Typography className={classesCards.title} color="textSecondary" gutterBottom>
                                    <div>

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
                                       <FormControl style= {{ fontFamily:'Montserrat', marginTop:7}}  sx={{ m: 1, maxwidth: 300 }}>
                                       <InputLabel id="demo-multiple-name-label">Role</InputLabel>
        <Select style ={{  marginLeft:10, height: '10%', maxWidth: 400, color:'black', fontFamily:'Montserrat', fontSize: '10px' }}
         labelId="demo-multiple-name-label"
         id="demo-multiple-name"
          multiple
          value={Role}
          onChange={handleChange}
        
        
          MenuProps={MenuProps}
        >
          {dropdownData['Role'].map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, Role, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
                                        


                                        

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
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                       <PutawayDayGraph
                        startDate ={fromDate}
                        endDate={toDate}
                        role ={ Role}
                        loadGraphs={loadGraphs}
                        >
                            
                        </PutawayDayGraph>
                       

                        </CardContent>
                      
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                       <PutawayGraphAfternoonShift
                        startDate ={fromDate}
                        endDate={toDate}
                        role ={ Role}
                        loadGraphs={loadGraphs}
                        >
                            
                        </PutawayGraphAfternoonShift>
                       

                        </CardContent>
                      
                    </Card>
                </Grid>

                
                
              
                   
              
                
             
                    
                </Grid>
            </div>
        </Screen>
    );
}
export default UserHistory
